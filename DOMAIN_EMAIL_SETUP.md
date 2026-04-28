# Domain & Email Setup Guide
## thevirtualexchange.org → Vercel + Resend

Complete setup guide for pointing your domain to Vercel and configuring professional email delivery.

---

## 📋 **Overview**

**Current State:**
- Domain registered at SiteGround ✓
- DNS pointed to clev1.net (old host)
- No email configured
- Website not live

**Target State:**
- DNS managed by Vercel
- Website hosted at Vercel
- Email sent via Resend
- Everything professional and working

**Time Required:** ~45 minutes

---

## 🚀 **Step-by-Step Setup**

### **Part 1: Deploy to Vercel** (10 min)

#### 1.1 Push Code to GitHub (Already Done ✓)

#### 1.2 Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Sign in / Create account
3. Click **"Add New Project"**
4. **Import** your GitHub repository: `virtual-exchange`
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Don't click Deploy yet!**

#### 1.3 Add Environment Variables
In Vercel project settings → **Environment Variables**, add:

```env
# Resend (will get this in Part 2)
RESEND_API_KEY=re_xxxxxxxxxx

# Supabase (will get this in Part 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Vite (same as Supabase values)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Select environments:** Production, Preview, Development

#### 1.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `virtual-exchange-abc123.vercel.app`
4. **Test it** - should show your site (without data yet)

---

### **Part 2: Add Custom Domain to Vercel** (5 min)

#### 2.1 Add Domain
1. In Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `thevirtualexchange.org`
4. Click **"Add"**

#### 2.2 Get Nameservers
Vercel will show:
```
⚠️ Domain is not configured correctly

Update your nameservers to:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Copy these nameserver addresses** - you'll need them next!

---

### **Part 3: Update Nameservers at SiteGround** (5 min)

#### 3.1 Access SiteGround DNS
1. Log into SiteGround
2. Go to **Websites** → **thevirtualexchange.org**
3. Click **"MANAGE"** under Name Servers (that button in your screenshot)

#### 3.2 Change Nameservers
1. Select **"Custom Name Servers"**
2. Remove the old ones:
   - ❌ `ns1.clev1.net`
   - ❌ `ns2.clev1.net`
3. Add Vercel's nameservers:
   - ✅ `ns1.vercel-dns.com`
   - ✅ `ns2.vercel-dns.com`
4. Click **"Save"**

#### 3.3 Wait for Propagation
- Usually takes: 1-4 hours
- Can take up to: 24-48 hours
- Check status in Vercel → Domains

**While waiting, continue with email setup below ↓**

---

### **Part 4: Set Up Resend Email** (15 min)

#### 4.1 Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up (free account - 3,000 emails/month)
3. Verify your email

#### 4.2 Add Domain
1. In Resend dashboard → **Domains** → **Add Domain**
2. Enter: `thevirtualexchange.org`
3. Click **"Add Domain"**

#### 4.3 Get DNS Records
Resend will show DNS records to add:

```
Type    Name                          Value
────────────────────────────────────────────────────────────────
TXT     @                             v=spf1 include:_spf.resend.com ~all
TXT     resend._domainkey             (long DKIM key)
CNAME   resend._domainkey             resend1._domainkey.resend.com
MX      @                             feedback-smtp.us-east-1.amazonses.com (priority 10)
```

**Keep this page open** - you'll add these in Vercel next!

#### 4.4 Add DNS Records in Vercel
1. Go to **Vercel** → Your Project → **Settings** → **Domains**
2. Click on `thevirtualexchange.org`
3. Scroll to **DNS Records**
4. Click **"Add Record"**

**Add each record from Resend:**

**Record 1 - SPF:**
- Type: `TXT`
- Name: `@` (or leave blank)
- Value: `v=spf1 include:_spf.resend.com ~all`
- Click **"Add"**

**Record 2 - DKIM (long TXT):**
- Type: `TXT`
- Name: `resend._domainkey`
- Value: (paste the long DKIM key from Resend)
- Click **"Add"**

