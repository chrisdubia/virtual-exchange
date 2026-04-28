// Approve or reject verification requests (admin only)
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { verificationRequestId, approved, adminUserId, rejectionReason } = req.body

  // Validate required fields
  if (!verificationRequestId || approved === undefined) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // TODO: Add admin verification here

    // Get verification request details
    const { data: verifyRequest, error: fetchError } = await supabase
      .from('verification_requests')
      .select('*, organizations(*)')
      .eq('id', verificationRequestId)
      .single()

    if (fetchError || !verifyRequest) {
      return res.status(404).json({ error: 'Verification request not found' })
    }

    if (verifyRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Verification request has already been processed' })
    }

    // Update verification request status
    const { error: updateRequestError } = await supabase
      .from('verification_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId,
        rejection_reason: !approved ? rejectionReason : null
      })
      .eq('id', verificationRequestId)

    if (updateRequestError) {
      console.error('Error updating verification request:', updateRequestError)
      return res.status(500).json({ error: 'Failed to update verification request' })
    }

    // If approved, update organization verified status
    if (approved) {
      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({
          verified: true
        })
        .eq('id', verifyRequest.organization_id)

      if (updateOrgError) {
        console.error('Error updating organization:', updateOrgError)
        return res.status(500).json({ error: 'Failed to update organization verification status' })
      }
    }

    // Send notification email
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
            to: verifyRequest.official_email,
            subject: approved ?
              `${verifyRequest.organizations.name} - Verification Approved! ✓` :
              `Verification Request Update`,
            html: approved ? `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 48px;">✓</span>
                  </div>
                  <h2 style="color: #1f2937; margin: 0;">Congratulations!</h2>
                  <p style="color: #6b7280; font-size: 18px;">Your organization is now verified</p>
                </div>

                <p>Great news! <strong>${verifyRequest.organizations.name}</strong> has been verified on The Virtual Exchange.</p>

                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 4px;">
                  <h3 style="color: #065f46; margin-top: 0;">✓ You're Now Verified!</h3>
                  <p style="color: #065f46; margin: 0;">
                    Your organization profile now displays the verified badge, signaling authenticity and trustworthiness to potential partners worldwide.
                  </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What This Means:</h3>
                  <ul style="color: #6b7280; line-height: 1.8;">
                    <li><strong>✓ Verified Badge:</strong> Displayed prominently on your profile</li>
                    <li><strong>📈 Better Visibility:</strong> Higher ranking in search results</li>
                    <li><strong>🤝 More Trust:</strong> Partners prefer verified organizations</li>
                    <li><strong>⭐ Premium Access:</strong> Unlock advanced features and resources</li>
                    <li><strong>🎯 AI Priority:</strong> Featured in AI-powered recommendations</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                    View Your Verified Profile
                  </a>
                </div>

                <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h4 style="color: #1f2937; margin-top: 0;">Next Steps:</h4>
                  <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
                    <li>Complete your profile with programs and resources</li>
                    <li>Browse and connect with verified partners</li>
                    <li>Share your verified profile link with potential partners</li>
                    <li>Respond to connection requests promptly</li>
                  </ol>
                </div>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
                  <p><em>"Every conversation is a step toward solidarity"</em></p>
                  <p><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
                </div>
              </div>
            ` : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Verification Request Update</h2>

                <p>Thank you for your verification request for <strong>${verifyRequest.organizations.name}</strong>.</p>

                <p>After review, we are unable to verify your organization at this time.</p>

                ${rejectionReason ? `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;"><strong>Reason:</strong> ${rejectionReason}</p>
                  </div>
                ` : ''}

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What You Can Do:</h3>
                  <ul style="color: #6b7280; line-height: 1.8;">
                    <li>Reply to this email with additional verification documents</li>
                    <li>Ensure your email domain matches your organization's website</li>
                    <li>Provide official documentation (e.g., accreditation letters)</li>
                    <li>Resubmit once you have the required information</li>
                  </ul>
                </div>

                <p style="color: #6b7280;">If you believe this decision was made in error or have questions, please reply to this email and our team will be happy to assist.</p>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p>Questions? Reply to this email or contact us at hello@mapworkslearning.org</p>
                  <p style="margin-top: 16px;"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
      }
    }

    return res.status(200).json({
      success: true,
      message: approved ?
        'Organization verified successfully' :
        'Verification request rejected',
      organizationId: verifyRequest.organization_id
    })

  } catch (error) {
    console.error('Approve verification error:', error)
    return res.status(500).json({ error: 'Failed to process verification request' })
  }
}
