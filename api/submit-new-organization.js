// Submit new organization for approval
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    // Organization details
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
    // Submitter details
    submitterName,
    submitterEmail,
    submitterRole,
    userId
  } = req.body

  // Validate required fields
  if (!name || !type || !country || !description || !email || !submitterName || !submitterEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Email validation
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

    // Send verification email to submitter (NOT to MapWorks yet)
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const verificationUrl = `https://virtual-exchange.vercel.app/verify-email?token=${verificationToken}`

    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
            to: submitterEmail,
            subject: `Verify Your Email - ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h2 style="color: #1f2937; margin: 0;">Verify Your Email Address</h2>
                  <p style="color: #6b7280; font-size: 16px;">Just one more step to get ${name} listed</p>
                </div>

                <p>Hi ${submitterName},</p>

                <p>Thank you for submitting <strong>${name}</strong> to The Virtual Exchange!</p>

                <p>To complete your submission, please verify your email address by clicking the button below:</p>

                <div style="text-align: center; margin: 40px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Verify Email Address
                  </a>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Or copy and paste this link into your browser:</strong><br>
                    <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
                  </p>
                </div>

                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>⏰ This link expires in 48 hours.</strong> Please verify soon to proceed with your submission.
                  </p>
                </div>

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">After Email Verification:</h3>
                  <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px; margin: 0;">
                    <li>Our team reviews your organization (1-3 business days)</li>
                    <li>You receive approval notification</li>
                    <li>Your organization goes live with verified badge ✓</li>
                  </ol>
                </div>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p>Didn't submit this request? You can safely ignore this email.</p>
                  <p style="margin-top: 16px;"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        return res.status(500).json({ error: 'Failed to send verification email. Please try again.' })
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Your organization has been submitted for review. We\'ll be in touch within 1-3 business days.',
      organizationId: newOrg.id
    })

  } catch (error) {
    console.error('Submit organization error:', error)
    return res.status(500).json({ error: 'Failed to submit organization' })
  }
}
