// Submit new organization for approval
import { createClient } from '@supabase/supabase-js'

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
      console.error('Error creating organization:', createError)
      return res.status(500).json({ error: 'Failed to submit organization' })
    }

    // Send confirmation email to submitter
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
          to: submitterEmail,
          subject: `Submission Received: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1f2937;">Submission Received!</h2>
              <p>Hi ${submitterName},</p>
              <p>Thank you for submitting <strong>${name}</strong> to The Virtual Exchange.</p>
              <p>Our team will review your submission and get back to you within 1–3 business days.</p>
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">What happens next:</h3>
                <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px; margin: 0;">
                  <li>Our team reviews your organization (1–3 business days)</li>
                  <li>You receive an approval notification</li>
                  <li>Your organization goes live on The Virtual Exchange ✓</li>
                </ol>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Questions? Contact us at hello@thevirtualexchange.org
              </p>
              <p style="color: #6b7280; font-size: 14px;"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
            </div>
          `
        })
      }).catch(e => console.error('Failed to send confirmation email:', e))

      // Notify admin
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
          to: 'hello@mapworkslearning.org',
          subject: `New Organization Submission: ${name}`,
          html: `
            <h2>New Organization Submitted for Review</h2>
            <p><strong>Organization:</strong> ${name}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Submitted by:</strong> ${submitterName} (${submitterEmail})</p>
            <p><strong>Role:</strong> ${submitterRole || 'Not specified'}</p>
            <p>Review this submission in the Admin Panel.</p>
          `
        })
      }).catch(e => console.error('Failed to send admin notification:', e))
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
