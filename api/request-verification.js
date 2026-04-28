// Request verification badge for organization
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    organizationName,
    organizationType,
    country,
    cityRegion,
    websiteUrl,
    officialEmail,
    role,
    numberOfStudents,
    userId,
    userName,
    // If claiming existing org
    existingOrgId
  } = req.body

  // Validate required fields
  if (!organizationName || !organizationType || !country || !websiteUrl || !officialEmail || !role) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(officialEmail)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  // Check if email domain matches website domain
  const emailDomain = officialEmail.split('@')[1]
  const websiteDomain = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const domainsMatch = emailDomain.toLowerCase().includes(websiteDomain.toLowerCase()) ||
                       websiteDomain.toLowerCase().includes(emailDomain.toLowerCase())

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let organizationId = existingOrgId

    // If no existing org, create new one with pending approval and verification
    if (!existingOrgId) {
      // Check if organization name already exists
      const { data: existing } = await supabase
        .from('organizations')
        .select('id, name')
        .ilike('name', organizationName)
        .single()

      if (existing) {
        return res.status(400).json({
          error: 'An organization with this name already exists. Please claim the existing profile instead.',
          existingOrgId: existing.id
        })
      }

      // Create new organization
      const { data: newOrg, error: createError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          type: organizationType,
          country: country,
          region: cityRegion,
          website: websiteUrl,
          email: officialEmail,
          capacity: numberOfStudents ? `${numberOfStudents} students` : null,
          approval_status: 'pending',
          verified: false, // Will be set to true upon verification approval
          submitted_by: userId,
          submitter_name: userName,
          submitter_email: officialEmail,
          submitter_role: role
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating organization:', createError)
        return res.status(500).json({ error: 'Failed to submit verification request' })
      }

      organizationId = newOrg.id
    } else {
      // Verify user has permission to request verification for existing org
      const { data: org } = await supabase
        .from('organizations')
        .select('claimed, claimed_by, verified')
        .eq('id', existingOrgId)
        .single()

      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      if (org.verified) {
        return res.status(400).json({ error: 'Organization is already verified' })
      }

      if (org.claimed && org.claimed_by !== userId) {
        return res.status(403).json({ error: 'You do not have permission to request verification for this organization' })
      }
    }

    // Create verification request record
    const { data: verificationRequest, error: verifyError } = await supabase
      .from('verification_requests')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        official_email: officialEmail,
        website_url: websiteUrl,
        role: role,
        domains_match: domainsMatch,
        status: 'pending'
      })
      .select()
      .single()

    if (verifyError) {
      console.error('Error creating verification request:', verifyError)
      return res.status(500).json({ error: 'Failed to submit verification request' })
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
            subject: `Verification Request: ${organizationName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">New Verification Request</h2>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Organization Details</h3>
                  <p><strong>Name:</strong> ${organizationName}</p>
                  <p><strong>Type:</strong> ${organizationType}</p>
                  <p><strong>Country:</strong> ${country}</p>
                  <p><strong>Region:</strong> ${cityRegion || 'Not specified'}</p>
                  <p><strong>Website:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
                  <p><strong>Official Email:</strong> ${officialEmail}</p>
                  ${numberOfStudents ? `<p><strong>Students:</strong> ${numberOfStudents}</p>` : ''}
                </div>

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Verification Details</h3>
                  <p><strong>Requester Role:</strong> ${role}</p>
                  <p><strong>Email Domain:</strong> ${emailDomain}</p>
                  <p><strong>Website Domain:</strong> ${websiteDomain}</p>
                  <p><strong>Domains Match:</strong> ${domainsMatch ? '✅ Yes' : '❌ No (requires manual verification)'}</p>
                </div>

                ${!domainsMatch ? `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0; color: #92400e;"><strong>⚠️ Warning:</strong> Email domain does not match website domain. Additional verification required.</p>
                  </div>
                ` : ''}

                <div style="text-align: center; margin: 32px 0;">
                  <p style="color: #6b7280; font-size: 14px;">
                    Verification Request ID: ${verificationRequest.id}<br>
                    Organization ID: ${organizationId}
                  </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Action Required:</strong> Review this verification request in Supabase dashboard and approve/reject.
                  </p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
      }
    }

    // Send confirmation email to requester
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
            to: officialEmail,
            subject: 'Verification Request Received',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 32px;">✓</span>
                  </div>
                  <h2 style="color: #1f2937; margin: 0;">Verification Request Submitted!</h2>
                </div>

                <p>Hi ${userName || 'there'},</p>

                <p>We've received your verification request for <strong>${organizationName}</strong>.</p>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What Happens Next?</h3>
                  <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
                    <li>Our team will verify your organization's website and domain</li>
                    <li>We'll send a verification email to ${officialEmail}</li>
                    <li>You'll receive a decision within 24-48 hours</li>
                    <li>Once verified, your organization will display a verified badge ✓</li>
                  </ol>
                </div>

                ${!domainsMatch ? `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;">
                      <strong>⚠️ Note:</strong> Your email domain (${emailDomain}) doesn't match your website domain (${websiteDomain}).
                      We may reach out for additional verification.
                    </p>
                  </div>
                ` : `
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46;">
                      <strong>✓ Good news:</strong> Your email domain matches your website domain, which speeds up the verification process!
                    </p>
                  </div>
                `}

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h4 style="color: #1f2937; margin-top: 0;">Benefits of Verification:</h4>
                  <ul style="color: #6b7280; line-height: 1.8;">
                    <li>✓ Verified badge on your profile</li>
                    <li>📈 Higher placement in search results</li>
                    <li>🤝 Increased trust from potential partners</li>
                    <li>⭐ Access to premium features</li>
                  </ul>
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
      message: 'Verification request submitted successfully',
      verificationRequestId: verificationRequest.id,
      organizationId: organizationId,
      estimatedTime: domainsMatch ? '24 hours' : '24-48 hours'
    })

  } catch (error) {
    console.error('Verification request error:', error)
    return res.status(500).json({ error: 'Failed to submit verification request' })
  }
}
