// Submit new organization for approval
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const secret = process.env.ADMIN_APPROVAL_SECRET || 'vex-approval-secret-changeme'
function makeApprovalToken(orgId) {
  return crypto.createHmac('sha256', secret).update(String(orgId)).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    name,
    type,
    category,
    country,
    region,
    description,
    languages,
    interests,
    capacity,
    email,
    phone,
    website,
    partnershipGoals,
    programs,
    submitterName,
    submitterEmail,
    submitterRole,
    userId
  } = req.body

  if (!name || !type || !country || !description || !email || !submitterName || !submitterEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email) || !emailRegex.test(submitterEmail)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if organization name already exists
    const { data: existing } = await supabase
      .from('organizations')
      .select('id, name')
      .ilike('name', name)
      .single()

    if (existing) {
      return res.status(400).json({
        error: 'An organization with this name already exists. If this is your organization, please use the "Claim Profile" feature instead.'
      })
    }

    // Create new organization with pending status
    const { data: newOrg, error: createError } = await supabase
      .from('organizations')
      .insert({
        name,
        type,
        category,
        country,
        region,
        description,
        languages: languages || [],
        interests: interests || [],
        capacity,
        email,
        phone,
        website,
        partnership_goals: partnershipGoals || [],
        programs: programs ? JSON.stringify(programs) : null,
        verified: false,
        claimed: false,
        approval_status: 'pending',
        submitted_by: userId,
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        submitter_role: submitterRole
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating organization — message:', createError.message)
      console.error('Error creating organization — code:', createError.code)
      console.error('Error creating organization — details:', createError.details)
      console.error('Error creating organization — hint:', createError.hint)
      return res.status(500).json({ error: 'Failed to submit organization', detail: createError.message })
    }

    // Send emails — must be awaited before returning or Vercel kills the process
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      const approvalToken = makeApprovalToken(newOrg.id)
      const baseUrl = 'https://virtual-exchange.vercel.app'
      const approveUrl = `${baseUrl}/api/approve-org?id=${newOrg.id}&token=${approvalToken}&action=approve`
      const rejectUrl  = `${baseUrl}/api/approve-org?id=${newOrg.id}&token=${approvalToken}&action=reject`

      await Promise.allSettled([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
            to: submitterEmail,
            subject: `Submission Received: ${name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">Submission Received!</h2>
                <p>Hi ${submitterName},</p>
                <p>Thank you for submitting <strong>${name}</strong> to The Virtual Exchange.</p>
                <p>Our team will review your submission and get back to you within 1–3 business days.</p>
                <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:24px 0">
                  <h3 style="color:#1f2937;margin-top:0;font-size:16px">What happens next:</h3>
                  <ol style="color:#6b7280;line-height:1.8;padding-left:20px;margin:0">
                    <li>Our team reviews your organization (1–3 business days)</li>
                    <li>You receive an approval notification</li>
                    <li>Your organization goes live on The Virtual Exchange ✓</li>
                  </ol>
                </div>
                <p style="color:#6b7280;font-size:14px">Questions? hello@thevirtualexchange.org</p>
                <p style="color:#6b7280;font-size:14px"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
              </div>
            `
          })
        }).then(r => r.ok ? null : r.json().then(b => console.error('Submitter email failed:', b))).catch(e => console.error('Submitter email error:', e)),

        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
            to: 'chris@mapworkslearning.org',
            subject: `New Org Submission: ${name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1f2937">New Organization Submitted</h2>
                <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px">Organization</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Type</td><td style="padding:8px 0">${type}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Country</td><td style="padding:8px 0">${country}${region ? ` / ${region}` : ''}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Website</td><td style="padding:8px 0">${website || '—'}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Email</td><td style="padding:8px 0">${email}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Submitted by</td><td style="padding:8px 0">${submitterName} · ${submitterEmail} · ${submitterRole || '—'}</td></tr>
                  ${description ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top">Description</td><td style="padding:8px 0">${description}</td></tr>` : ''}
                </table>
                <div style="margin:32px 0">
                  <a href="${approveUrl}" style="background:#16a34a;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">✓ Approve</a>
                  <a href="${rejectUrl}" style="background:#dc2626;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;margin-left:12px">✗ Reject</a>
                </div>
                <p style="color:#9ca3af;font-size:12px">Clicking Approve or Reject instantly updates the listing and notifies the submitter.</p>
              </div>
            `
          })
        }).then(r => r.ok ? null : r.json().then(b => console.error('Admin email failed:', b))).catch(e => console.error('Admin email error:', e))
      ])
    }

    return res.status(200).json({
      success: true,
      message: "Your organization has been submitted for review. We'll be in touch within 1–3 business days.",
      organizationId: newOrg.id
    })

  } catch (error) {
    console.error('Submit organization error:', error)
    return res.status(500).json({ error: 'Failed to submit organization' })
  }
}
