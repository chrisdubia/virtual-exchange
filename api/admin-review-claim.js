import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { adminUserId, claimId, action, rejectionReason } = req.body
  if (!adminUserId || !claimId || !action) return res.status(400).json({ error: 'Missing required fields' })
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Service not configured' })

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Verify admin
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', adminUserId).single()
  if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })

  // Get claim details
  const { data: claim } = await supabase
    .from('profile_claims')
    .select('*, organizations(name)')
    .eq('id', claimId)
    .single()

  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  // Update claim status
  await supabase
    .from('profile_claims')
    .update({ status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: adminUserId })
    .eq('id', claimId)

  // If approving: mark org as claimed
  if (action === 'approve') {
    await supabase
      .from('organizations')
      .update({ claimed: true, claimed_by: claim.user_id, claimed_at: new Date().toISOString() })
      .eq('id', claim.organization_id)
  }

  // Send email to claimant
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (RESEND_API_KEY) {
    const orgName = claim.organizations?.name || 'your organization'
    const approved = action === 'approve'
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
          to: claim.email,
          subject: approved ? `Profile Claim Approved: ${orgName}` : `Profile Claim Update: ${orgName}`,
          html: approved
            ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">Your Claim Has Been Approved!</h2>
                <p>Hi ${claim.name},</p>
                <p>Great news — your request to claim the profile for <strong>${orgName}</strong> has been approved.</p>
                <p>You can now log in and manage your organization's profile on The Virtual Exchange.</p>
                <p style="color:#6b7280;font-size:14px">Questions? Contact us at hello@thevirtualexchange.org</p>
              </div>`
            : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">Profile Claim Update</h2>
                <p>Hi ${claim.name},</p>
                <p>Unfortunately, your request to claim the profile for <strong>${orgName}</strong> could not be approved at this time.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
                <p>If you believe this is an error, please contact us at hello@thevirtualexchange.org</p>
              </div>`
        })
      })
    } catch (e) { console.error('Email error:', e) }
  }

  return res.status(200).json({ success: true })
}
