// Unified approval endpoint for claims, organizations, and verifications
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, id, approved, adminUserId, rejectionReason } = req.body

  // Validate required fields
  if (!type || !id || approved === undefined) {
    return res.status(400).json({ error: 'Missing required fields: type, id, approved' })
  }

  if (!['claim', 'organization', 'verification'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Must be: claim, organization, or verification' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Handle based on type
    if (type === 'claim') {
      return await handleClaimApproval(supabase, id, approved, adminUserId, rejectionReason, res)
    } else if (type === 'organization') {
      return await handleOrganizationApproval(supabase, id, approved, adminUserId, rejectionReason, res)
    } else if (type === 'verification') {
      return await handleVerificationApproval(supabase, id, approved, adminUserId, rejectionReason, res)
    }

  } catch (error) {
    console.error('Approval error:', error)
    return res.status(500).json({ error: 'Failed to process approval' })
  }
}

// Handle profile claim approval
async function handleClaimApproval(supabase, claimId, approved, adminUserId, rejectionReason, res) {
  const { data: claim, error: fetchError } = await supabase
    .from('profile_claims')
    .select('*, organizations(*)')
    .eq('id', claimId)
    .single()

  if (fetchError || !claim) {
    return res.status(404).json({ error: 'Claim not found' })
  }

  if (claim.status !== 'pending') {
    return res.status(400).json({ error: 'Claim has already been processed' })
  }

  const updateData = {
    status: approved ? 'approved' : 'rejected',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminUserId
  }

  if (!approved && rejectionReason) {
    updateData.rejection_reason = rejectionReason
  }

  const { error: updateError } = await supabase
    .from('profile_claims')
    .update(updateData)
    .eq('id', claimId)

  if (updateError) {
    console.error('Error updating claim:', updateError)
    return res.status(500).json({ error: 'Failed to update claim' })
  }

  if (approved) {
    const { error: orgUpdateError } = await supabase
      .from('organizations')
      .update({
        claimed: true,
        verified: true,
        claimed_by: claim.claimant_email,
        claimed_at: new Date().toISOString()
      })
      .eq('id', claim.organization_id)

    if (orgUpdateError) {
      console.error('Error updating organization:', orgUpdateError)
      return res.status(500).json({ error: 'Failed to update organization' })
    }
  }

  await sendClaimEmail(claim, approved, rejectionReason)

  return res.status(200).json({
    success: true,
    message: approved ? 'Claim approved successfully' : 'Claim rejected'
  })
}

// Handle new organization approval
async function handleOrganizationApproval(supabase, organizationId, approved, adminUserId, rejectionReason, res) {
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

  await sendOrganizationEmail(org, approved, rejectionReason)

  return res.status(200).json({
    success: true,
    message: approved ? 'Organization approved and is now live' : 'Organization submission rejected'
  })
}

// Handle verification request approval
async function handleVerificationApproval(supabase, requestId, approved, adminUserId, rejectionReason, res) {
  const { data: request, error: fetchError } = await supabase
    .from('verification_requests')
    .select('*, organizations(*)')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) {
    return res.status(404).json({ error: 'Verification request not found' })
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'Request has already been processed' })
  }

  const updateData = {
    status: approved ? 'approved' : 'rejected',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminUserId
  }

  if (!approved && rejectionReason) {
    updateData.rejection_reason = rejectionReason
  }

  const { error: updateError } = await supabase
    .from('verification_requests')
    .update(updateData)
    .eq('id', requestId)

  if (updateError) {
    console.error('Error updating verification request:', updateError)
    return res.status(500).json({ error: 'Failed to update verification request' })
  }

  if (approved && request.organization_id) {
    const { error: orgUpdateError } = await supabase
      .from('organizations')
      .update({
        verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', request.organization_id)

    if (orgUpdateError) {
      console.error('Error verifying organization:', orgUpdateError)
      return res.status(500).json({ error: 'Failed to verify organization' })
    }
  }

  await sendVerificationEmail(request, approved, rejectionReason)

  return res.status(200).json({
    success: true,
    message: approved ? 'Verification approved successfully' : 'Verification request rejected'
  })
}

// Email helper functions
async function sendClaimEmail(claim, approved, rejectionReason) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY || !claim.claimant_email) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: claim.claimant_email,
        subject: approved ? `Profile Claim Approved - ${claim.organizations?.name}` : 'Update on Your Profile Claim',
        html: approved ? `
          <h2>🎉 Profile Claim Approved!</h2>
          <p>Your claim for <strong>${claim.organizations?.name}</strong> has been approved!</p>
          <p>You can now manage your organization's profile.</p>
        ` : `
          <h2>Profile Claim Update</h2>
          <p>Your claim for <strong>${claim.organizations?.name}</strong> could not be approved at this time.</p>
          ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
        `
      })
    })
  } catch (error) {
    console.error('Failed to send claim email:', error)
  }
}

async function sendOrganizationEmail(org, approved, rejectionReason) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY || !org.submitter_email) return

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
        subject: approved ? `${org.name} Approved!` : 'Update on Your Organization Submission',
        html: approved ? `
          <h2>🎉 Congratulations!</h2>
          <p><strong>${org.name}</strong> has been approved and is now live on The Virtual Exchange!</p>
        ` : `
          <h2>Update on Your Submission</h2>
          <p>We are unable to approve <strong>${org.name}</strong> at this time.</p>
          ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
        `
      })
    })
  } catch (error) {
    console.error('Failed to send organization email:', error)
  }
}

async function sendVerificationEmail(request, approved, rejectionReason) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY || !request.contact_email) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: request.contact_email,
        subject: approved ? 'Organization Verified!' : 'Update on Your Verification Request',
        html: approved ? `
          <h2>✓ Verification Approved!</h2>
          <p>Your organization has been verified on The Virtual Exchange!</p>
        ` : `
          <h2>Verification Update</h2>
          <p>We are unable to verify your organization at this time.</p>
          ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
        `
      })
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
  }
}
