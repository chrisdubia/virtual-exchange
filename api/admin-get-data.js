import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const userId = req.query.userId
  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Service not configured' })

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Verify requester is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })

  const [claimsResult, orgsResult] = await Promise.all([
    supabase
      .from('profile_claims')
      .select('*, organizations(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    supabase
      .from('organizations')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false })
  ])

  return res.status(200).json({
    claims: claimsResult.data || [],
    pendingOrgs: orgsResult.data || []
  })
}
