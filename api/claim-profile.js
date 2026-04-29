// Profile claim endpoint - allows users to claim their organization
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    organizationId,
    organizationName,
    name,
    email,
    role,
    verificationDoc,
    userId
  } = req.body

  // Validate required fields
  if (!organizationId || !name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if organization is already claimed
    const { data: org } = await supabase
      .from('organizations')
      .select('claimed, claimed_by')
      .eq('id', organizationId)
      .single()

    if (org && org.claimed) {
      return res.status(400).json({ error: 'This organization has already been claimed' })
    }

    // Create claim request
    const { data: claim, error: claimError } = await supabase
      .from('profile_claims')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        name,
        email,
        role,
        verification_doc: verificationDoc,
        status: 'pending'
      })
      .select()
      .single()

    if (claimError) {
      console.error('Error creating claim:', claimError)
      return res.status(500).json({ error: 'Failed to submit claim request' })
    }

    // Send notification email to admin
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
            subject: `Profile Claim Request: ${organizationName}`,
            html: `
              <h2>New Profile Claim Request</h2>
              <p><strong>Organization:</strong> ${organizationName}</p>
              <p><strong>Claimant Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> ${role}</p>
              ${verificationDoc ? `<p><strong>Verification:</strong> ${verificationDoc}</p>` : ''}
              <p><strong>Claim ID:</strong> ${claim.id}</p>
              <p>Review this claim in your Supabase dashboard.</p>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
      }
    }

    // Send confirmation to claimant
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
            to: email,
            subject: 'Profile Claim Request Received',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Claim Request Received</h2>
                <p>Hi ${name},</p>
                <p>We've received your request to claim the profile for <strong>${organizationName}</strong>.</p>
                <p>Our team will review your request and get back to you within 2-3 business days.</p>
                <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
                  <p style="margin: 0; color: #6b7280;"><strong>Next Steps:</strong></p>
                  <ul style="color: #6b7280;">
                    <li>We'll verify your connection to the organization</li>
                    <li>Once approved, you'll receive full access to manage the profile</li>
                    <li>You'll be able to update information, respond to connection requests, and more</li>
                  </ul>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                  Questions? Reply to this email or contact us at hello@thevirtualexchange.org
                </p>
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
      message: 'Claim request submitted successfully',
      claimId: claim.id
    })

  } catch (error) {
    console.error('Claim error:', error)
    return res.status(500).json({ error: 'Failed to submit claim request' })
  }
}
