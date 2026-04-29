import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { adminUserId, orgId, action, rejectionReason } = req.body
  if (!adminUserId || !orgId || !action) return res.status(400).json({ error: 'Missing required fields' })
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Service not configured' })

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Verify admin
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', adminUserId).single()
  if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })

  const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single()
  if (!org) return res.status(404).json({ error: 'Organization not found' })

  const approved = action === 'approve'
  await supabase
    .from('organizations')
    .update({
      approval_status: approved ? 'approved' : 'rejected',
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? adminUserId : null,
      rejection_reason: approved ? null : (rejectionReason || null)
    })
    .eq('id', orgId)

  // Notify submitter
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (RESEND_API_KEY && org.submitter_email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
          to: org.submitter_email,
          subject: approved ? `Organization Approved: ${org.name}` : `Organization Submission Update: ${org.name}`,
          html: approved
            ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">Organization Approved!</h2>
                <p>Hi ${org.submitter_name || 'there'},</p>
                <p><strong>${org.name}</strong> has been approved and is now live on The Virtual Exchange.</p>
                <p>You can now find it in the directory and claim the profile if you haven't already.</p>
                <p style="color:#6b7280;font-size:14px">Questions? Contact us at hello@thevirtualexchange.org</p>
              </div>`
            : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">Organization Submission Update</h2>
                <p>Hi ${org.submitter_name || 'there'},</p>
                <p>Your submission for <strong>${org.name}</strong> could not be approved at this time.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
                <p>Please contact us at hello@thevirtualexchange.org if you have questions.</p>
              </div>`
        })
      })
    } catch (e) { console.error('Email error:', e) }
  }

  return res.status(200).json({ success: true })
}
