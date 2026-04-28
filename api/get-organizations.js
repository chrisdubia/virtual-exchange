// Get organizations from database
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch only approved organizations for public view
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('approval_status', 'approved')
      .order('name')

    if (error) {
      console.error('Error fetching organizations:', error)
      return res.status(500).json({ error: 'Failed to fetch organizations' })
    }

    return res.status(200).json({
      success: true,
      organizations
    })

  } catch (error) {
    console.error('Get organizations error:', error)
    return res.status(500).json({ error: 'Failed to fetch organizations' })
  }
}
