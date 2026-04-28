// Approve or reject profile claim requests (admin only)
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { claimId, approved, adminUserId } = req.body

  // Validate required fields
  if (!claimId || approved === undefined || !adminUserId) {
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
    // For now, we'll just process the claim

    // Get claim details
    const { data: claim, error: fetchError } = await supabase
      .from('profile_claims')
      .select('*')
      .eq('id', claimId)
      .single()

    if (fetchError || !claim) {
      return res.status(404).json({ error: 'Claim not found' })
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ error: 'Claim has already been processed' })
    }

    // Update claim status
    const { error: updateClaimError } = await supabase
      .from('profile_claims')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId
      })
      .eq('id', claimId)

    if (updateClaimError) {
      console.error('Error updating claim:', updateClaimError)
      return res.status(500).json({ error: 'Failed to update claim' })
    }

    // If approved, update organization
    if (approved) {
      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({
          claimed: true,
          claimed_by: claim.user_id,
          claimed_at: new Date().toISOString()
        })
        .eq('id', claim.organization_id)

      if (updateOrgError) {
        console.error('Error updating organization:', updateOrgError)
        return res.status(500).json({ error: 'Failed to update organization' })
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
            to: claim.email,
            subject: approved ? 'Profile Claim Approved!' : 'Profile Claim Update',
            html: approved ? `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Claim Approved!</h2>
                <p>Hi ${claim.name},</p>
                <p>Great news! Your claim for the organization profile has been approved.</p>
                <p>You can now:</p>
                <ul>
                  <li>Update your organization's information</li>
                  <li>Manage connection requests</li>
                  <li>Add programs and resources</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px;">
                    Manage Your Profile
                  </a>
                </div>
              </div>
            ` : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Claim Update</h2>
                <p>Hi ${claim.name},</p>
                <p>Thank you for your interest in claiming an organization profile. After review, we were unable to verify your claim at this time.</p>
                <p>If you believe this is an error, please reply to this email with additional verification information.</p>
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
      message: approved ? 'Claim approved successfully' : 'Claim rejected'
    })

  } catch (error) {
    console.error('Approve claim error:', error)
    return res.status(500).json({ error: 'Failed to process claim' })
  }
}
