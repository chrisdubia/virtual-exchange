// Approve or reject new organization submissions (admin only)
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { organizationId, approved, adminUserId, rejectionReason } = req.body

  // Validate required fields
  if (!organizationId || approved === undefined) {
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
    // For now, we'll just process the approval

    // Get organization details
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    if (fetchError || !org) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    if (org.approval_status !== 'pending') {
      return res.status(400).json({ error: 'Organization has already been processed' })
    }

    // Update organization status
    const updateData = {
      approval_status: approved ? 'approved' : 'rejected',
      approved_at: new Date().toISOString(),
      approved_by: adminUserId
    }

    if (!approved && rejectionReason) {
      updateData.rejection_reason = rejectionReason
    }

    const { error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', organizationId)

    if (updateError) {
      console.error('Error updating organization:', updateError)
      return res.status(500).json({ error: 'Failed to update organization' })
    }

    // Send notification email to submitter
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY && org.submitter_email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'The Virtual Exchange <hello@mapworkslearning.org>',
            to: org.submitter_email,
            subject: approved ?
              `${org.name} Approved for The Virtual Exchange!` :
              `Update on Your Organization Submission`,
            html: approved ? `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">🎉 Congratulations!</h2>

                <p>Hi ${org.submitter_name},</p>

                <p>Great news! <strong>${org.name}</strong> has been approved and is now live on The Virtual Exchange!</p>

                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #065f46;">
                    <strong>✅ Your organization is now visible</strong> to thousands of educators and institutions worldwide looking for partnership opportunities.
                  </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">What You Can Do Now</h3>
                  <ul style="color: #6b7280; line-height: 1.8;">
                    <li><strong>Manage Your Profile:</strong> Update information, add programs, and showcase your work</li>
                    <li><strong>Respond to Requests:</strong> Receive and respond to partnership inquiries</li>
                    <li><strong>Browse Partners:</strong> Search for and connect with compatible organizations</li>
                    <li><strong>Get Verified:</strong> Apply for a verified badge to build more trust</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                    View Your Profile
                  </a>
                </div>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p><em>"Every conversation is a step toward solidarity"</em></p>
                  <p><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
                </div>
              </div>
            ` : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Update on Your Submission</h2>

                <p>Hi ${org.submitter_name},</p>

                <p>Thank you for your interest in joining The Virtual Exchange. After careful review, we are unable to approve <strong>${org.name}</strong> for our directory at this time.</p>

                ${rejectionReason ? `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;"><strong>Reason:</strong> ${rejectionReason}</p>
                  </div>
                ` : ''}

                <p>If you believe this decision was made in error or if you have additional information to share, please reply to this email and our team will be happy to review your submission again.</p>

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
        'Organization approved and is now live' :
        'Organization submission rejected'
    })

  } catch (error) {
    console.error('Approve organization error:', error)
    return res.status(500).json({ error: 'Failed to process approval' })
  }
}