**Record 3 - DKIM (CNAME):**
- Type: `CNAME`
- Name: `resend._domainkey`
- Value: `resend1._domainkey.resend.com`
- Click **"Add"**

**Record 4 - MX:**
- Type: `MX`
- Name: `@` (or leave blank)
- Value: `feedback-smtp.us-east-1.amazonses.com`
- Priority: `10`
- Click **"Add"**

#### 4.5 Verify Domain in Resend
1. Back in **Resend** dashboard
2. Click **"Verify DNS Records"**
3. If green checkmarks → **Success!** ✓
4. If not verified yet → Wait 10-30 minutes, click verify again

#### 4.6 Get API Key
1. In Resend → **API Keys** → **Create API Key**
2. Name: `Virtual Exchange Production`
3. Permission: **Full Access**
4. Click **"Create"**
5. **Copy the API key** (starts with `re_`)
6. Save it securely - you can't see it again!

#### 4.7 Add to Vercel Environment Variables
1. Go to Vercel → Settings → **Environment Variables**
2. Find `RESEND_API_KEY` (or add it if not there)
3. Paste your API key: `re_abc123xyz...`
4. Click **"Save"**
5. **Redeploy** your project for env var to take effect

---

### **Part 5: Set Up Supabase Database** (15 min)

#### 5.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in / Create account
3. Click **"New Project"**
4. **Project details:**
   - Name: `virtual-exchange`
   - Database Password: (create strong password - **save this!**)
   - Region: Choose closest to your users (US East for USA)
5. Click **"Create new project"**
6. Wait 2-3 minutes for initialization

#### 5.2 Run Database Schema
1. In Supabase dashboard → **SQL Editor**
2. Click **"New Query"**
3. Open `SUPABASE_SETUP.md` from your project
4. **Copy the ENTIRE SQL schema** (all CREATE TABLE statements)
5. Paste into SQL Editor
6. Click **"Run"** (bottom right)
7. Should see: "Success. No rows returned"

#### 5.3 Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see tables:
   - ✅ profiles
   - ✅ organizations
   - ✅ profile_claims
   - ✅ connection_requests
   - ✅ verification_requests

#### 5.4 Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different!)
```

**⚠️ Important:** 
- `anon key` = Safe to expose in frontend
- `service_role key` = SECRET - never expose publicly!

#### 5.5 Add to Vercel Environment Variables
1. Go to Vercel → Settings → **Environment Variables**
2. Add/update these:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (the anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (the service_role key)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (same as anon key)
```

3. **Select:** Production, Preview, Development
4. Click **"Save"**

#### 5.6 Redeploy
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Wait 2-3 minutes

---

### **Part 6: Populate Database with Organizations** (5 min)

#### 6.1 Extract Organizations from Code
1. Open `src/App.jsx`
2. Find the `organizations` array (around line 102)
3. Copy the entire array (all 50+ organizations)

#### 6.2 Update Migration Script
1. Open `migrate-organizations.js`
2. Find `const organizations = []`
3. Paste your organizations array there

#### 6.3 Create .env.local File
Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### 6.4 Install Dependencies
```bash
npm install
```

#### 6.5 Run Migration
```bash
node migrate-organizations.js
```

**You should see:**
```
🚀 Starting migration...
📊 Found 52 organizations to migrate

✅ Migrated: MapWorks Learning
✅ Migrated: Global Nomads Group
✅ Migrated: SUNY COIL
... (all your orgs)

📈 Migration complete!
   ✅ Success: 52
   ❌ Errors: 0
```

#### 6.6 Verify in Supabase
1. Go to Supabase → **Table Editor** → **organizations**
2. You should see all your organizations!
3. Each should have:
   - `approval_status: 'approved'`
   - `verified: false` (no badge until claimed)
   - `email_verification_status: 'verified'`

---

### **Part 7: Configure Authentication** (5 min)

