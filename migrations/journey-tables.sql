-- Exchange / Journey Tracker tables
-- Run in: Supabase → SQL Editor → New query

CREATE TABLE IF NOT EXISTS exchanges (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name           text NOT NULL,
  status         text NOT NULL DEFAULT 'planning'
                   CHECK (status IN ('planning', 'live', 'completed')),
  current_week   integer,
  total_weeks    integer,
  summary        text,
  students_reached  integer DEFAULT 0,
  teachers_reached  integer DEFAULT 0,
  schools_count     integer DEFAULT 0,
  countries_count   integer DEFAULT 0,
  reuse_count       integer DEFAULT 0,
  facilitator_count integer,
  facilitator_org   text,
  visibility     text NOT NULL DEFAULT 'public'
                   CHECK (visibility IN ('public', 'unlisted')),
  created_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exchange_orgs (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_id   uuid NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
  org_id        uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('co_organizer', 'participant')),
  confirmed     boolean DEFAULT false,
  confirmed_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(exchange_id, org_id)
);

CREATE TABLE IF NOT EXISTS journey_entries (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_id         uuid NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
  type                text NOT NULL CHECK (type IN ('milestone', 'resource', 'quote')),
  posted_by_org_id    uuid REFERENCES organizations(id) ON DELETE SET NULL,
  label               text,
  title               text NOT NULL,
  body                text,
  resource_url        text,
  resource_title      text,
  resource_type       text,
  resource_license    text,
  resource_grade_range text,
  state               text NOT NULL DEFAULT 'done'
                        CHECK (state IN ('in_progress', 'done')),
  is_public           boolean DEFAULT true,
  moderation          text NOT NULL DEFAULT 'clean'
                        CHECK (moderation IN ('clean', 'flagged', 'approved')),
  occurred_at         timestamptz DEFAULT now(),
  created_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS funder_tokens (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_id  uuid NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
  token        text UNIQUE NOT NULL,
  label        text,
  revoked      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- Enable RLS (service role key used by API functions bypasses these automatically)
ALTER TABLE exchanges      ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_orgs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE funder_tokens  ENABLE ROW LEVEL SECURITY;

-- Public can read public exchanges
CREATE POLICY "public_read_exchanges"
  ON exchanges FOR SELECT
  USING (visibility = 'public');

-- Public can read confirmed org memberships
CREATE POLICY "public_read_exchange_orgs"
  ON exchange_orgs FOR SELECT
  USING (confirmed = true);

-- Public can read public, non-flagged entries
CREATE POLICY "public_read_journey_entries"
  ON journey_entries FOR SELECT
  USING (is_public = true AND moderation != 'flagged');

-- Funder tokens: no public read (only via service key from API)
-- (no policy = blocked for anon/authenticated roles; service key bypasses)
