// One-click org approval/rejection from admin email link
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const secret = process.env.ADMIN_APPROVAL_SECRET || 'vex-approval-secret-changeme'

function makeToken(orgId) {
  return crypto.createHmac('sha256', secret).update(String(orgId)).digest('hex')
}

function html(title, body, color = '#2563eb') {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb}
  .card{background:white;border-radius:12px;padding:40px;max-width:480px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center}
  h2{color:#1f2937;margin-top:0} p{color:#6b7280;line-height:1.6}
  .badge{display:inline-block;padding:8px 20px;border-radius:999px;font-weight:600;font-size:14px;background:${color};color:white;margin-bottom:24px}</style>
  </head><body><div class="card">${body}</div></body></html>`
}

export default async function handler(req, res) {
  const { id: orgId, token, action = 'approve' } = req.query

  if (!orgId || !token) {
    return res.status(400).send(html('Error', '<h2>Invalid Link</h2><p>Missing organization ID or token.</p>', '#dc2626'))
  }

  const expected = makeToken(orgId)
  if (!crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))) {
    return res.status(403).send(html('Error', '<h2>Invalid or Expired Link</h2><p>This approval link is not valid. Please use the Admin Panel instead.</p>', '#dc2626'))
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).send(html('Error', '<h2>Service Unavailable</h2>', '#dc2626'))
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: org, error: fetchErr } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (fetchErr || !org) {
    return res.status(404).send(html('Error', '<h2>Organization Not Found</h2><p>It may have already been reviewed.</p>', '#dc2626'))
  }

  if (org.approval_status !== 'pending') {
    return res.status(200).send(html('Already Reviewed',
      `<div class="badge">${org.approval_status === 'approved' ? 'Already Approved' : 'Already Rejected'}</div>
       <h2>${org.name}</h2><p>This organization has already been reviewed.</p>`, '#6b7280'))
  }

  const approved = action === 'approve'
  await supabase.from('organizations').update({
    approval_status: approved ? 'approved' : 'rejected',
    approved_at: approved ? new Date().toISOString() : null,
    approved_by: 'email-link'
  }).eq('id', orgId)

  // Notify submitter
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (RESEND_API_KEY && org.submitter_email) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: org.submitter_email,
        subject: approved ? `🎉 ${org.name} is now live on The Virtual Exchange!` : `Update on your submission: ${org.name}`,
        html: approved
          ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
               <h2 style="color:#1f2937">Your Organization is Live!</h2>
               <p>Hi ${org.submitter_name || 'there'},</p>
               <p><strong>${org.name}</strong> has been approved and is now listed on The Virtual Exchange.</p>
               <p><a href="https://virtual-exchange.vercel.app" style="background:#2563eb;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:8px">View Your Listing</a></p>
               <p style="color:#6b7280;font-size:14px;margin-top:24px">Questions? hello@thevirtualexchange.org</p>
             </div>`
          : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
               <h2 style="color:#1f2937">Submission Update</h2>
               <p>Hi ${org.submitter_name || 'there'},</p>
               <p>We were unable to approve your submission for <strong>${org.name}</strong> at this time.</p>
               <p>Please reply to this email if you have questions or would like to resubmit.</p>
               <p style="color:#6b7280;font-size:14px">hello@thevirtualexchange.org</p>
             </div>`
      })
    }).catch(e => console.error('Submitter notify failed:', e))
  }

  return res.status(200).send(html(
    approved ? 'Approved!' : 'Rejected',
    `<div class="badge">${approved ? '✓ Approved' : '✗ Rejected'}</div>
     <h2>${org.name}</h2>
     <p>${approved
       ? 'The organization is now <strong>live</strong> on The Virtual Exchange. The submitter has been notified.'
       : 'The submission has been rejected. The submitter has been notified.'}</p>
     <p style="font-size:13px;color:#9ca3af;margin-top:24px">You can close this tab.</p>`,
    approved ? '#16a34a' : '#dc2626'
  ))
}

