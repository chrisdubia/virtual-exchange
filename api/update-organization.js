// Update organization endpoint - allows claimed org owners to update their profile
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    organizationId,
    userId,
    updates
  } = req.body

  // Validate required fields
  if (!organizationId || !userId || !updates) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user owns this organization
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('claimed, claimed_by')
      .eq('id', organizationId)
      .single()

    if (fetchError || !org) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    if (!org.claimed || org.claimed_by !== userId) {
      return res.status(403).json({ error: 'You do not have permission to update this organization' })
    }

    // Allowed fields to update
    const allowedFields = [
      'description',
      'email',
      'phone',
      'website',
      'languages',
      'interests',
      'capacity',
      'partnership_goals',
      'programs'
    ]

    // Filter updates to only allowed fields
    const filteredUpdates = {}
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key]
      }
    })

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    // Update organization
    const { data: updated, error: updateError } = await supabase
      .from('organizations')
      .update(filteredUpdates)
      .eq('id', organizationId)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(500).json({ error: 'Failed to update organization' })
    }

    return res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      organization: updated
    })

  } catch (error) {
    console.error('Update organization error:', error)
    return res.status(500).json({ error: 'Failed to update organization' })
  }
}
