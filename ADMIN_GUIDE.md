# Admin Guide - Approving New Organizations

This guide explains how to review and approve new organization submissions and profile claims.

## Overview

There are two types of approvals:
1. **Profile Claims** - Existing organizations being claimed by users
2. **New Organizations** - Brand new organizations requesting to be added

## Approval Workflow

### Email Notifications

You'll receive emails at `hello@mapworkslearning.org` for:
- New organization submissions
- Profile claim requests

Each email contains:
- Organization/claimant details
- Submitter information
- Unique IDs for approval

## Option 1: Manual Approval (via Supabase Dashboard)

### Approving New Organizations

1. **Go to Supabase Dashboard**
   - Navigate to your Virtual Exchange project
   - Click **Table Editor** → **organizations**

2. **Find Pending Submissions**
   - Filter by `approval_status = 'pending'`
   - Review the organization details
   - Check submitter email and role

3. **Verify the Organization**
   - Google the organization name
   - Verify website matches
   - Check submitter email domain matches org
   - Look for red flags

4. **Approve or Reject**

   **To Approve:**
   ```sql
   UPDATE organizations 
   SET 
     approval_status = 'approved',
     approved_at = NOW(),
     approved_by = 'your_user_id_here'
   WHERE id = 'organization_id_from_email';
   ```

   **To Reject:**
   ```sql
   UPDATE organizations 
   SET 
     approval_status = 'rejected',
     approved_at = NOW(),
     approved_by = 'your_user_id_here',
     rejection_reason = 'Reason for rejection'
   WHERE id = 'organization_id_from_email';
   ```

5. **Email Automatically Sent**
   - Submitter receives approval/rejection email
   - If approved: Organization goes live immediately
   - If rejected: Submitter can reply with more info

### Approving Profile Claims

1. **Go to Supabase Dashboard**
   - Click **Table Editor** → **profile_claims**

2. **Find Pending Claims**
   - Filter by `status = 'pending'`
   - Review claimant details
   - Check verification documents

3. **Verify the Claim**
   - Check claimant email matches organization domain
   - Review their stated role
   - Look up person on LinkedIn/org website if needed

4. **Approve or Reject**

   **To Approve:**
   ```sql
   -- Update claim status
   UPDATE profile_claims 
   SET 
     status = 'approved',
     reviewed_at = NOW(),
     reviewed_by = 'your_user_id_here'
   WHERE id = 'claim_id_from_email';
   
   -- Update organization
   UPDATE organizations 
   SET 
     claimed = true,
     claimed_by = 'user_id_from_claim',
     claimed_at = NOW()
   WHERE id = 'organization_id_from_claim';
   ```

   **To Reject:**
   ```sql
   UPDATE profile_claims 
   SET 
     status = 'rejected',
     reviewed_at = NOW(),
     reviewed_by = 'your_user_id_here'
   WHERE id = 'claim_id_from_email';
   ```

5. **Email Automatically Sent**
   - Claimant receives approval/rejection email
   - If approved: They can now edit the organization
   - If rejected: They can appeal

## Option 2: API-Based Approval (Future Admin Dashboard)

### For New Organizations

POST to `/api/approve-organization`:
```json
{
  "organizationId": "uuid-from-email",
  "approved": true,
  "adminUserId": "your-user-id",
  "rejectionReason": "Optional reason if rejecting"
}
```

### For Profile Claims

POST to `/api/approve-claim`:
```json
{
  "claimId": "uuid-from-email",
  "approved": true,
  "adminUserId": "your-user-id"
}
```

## Approval Checklist

### For New Organizations ✅

- [ ] Organization name is legitimate
- [ ] Email domain matches organization (e.g., @harvard.edu for Harvard)
- [ ] Website exists and is professional
- [ ] Description is clear and appropriate
- [ ] Contact information is valid
- [ ] No duplicate of existing organization
- [ ] Submitter role makes sense (teacher, director, coordinator)
- [ ] No spam/phishing indicators

### For Profile Claims ✅

- [ ] Claimant email domain matches org (preferred)
- [ ] Role is appropriate (administrator, coordinator, teacher)
- [ ] LinkedIn/verification document provided (if requested)
- [ ] No existing claim on this organization
- [ ] Organization is actually theirs

## Red Flags 🚩

**Reject if you see:**
- Generic email (gmail, yahoo) for official org claim
- Suspicious website or non-existent domain
- Vague or spam-like description
- Contact info doesn't match organization
- Duplicate submission
- Incomplete required fields
- Unrealistic capacity claims
- Known scam organization

## Common Scenarios

### Scenario 1: School Teacher Claiming Profile
- ✅ Email: `jsmith@school.edu` claiming school profile
- ✅ Role: "Teacher" or "Coordinator"
- **Action:** APPROVE

### Scenario 2: Someone with Gmail Claiming University
- ❌ Email: `someone@gmail.com` claiming "Harvard University"
- **Action:** REJECT (ask for official email)

### Scenario 3: New Organization from Valid Source
- ✅ Organization: "Global Learning Initiative"
- ✅ Website: `globallearning.org`
- ✅ Email: `contact@globallearning.org`
- ✅ Submitter: `director@globallearning.org`
- **Action:** APPROVE

### Scenario 4: Duplicate Submission
- ❌ Organization name already exists
- **Action:** REJECT (direct them to claim existing profile)

### Scenario 5: Missing Critical Info
- ❌ No website, vague description, no contact info
- **Action:** REJECT (ask for more details)

## Batch Operations

### Approve Multiple Organizations
```sql
UPDATE organizations 
SET 
  approval_status = 'approved',
  approved_at = NOW()
WHERE id IN (
  'id1',
  'id2',
  'id3'
);
```

### View All Pending
```sql
SELECT 
  name,
  submitter_email,
  submitter_role,
  created_at,
  id
FROM organizations 
WHERE approval_status = 'pending'
ORDER BY created_at DESC;
```

## Monitoring

### Daily Check (5 minutes)
1. Check `hello@mapworkslearning.org` for new submission emails
2. Review pending in Supabase
3. Approve/reject within 2-3 business days

### Weekly Review
- Check for any stuck pending approvals
- Review rejection patterns
- Update criteria if needed

## Response Time Goals

- **Target:** Respond within 2-3 business days
- **Urgent:** Same day for established institutions
- **Complex:** Up to 5 business days if verification needed

## Getting Help

**For technical issues:**
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Platform: Check error logs in Vercel

**For policy questions:**
- Review approval checklist
- When in doubt, verify via external sources
- Can always respond to submitter for more info

---

## Future: Admin Dashboard UI

Instead of SQL, you'll have:
- Visual list of pending submissions
- One-click approve/reject buttons
- Built-in verification tools
- Automated checks (email domain matching, etc.)
- Activity logs

This is planned for future development!