#### 7.1 Set Site URL in Supabase
1. Supabase → **Authentication** → **URL Configuration**
2. **Site URL:** `https://thevirtualexchange.org`
3. **Redirect URLs:** Add these:
   ```
   https://thevirtualexchange.org/**
   https://*.vercel.app/**
   http://localhost:5173/**
   ```
4. Click **"Save"**

#### 7.2 Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize if desired (or use defaults)

---

## ✅ **Verification Checklist**

### **Domain & Website:**
- [ ] Nameservers updated to Vercel
- [ ] Domain shows in Vercel as "Valid"
- [ ] Website loads at `thevirtualexchange.org`
- [ ] SSL certificate active (🔒 in browser)

### **Email:**
- [ ] Domain verified in Resend (green checkmarks)
- [ ] DNS records added in Vercel
- [ ] RESEND_API_KEY in Vercel env vars
- [ ] Test email sent successfully

### **Database:**
- [ ] Supabase project created
- [ ] All tables created (5 tables)
- [ ] Organizations migrated (50+ entries)
- [ ] API keys in Vercel env vars

### **Application:**
- [ ] All env vars set in Vercel
- [ ] Project redeployed after env var changes
- [ ] Can browse organizations on site
- [ ] Can create account (signup works)
- [ ] Can submit organization (email verification works)

---

## 🧪 **Testing the Full Flow**

### **Test 1: Browse Organizations**
1. Visit `https://thevirtualexchange.org`
2. Should see your 50+ organizations
3. All visible, none have verified badge yet ✓

### **Test 2: Create Account**
1. Click "Sign Up" or "Get Started"
2. Fill out form
3. Submit
4. **Check email** - should receive welcome email from `hello@thevirtualexchange.org`
5. Login with credentials ✓

### **Test 3: Submit New Organization**
1. Login
2. Submit new organization form
3. **Check email** - should receive verification email
4. Click verification link
5. Should see "Email Verified!" page
6. **Check MapWorks email** - should receive notification

### **Test 4: Claim Existing Profile**
1. Browse to an organization
2. Click "Claim this Profile"
3. Fill out form
4. Submit
5. **Check MapWorks email** - should receive claim request

---

## 🔧 **Troubleshooting**

### **Domain not loading**
- Check nameserver propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Wait up to 24 hours
- Verify nameservers in SiteGround match Vercel's

### **Email not sending**
- Verify domain in Resend dashboard
- Check DNS records in Vercel DNS
- Verify RESEND_API_KEY is set correctly
- Check Resend logs for errors

### **Can't see organizations**
- Verify migration ran successfully
- Check Supabase Table Editor
- Verify Supabase env vars in Vercel
- Check browser console for errors

### **Authentication not working**
- Verify Supabase URL configuration
- Check redirect URLs include your domain
- Verify API keys are correct
- Clear browser cache/cookies

---

## 📧 **Email Addresses Used**

**App sends FROM:**
- `hello@thevirtualexchange.org` (all automated emails)

**MapWorks receives notifications at:**
- `hello@mapworkslearning.org` (approval notifications)

**Users receive emails at:**
- Their submitted email addresses

---

## 🎯 **Next Steps After Setup**

1. **Test everything** using checklist above
2. **Share the link** with a few test users
3. **Monitor** Supabase and Resend dashboards
4. **Review** first submissions before approving
5. **Set up** admin approval workflow

---

## 🆘 **Getting Help**

**Domain/DNS issues:**
- SiteGround support
- Vercel docs: [vercel.com/docs/custom-domains](https://vercel.com/docs/custom-domains)

**Email issues:**
- Resend docs: [resend.com/docs](https://resend.com/docs)
- Check Resend logs in dashboard

**Database issues:**
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check Supabase logs

**Platform issues:**
- Check `DEPLOYMENT_GUIDE.md`
- Email: hello@mapworkslearning.org

---

**You're all set!** 🎉 Follow this guide step-by-step and you'll have a fully functional platform.
