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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
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
        approval_status: 'pending', // New field for approval workflow
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

    // Send notification email to MapWorks admin
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@mapworkslearning.org>',
            to: 'hello@mapworkslearning.org',
            subject: `New Organization Submission: ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">New Organization Awaiting Approval</h2>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Organization Details</h3>

                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Type:</strong> ${type}</p>
                  <p><strong>Category:</strong> ${category || 'Not specified'}</p>
                  <p><strong>Country:</strong> ${country}</p>
                  <p><strong>Region:</strong> ${region || 'Not specified'}</p>

                  <p><strong>Description:</strong><br>${description}</p>

                  <p><strong>Languages:</strong> ${languages?.join(', ') || 'Not specified'}</p>
                  <p><strong>Interests:</strong> ${interests?.join(', ') || 'Not specified'}</p>
                  <p><strong>Capacity:</strong> ${capacity || 'Not specified'}</p>

                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                  <p><strong>Website:</strong> ${website || 'Not provided'}</p>

                  ${partnershipGoals?.length ? `<p><strong>Partnership Goals:</strong> ${partnershipGoals.join(', ')}</p>` : ''}
                </div>

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Submitted By</h3>
                  <p><strong>Name:</strong> ${submitterName}</p>
                  <p><strong>Email:</strong> ${submitterEmail}</p>
                  <p><strong>Role:</strong> ${submitterRole}</p>
                </div>

                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #92400e;"><strong>Action Required:</strong> Review this submission and approve or reject it.</p>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <p style="color: #6b7280; font-size: 14px;">Organization ID: ${newOrg.id}</p>
                  <p style="color: #6b7280; font-size: 14px;">To approve, go to your Supabase dashboard → organizations table</p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
        // Don't fail the submission if email fails
      }
    }

    // Send confirmation email to submitter
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@mapworkslearning.org>',
            to: submitterEmail,
            subject: 'Organization Submission Received',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Thank You for Your Submission!</h2>

                <p>Hi ${submitterName},</p>

                <p>We've received your submission for <strong>${name}</strong> to be added to The Virtual Exchange directory.</p>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What Happens Next?</h3>
                  <ol style="color: #6b7280; line-height: 1.8;">
                    <li>Our team at MapWorks Learning will review your submission</li>
                    <li>We'll verify the information and organization details</li>
                    <li>You'll receive an email within 2-3 business days with our decision</li>
                    <li>Once approved, your organization will appear in the public directory</li>
                    <li>You'll be able to manage and update your profile</li>
                  </ol>
                </div>

                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #1e40af;">
                    <strong>💡 Tip:</strong> Organizations with complete profiles and verification badges receive 3x more partnership requests!
                  </p>
                </div>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p>Questions? Reply to this email or contact us at hello@mapworkslearning.org</p>
                  <p style="margin-top: 16px;"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Organization submitted successfully and is pending approval',
      organizationId: newOrg.id
    })

  } catch (error) {
    console.error('Submit organization error:', error)
    return res.status(500).json({ error: 'Failed to submit organization' })
  }
}
