# Deployment Guide - Making Forms Live

This guide walks you through deploying a fully functional Virtual Exchange platform with authentication, user profiles, and dynamic organization management.

## Overview

The platform now includes:
- ✅ User authentication (signup/login)
- ✅ Organization profiles from database
- ✅ Profile claiming system
- ✅ Dynamic profile updates
- ✅ Email notifications
- ✅ Admin approval workflow

## Prerequisites

1. **Accounts needed:**
   - [Supabase](https://supabase.com) - Free tier
   - [Resend](https://resend.com) - For email (3,000/month free)
   - [Vercel](https://vercel.com) - For deployment (free tier)

2. **Domain setup:**
   - Access to DNS settings for `mapworkslearning.org`

## Step-by-Step Setup

### 1. Supabase Setup (20 minutes)

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in and click **New Project**
3. Fill in:
   - Name: `virtual-exchange`
   - Database Password: (save this!)
   - Region: Choose closest to your users
4. Click **Create new project**
5. Wait 2-3 minutes for initialization

#### B. Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire SQL schema from `SUPABASE_SETUP.md`
4. Paste and click **Run**
5. Verify tables created: Go to **Table Editor**, you should see:
   - profiles
   - organizations
   - profile_claims
   - connection_requests

#### C. Get API Keys
1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   ```
   Project URL: https://xxxxx.supabase.co
   Anon/Public Key: eyJ... (starts with eyJ)
   Service Role Key: eyJ... (different from anon key)
   ```

### 2. Resend Email Setup (15 minutes)

#### A. Create Account & Verify Domain
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Go to **Domains** → **Add Domain**
4. Enter: `mapworkslearning.org`
5. Add the DNS records to your domain:
   ```
   Type    Name                Value
   TXT     @                   [Resend provides]
   TXT     resend._domainkey   [Resend provides]
   ```
6. Wait 5-60 minutes for DNS propagation
7. Click **Verify** in Resend

#### B. Get API Key
1. Go to **API Keys** → **Create API Key**
2. Name: `Virtual Exchange Production`
3. Permission: Full Access
4. Copy the key (starts with `re_`)

### 3. Local Development Setup (10 minutes)

#### A. Install Dependencies
```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Database client
- `bcryptjs` - Password hashing

#### B. Create .env.local
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Resend
RESEND_API_KEY=re_your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJyyy...

# Vite (same as Supabase values)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 4. Migrate Organizations Data (5 minutes)

This populates your database with existing organizations.

#### A. Extract Organizations
1. Open `src/App.jsx`
2. Find the `organizations` array (around line 102)
3. Copy the entire array
4. Open `migrate-organizations.js`
5. Paste the array where it says `const organizations = []`

#### B. Run Migration
```bash
node migrate-organizations.js
```

You should see:
```
✅ Migrated: MapWorks Learning
✅ Migrated: Global Nomads Group
...
📈 Migration complete!
   ✅ Success: 50
   ❌ Errors: 0
```

#### C. Verify
1. Go to Supabase dashboard → **Table Editor**
2. Click **organizations** table
3. You should see all your organizations

### 5. Vercel Deployment (10 minutes)

#### A. Push Code to GitHub
```bash
git add .
git commit -m "Add authentication and database integration"
git push origin main
```

#### B. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Framework Preset: Vite
5. Don't deploy yet!

#### C. Add Environment Variables
In Vercel project settings → **Environment Variables**, add:

```
RESEND_API_KEY=re_your_key
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJyyy...
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

Make sure to check all environments (Production, Preview, Development)

#### D. Deploy
1. Click **Deploy**
2. Wait 2-3 minutes
3. Visit your site: `https://virtual-exchange.vercel.app`

### 6. Test Everything (10 minutes)

#### A. Test Signup/Login
1. Go to your deployed site
2. Click **Get Started** or **Sign In**
3. Create a new account
4. Check your email for welcome message
5. Log in with your credentials

#### B. Test Profile Claim
1. Browse organizations
2. Click on an organization
3. Click **Claim this Profile**
4. Fill out the form
5. Check email for confirmation

#### C. Test Admin Approval (in Supabase)
1. Go to Supabase → **Table Editor** → `profile_claims`
2. Find your claim (status: pending)
3. Note the `id`, `user_id`, and `organization_id`
4. Go to **SQL Editor**, run:
   ```sql
   -- Approve claim
   UPDATE profile_claims 
   SET status = 'approved', reviewed_at = NOW() 
   WHERE id = 'claim_id_here';
   
   -- Update organization
   UPDATE organizations 
   SET claimed = true, claimed_by = 'user_id_here', claimed_at = NOW() 
   WHERE id = 'organization_id_here';
   ```
5. User receives approval email
6. User can now edit that organization

#### D. Test Organization Update
1. Log in as user who claimed org
2. Go to organization page
3. If you see "Manage Profile" button, click it
4. Update information
5. Save changes
6. Refresh page - changes should appear

### 7. Optional: Admin Dashboard

For easier claim management, you can:

**Option A: Use Supabase Dashboard**
- Table Editor → `profile_claims`
- Manually approve/reject claims via SQL

**Option B: Build Admin UI** (future enhancement)
- Create `/admin` route
- List pending claims
- Approve/reject with buttons
- Uses `/api/approve-claim` endpoint

## Troubleshooting

### "Email service not configured"
- Check `RESEND_API_KEY` in Vercel environment variables
- Verify domain in Resend dashboard
- Check DNS records propagated (use dnschecker.org)

### "Authentication service not configured"
- Check all Supabase env vars in Vercel
- Verify variable names match exactly
- Redeploy after adding env vars

### "Organization not updating"
- Verify user is logged in
- Check user claimed the organization
- Look at browser console for errors
- Check Supabase RLS policies

### Organizations not showing
- Verify migration ran successfully
- Check Supabase Table Editor → organizations
- Check browser console for API errors

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Only use anon key in frontend
- Enable MFA on Supabase and Vercel accounts
- Regularly rotate API keys

## Next Steps

1. **Enable OAuth** (optional):
   - Supabase → Authentication → Providers
   - Enable Google, LinkedIn, etc.
   - Configure OAuth in your apps

2. **Admin Dashboard**:
   - Build UI for approving claims
   - Manage verified organizations
   - View connection requests

3. **Enhanced Features**:
   - Profile completion percentage
   - Connection request management UI
   - Real-time updates with Supabase Realtime

## Support

- **Supabase issues:** [supabase.com/docs](https://supabase.com/docs)
- **Resend issues:** [resend.com/docs](https://resend.com/docs)
- **Platform issues:** hello@mapworkslearning.org

---

**Congratulations!** 🎉 Your platform is now fully functional with authentication, dynamic profiles, and real-time updates!
