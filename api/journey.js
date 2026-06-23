import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const getSupabase = () => {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function isCoOrg(supabase, exchangeId, orgId) {
  const { data } = await supabase
    .from('exchange_orgs')
    .select('id')
    .eq('exchange_id', exchangeId)
    .eq('org_id', orgId)
    .eq('role', 'co_organizer')
    .eq('confirmed', true)
    .maybeSingle()
  return !!data
}

async function getOrgForUser(supabase, userId) {
  const { data } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('claimed_by', userId)
    .maybeSingle()
  return data
}

async function loadExchangeData(supabase, exchangeId, res) {
  const [{ data: exchange }, { data: entries }, { data: eos }] = await Promise.all([
    supabase.from('exchanges').select('*').eq('id', exchangeId).single(),
    supabase.from('journey_entries').select('*').eq('exchange_id', exchangeId)
      .eq('is_public', true).neq('moderation', 'flagged').order('occurred_at', { ascending: false }),
    supabase.from('exchange_orgs').select('*').eq('exchange_id', exchangeId)
  ])
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' })
  const orgIds = (eos || []).map(o => o.org_id).filter(Boolean)
  const { data: orgs } = orgIds.length
    ? await supabase.from('organizations').select('id, name, country').in('id', orgIds)
    : { data: [] }
  const byId = {}
  ;(orgs || []).forEach(o => { byId[o.id] = o })
  return res.status(200).json({
    exchange,
    entries: entries || [],
    orgs: (eos || []).map(o => ({ ...o, org: byId[o.org_id] || null }))
  })
}

export default async function handler(req, res) {
  const supabase = getSupabase()
  if (!supabase) return res.status(500).json({ error: 'Service not configured' })

  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { exchangeId, orgId, token } = req.query

    // Funder token view (account-free)
    if (token) {
      const { data: ft } = await supabase
        .from('funder_tokens').select('exchange_id, revoked').eq('token', token).maybeSingle()
      if (!ft || ft.revoked) return res.status(403).json({ error: 'Invalid or revoked link' })
      return loadExchangeData(supabase, ft.exchange_id, res)
    }

    // Load all exchanges for an org
    if (orgId && !exchangeId) {
      const { data: eos } = await supabase
        .from('exchange_orgs').select('exchange_id, role, confirmed').eq('org_id', orgId)
      const ids = (eos || []).map(e => e.exchange_id)
      if (!ids.length) return res.status(200).json({ exchanges: [], userRole: {} })

      const [{ data: exchanges }, { data: allOrgs }] = await Promise.all([
        supabase.from('exchanges').select('*').in('id', ids).order('created_at', { ascending: false }),
        supabase.from('exchange_orgs').select('exchange_id, org_id, role, confirmed').in('exchange_id', ids)
      ])
      const orgIds = [...new Set((allOrgs || []).map(o => o.org_id))]
      const { data: orgData } = orgIds.length
        ? await supabase.from('organizations').select('id, name, country').in('id', orgIds)
        : { data: [] }
      const byId = {}
      ;(orgData || []).forEach(o => { byId[o.id] = o })

      return res.status(200).json({
        exchanges: (exchanges || []).map(e => ({
          ...e,
          orgs: (allOrgs || []).filter(o => o.exchange_id === e.id).map(o => ({ ...o, org: byId[o.org_id] || null }))
        })),
        userRole: (eos || []).reduce((a, e) => { a[e.exchange_id] = e.role; return a }, {})
      })
    }

    if (exchangeId) return loadExchangeData(supabase, exchangeId, res)
    return res.status(400).json({ error: 'Missing exchangeId or orgId' })
  }

  // ── POST ─────────────────────────────────────────────────────────────────
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action, userId } = req.body
  if (!action) return res.status(400).json({ error: 'Missing action' })

  // create-exchange
  if (action === 'create-exchange') {
    if (!userId) return res.status(401).json({ error: 'Auth required' })
    const userOrg = await getOrgForUser(supabase, userId)
    if (!userOrg) return res.status(403).json({ error: 'You must have a claimed organization to create an exchange' })
    const { name, summary, status, currentWeek, totalWeeks } = req.body
    if (!name) return res.status(400).json({ error: 'Exchange name required' })
    const { data: exchange, error } = await supabase.from('exchanges')
      .insert({ name, summary, status: status || 'planning',
        current_week: currentWeek || null, total_weeks: totalWeeks || null, created_by: userId })
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    await supabase.from('exchange_orgs').insert({
      exchange_id: exchange.id, org_id: userOrg.id,
      role: 'co_organizer', confirmed: true, confirmed_at: new Date().toISOString()
    })
    return res.status(200).json({ exchange })
  }

  // post-entry
  if (action === 'post-entry') {
    const { exchangeId, orgId, type, label, title, body, state, isPublic,
            resourceUrl, resourceTitle, resourceType, resourceLicense, resourceGradeRange } = req.body
    if (!exchangeId || !orgId || !title) return res.status(400).json({ error: 'Missing required fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can post entries' })
    const { data: entry, error } = await supabase.from('journey_entries').insert({
      exchange_id: exchangeId, type: type || 'milestone', posted_by_org_id: orgId,
      label, title, body, state: state || 'done', is_public: isPublic !== false,
      resource_url: resourceUrl, resource_title: resourceTitle,
      resource_type: resourceType, resource_license: resourceLicense, resource_grade_range: resourceGradeRange
    }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ entry })
  }

  // edit-entry
  if (action === 'edit-entry') {
    const { entryId, exchangeId, orgId, title, body, label, state, isPublic,
            resourceUrl, resourceTitle, resourceType, resourceLicense, resourceGradeRange } = req.body
    if (!entryId || !orgId || !exchangeId) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can edit entries' })
    const { error } = await supabase.from('journey_entries').update({
      title, body, label, state, is_public: isPublic,
      resource_url: resourceUrl, resource_title: resourceTitle,
      resource_type: resourceType, resource_license: resourceLicense, resource_grade_range: resourceGradeRange
    }).eq('id', entryId)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // delete-entry
  if (action === 'delete-entry') {
    const { entryId, exchangeId, orgId } = req.body
    if (!entryId || !orgId || !exchangeId) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can delete entries' })
    await supabase.from('journey_entries').delete().eq('id', entryId)
    return res.status(200).json({ success: true })
  }

  // update-metrics
  if (action === 'update-metrics') {
    const { exchangeId, orgId, metrics } = req.body
    if (!exchangeId || !orgId) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can update metrics' })
    const { error } = await supabase.from('exchanges').update({
      students_reached: metrics.studentsReached || 0,
      teachers_reached: metrics.teachersReached || 0,
      schools_count: metrics.schoolsCount || 0,
      countries_count: metrics.countriesCount || 0,
      reuse_count: metrics.reuseCount || 0,
      facilitator_count: metrics.facilitatorCount || null,
      facilitator_org: metrics.facilitatorOrg || null,
      current_week: metrics.currentWeek || null,
      total_weeks: metrics.totalWeeks || null,
      updated_at: new Date().toISOString()
    }).eq('id', exchangeId)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // update-exchange (name/status/summary)
  if (action === 'update-exchange') {
    const { exchangeId, orgId, name, summary, status, currentWeek, totalWeeks } = req.body
    if (!exchangeId || !orgId) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can update exchange' })
    const { error } = await supabase.from('exchanges').update({
      name, summary, status, current_week: currentWeek || null, total_weeks: totalWeeks || null,
      updated_at: new Date().toISOString()
    }).eq('id', exchangeId)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // invite-org
  if (action === 'invite-org') {
    const { exchangeId, inviterOrgId, invitedOrgId, role } = req.body
    if (!exchangeId || !inviterOrgId || !invitedOrgId || !role) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, inviterOrgId)) return res.status(403).json({ error: 'Only co-organizers can invite orgs' })
    const { data: invited } = await supabase.from('organizations').select('id, name, claimed_by').eq('id', invitedOrgId).single()
    if (!invited) return res.status(404).json({ error: 'Organization not found' })
    const { data: existing } = await supabase.from('exchange_orgs')
      .select('id').eq('exchange_id', exchangeId).eq('org_id', invitedOrgId).maybeSingle()
    if (existing) return res.status(409).json({ error: 'Organization already part of this exchange' })

    const [{ data: exchange }, { data: inviterOrg }] = await Promise.all([
      supabase.from('exchanges').select('name').eq('id', exchangeId).single(),
      supabase.from('organizations').select('name').eq('id', inviterOrgId).single()
    ])

    await supabase.from('exchange_orgs').insert({ exchange_id: exchangeId, org_id: invitedOrgId, role, confirmed: false })

    if (invited.claimed_by) {
      await supabase.from('messages').insert({
        sender_id: null,
        recipient_id: invited.claimed_by,
        subject: `Exchange invitation: ${exchange?.name || 'an exchange'}`,
        body: JSON.stringify({
          type: 'EXCHANGE_INVITE',
          exchangeId,
          exchangeName: exchange?.name,
          inviterOrgName: inviterOrg?.name,
          invitedOrgId,
          role
        }),
        org_context_name: inviterOrg?.name
      })
    }
    return res.status(200).json({ success: true })
  }

  // respond-invite
  if (action === 'respond-invite') {
    const { exchangeId, orgId, accept } = req.body
    if (!exchangeId || !orgId) return res.status(400).json({ error: 'Missing fields' })
    if (accept) {
      await supabase.from('exchange_orgs').update({
        confirmed: true, confirmed_at: new Date().toISOString()
      }).eq('exchange_id', exchangeId).eq('org_id', orgId)
    } else {
      await supabase.from('exchange_orgs').delete().eq('exchange_id', exchangeId).eq('org_id', orgId)
    }
    return res.status(200).json({ success: true })
  }

  // gen-funder-token
  if (action === 'gen-funder-token') {
    const { exchangeId, orgId } = req.body
    if (!exchangeId || !orgId) return res.status(400).json({ error: 'Missing fields' })
    if (!await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Only co-organizers can generate funder links' })
    const token = crypto.randomBytes(24).toString('hex')
    const { data: ft, error } = await supabase.from('funder_tokens')
      .insert({ exchange_id: exchangeId, token }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ token: ft.token })
  }

  // revoke-token
  if (action === 'revoke-token') {
    const { tokenId, orgId, exchangeId } = req.body
    if (!tokenId || !orgId) return res.status(400).json({ error: 'Missing fields' })
    if (exchangeId && !await isCoOrg(supabase, exchangeId, orgId)) return res.status(403).json({ error: 'Not authorized' })
    await supabase.from('funder_tokens').update({ revoked: true }).eq('id', tokenId)
    return res.status(200).json({ success: true })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
