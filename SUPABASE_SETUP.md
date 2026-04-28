# Supabase Setup Guide

This guide will help you set up Supabase for The Virtual Exchange platform.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Enter project details:
   - **Name:** virtual-exchange
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to your users
4. Click **Create new project**
5. Wait for project to initialize (2-3 minutes)

## 2. Database Schema

Run these SQL commands in the **SQL Editor** in your Supabase dashboard:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations table (your existing orgs data)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  country TEXT,
  region TEXT,
  description TEXT,
  languages TEXT[],
  interests TEXT[],
  capacity TEXT,
  email TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT false,
  website TEXT,
  partnership_goals TEXT[],
  programs JSONB,
  claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMP WITH TIME ZONE,
  -- New organization submission fields
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id),
  submitter_name TEXT,
  submitter_email TEXT,
  submitter_role TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile claims table (for claim requests)
CREATE TABLE public.profile_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  verification_doc TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Connection requests table
CREATE TABLE public.connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_organization TEXT NOT NULL,
  from_user_id UUID REFERENCES auth.users(id),
  to_organization_id UUID REFERENCES organizations(id) NOT NULL,
  role TEXT,
  partnership_interest TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification requests table (for verified badge requests)
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  official_email TEXT NOT NULL,
  website_url TEXT NOT NULL,
  role TEXT NOT NULL,
  domains_match BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for organizations
CREATE POLICY "Approved organizations are viewable by everyone"
  ON public.organizations FOR SELECT
  USING (approval_status = 'approved');

CREATE POLICY "Users can view their own pending submissions"
  ON public.organizations FOR SELECT
  USING (submitted_by = auth.uid());

CREATE POLICY "Authenticated users can submit new organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() = submitted_by AND approval_status = 'pending');

CREATE POLICY "Claimed orgs can be updated by owner"
  ON public.organizations FOR UPDATE
  USING (claimed = true AND claimed_by = auth.uid());

-- Policies for profile claims
CREATE POLICY "Users can view own claims"
  ON public.profile_claims FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create claims"
  ON public.profile_claims FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policies for connection requests
CREATE POLICY "Users can view requests they created"
  ON public.connection_requests FOR SELECT
  USING (from_user_id = auth.uid());

CREATE POLICY "Users can create connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

-- Policies for verification requests
CREATE POLICY "Users can view their own verification requests"
  ON public.verification_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create verification requests"
  ON public.verification_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connection_requests_updated_at BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...` - keep this secret!)

## 4. Configure Environment Variables

Add to your Vercel environment variables (and `.env.local` for local development):

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
```

## 5. Migrate Existing Organizations

Run the migration script to populate your database with existing organizations:

```bash
node migrate-organizations.js
```

## 6. Configure Authentication

In Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (already enabled by default)
3. Optional: Enable OAuth providers (Google, LinkedIn, etc.)
4. Go to **Authentication** → **URL Configuration**
5. Set **Site URL** to `https://virtual-exchange.vercel.app`
6. Add redirect URLs:
   - `https://virtual-exchange.vercel.app/**`
   - `http://localhost:5173/**` (for local dev)

## 7. Security Considerations

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Use Row Level Security policies to protect data
- Validate all inputs on the server side
- Implement rate limiting for API endpoints

## Support

For issues with Supabase: [supabase.com/docs](https://supabase.com/docs)
