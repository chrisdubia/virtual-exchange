import { createClient } from '@supabase/supabase-js'

const getSupabase = () => {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const sendEmail = async (to, subject, html) => {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ from: 'The Virtual Exchange <hello@thevirtualexchange.org>', to, subject, html })
    })
    if (!r.ok) { const b = await r.json().catch(() => ({})); console.error('Email send failed:', b) }
  } catch (e) { console.error('Email error:', e) }
}

export default async function handler(req, res) {
  const supabase = getSupabase()
  if (!supabase) return res.status(500).json({ error: 'Service not configured' })

  // GET — fetch pending claims and orgs
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'Missing userId' })

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
    if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })

    const [claimsResult, orgsResult] = await Promise.all([
      supabase.from('profile_claims').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('organizations').select('*').eq('approval_status', 'pending').order('created_at', { ascending: false })
    ])

    return res.status(200).json({ claims: claimsResult.data || [], pendingOrgs: orgsResult.data || [] })
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { adminUserId, action, rejectionReason } = req.body
  if (!adminUserId || !action) return res.status(400).json({ error: 'Missing required fields' })

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', adminUserId).single()
  if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })

  // POST action: review-claim
  if (action === 'review-claim') {
    const { claimId, decision } = req.body
    if (!claimId || !decision) return res.status(400).json({ error: 'Missing claimId or decision' })

    const { data: claim } = await supabase.from('profile_claims').select('*').eq('id', claimId).single()
    if (!claim) return res.status(404).json({ error: 'Claim not found' })

    await supabase.from('profile_claims').update({
      status: decision === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUserId
    }).eq('id', claimId)

    if (decision === 'approve') {
      const { data: updated, error: updateErr } = await supabase.from('organizations').update({
        claimed: true, claimed_by: claim.user_id, claimed_at: new Date().toISOString()
      }).eq('id', claim.organization_id).select()
      if (updateErr) {
        console.error('Org update error:', updateErr)
        return res.status(500).json({ error: 'Failed to mark organization as claimed', detail: updateErr.message })
      }
      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: `Organization ${claim.organization_id} not found in database — cannot mark as claimed.` })
      }
    }

    const orgName = claim.org_name || 'your organization'
    const approved = decision === 'approve'
    await sendEmail(
      claim.email,
      approved ? `Profile Claim Approved: ${orgName}` : `Profile Claim Update: ${orgName}`,
      approved
        ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1f2937">Your Claim Has Been Approved!</h2><p>Hi ${claim.name},</p><p>Your request to claim <strong>${orgName}</strong> has been approved. You can now log in and manage your organization's profile.</p><p style="color:#6b7280;font-size:14px">Questions? Contact hello@thevirtualexchange.org</p></div>`
        : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1f2937">Profile Claim Update</h2><p>Hi ${claim.name},</p><p>Your request to claim <strong>${orgName}</strong> could not be approved at this time.</p>${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}<p>Questions? Contact hello@thevirtualexchange.org</p></div>`
    )

    return res.status(200).json({ success: true })
  }

  // POST action: review-org
  if (action === 'review-org') {
    const { orgId, decision } = req.body
    if (!orgId || !decision) return res.status(400).json({ error: 'Missing orgId or decision' })

    const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single()
    if (!org) return res.status(404).json({ error: 'Organization not found' })

    const approved = decision === 'approve'
    const updatePayload = {
      approval_status: approved ? 'approved' : 'rejected',
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? adminUserId : null,
    }

    const { error: updateErr } = await supabase.from('organizations').update(updatePayload).eq('id', orgId)
    if (updateErr) {
      console.error('Org approval update failed:', updateErr)
      return res.status(500).json({ error: 'Failed to update organization status', detail: updateErr.message })
    }

    if (org.submitter_email) {
      await sendEmail(
        org.submitter_email,
        approved ? `Organization Approved: ${org.name}` : `Organization Submission Update: ${org.name}`,
        approved
          ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1f2937">Organization Approved!</h2><p>Hi ${org.submitter_name || 'there'},</p><p><strong>${org.name}</strong> is now live on The Virtual Exchange.</p><p style="color:#6b7280;font-size:14px">Questions? Contact hello@thevirtualexchange.org</p></div>`
          : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1f2937">Organization Submission Update</h2><p>Hi ${org.submitter_name || 'there'},</p><p>Your submission for <strong>${org.name}</strong> could not be approved.</p>${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}<p>Questions? Contact hello@thevirtualexchange.org</p></div>`
      )
    }

    return res.status(200).json({ success: true })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
