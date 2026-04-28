// Email verification endpoint - verifies email ownership via link
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.method === 'POST' ? req.body.token : req.query.token

  if (!token) {
    return res.status(400).json({ error: 'Verification token required' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find organization by verification token
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('*')
      .eq('email_verification_token', token)
      .single()

    if (fetchError || !org) {
      return res.status(404).json({
        error: 'Invalid or expired verification link',
        expired: true
      })
    }

    // Check if already verified
    if (org.email_verification_status === 'verified') {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        alreadyVerified: true,
        organizationName: org.name
      })
    }

    // Check if token expired (48 hours)
    const expiresAt = new Date(org.verification_token_expires_at)
    const now = new Date()

    if (now > expiresAt) {
      // Mark as expired
      await supabase
        .from('organizations')
        .update({
          email_verification_status: 'expired'
        })
        .eq('id', org.id)

      return res.status(400).json({
        error: 'Verification link has expired. Please resubmit your organization.',
        expired: true
      })
    }

    // Verify the email
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        email_verification_status: 'verified',
        email_verified_at: new Date().toISOString(),
        approval_status: 'pending' // Move from email_pending to pending admin approval
      })
      .eq('id', org.id)

    if (updateError) {
      console.error('Error updating verification status:', updateError)
      return res.status(500).json({ error: 'Failed to verify email' })
    }

    // Check if email domain matches website domain
    const emailDomain = org.submitter_email.split('@')[1].toLowerCase()
    const websiteDomain = org.website
      ? org.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase()
      : ''

    const domainsMatch = emailDomain.includes(websiteDomain) || websiteDomain.includes(emailDomain)

    // Send notification to MapWorks admin (NOW that email is verified)
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
            from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
            to: 'hello@mapworkslearning.org',
            subject: `✅ Email Verified - Ready for Review: ${org.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                  <h2 style="color: #065f46; margin: 0;">✅ Email Verified - Ready for Review</h2>
                </div>

                <p>A new organization has verified their email and is ready for your approval.</p>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Organization Details</h3>
                  <p><strong>Name:</strong> ${org.name}</p>
                  <p><strong>Type:</strong> ${org.type}</p>
                  <p><strong>Country:</strong> ${org.country}</p>
                  <p><strong>Region:</strong> ${org.region || 'Not specified'}</p>
                  <p><strong>Website:</strong> ${org.website ? `<a href="${org.website}">${org.website}</a>` : 'Not provided'}</p>
                  <p><strong>Description:</strong><br>${org.description}</p>
                </div>

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">✅ Email Verification Details</h3>
                  <p><strong>Submitter:</strong> ${org.submitter_name}</p>
                  <p><strong>Email:</strong> ${org.submitter_email}</p>
                  <p><strong>Role:</strong> ${org.submitter_role}</p>
                  <p><strong>Email Verified:</strong> ✅ Yes (${new Date().toLocaleString()})</p>
                  <p><strong>Email Domain:</strong> ${emailDomain}</p>
                  <p><strong>Website Domain:</strong> ${websiteDomain || 'N/A'}</p>
                  <p><strong>Domains Match:</strong> ${domainsMatch ? '✅ Yes (High confidence)' : '⚠️ No (Requires review)'}</p>
                </div>

                ${domainsMatch ? `
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46;">
                      <strong>✅ High Confidence:</strong> Email domain matches website domain. Recommended for fast-track approval.
                    </p>
                  </div>
                ` : `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;">
                      <strong>⚠️ Manual Review Required:</strong> Email domain doesn't match website domain. Please verify legitimacy before approving.
                    </p>
                  </div>
                `}

                <div style="text-align: center; margin: 32px 0;">
                  <p style="color: #6b7280; font-size: 14px;">
                    Organization ID: ${org.id}<br>
                    Review in Supabase Dashboard → organizations table
                  </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Next Step:</strong> Review organization details and approve/reject in your Supabase dashboard.
                  </p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
        // Don't fail verification if email fails
      }
    }

    // Send confirmation to submitter
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
            to: org.submitter_email,
            subject: `Email Verified - ${org.name} Under Review`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 32px;">✓</span>
                  </div>
                  <h2 style="color: #1f2937; margin: 0;">Email Verified!</h2>
                </div>

                <p>Hi ${org.submitter_name},</p>

                <p>Thank you for verifying your email address. Your submission for <strong>${org.name}</strong> is now under review by our team.</p>

                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #065f46;">
                    <strong>✅ Email Verified:</strong> ${org.submitter_email}
                  </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What Happens Next?</h3>
                  <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
                    <li>Our team at MapWorks Learning will review your organization</li>
                    <li>We'll verify the information and check legitimacy</li>
                    <li>You'll receive a decision within 2-3 business days</li>
                    <li>Once approved, your organization will be live with a verified badge ✓</li>
                  </ol>
                </div>

                ${domainsMatch ? `
                  <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0; color: #1e40af;">
                      <strong>💡 Fast-Track Review:</strong> Your email domain matches your organization's website, which helps speed up the approval process!
                    </p>
                  </div>
                ` : ''}

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p>Questions? Reply to this email or contact us at hello@thevirtualexchange.org</p>
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
      message: 'Email verified successfully! Your organization is now under review.',
      organizationName: org.name,
      estimatedReviewTime: domainsMatch ? '1-2 business days' : '2-3 business days'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return res.status(500).json({ error: 'Failed to verify email' })
  }
}
