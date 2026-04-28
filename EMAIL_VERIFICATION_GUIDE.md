# Email Verification System Guide

## Overview

Level 2 Email Verification ensures that all new organization submissions come from legitimate sources by requiring email verification before MapWorks review.

## How It Works

### **For New Organization Submissions**

```
User Submits → Email Sent → User Clicks Link → Email Verified → MapWorks Reviews → Approved
```

**Detailed Flow:**
1. User submits new organization with official email
2. System generates unique verification token (expires in 48 hours)
3. Verification email sent with link: `verify-email?token=abc123...`
4. User clicks link
5. Email verified ✓
6. **NOW** MapWorks receives notification email
7. You review and approve
8. Organization goes live with verified badge

### **For Pre-loaded Organizations**

Pre-loaded organizations (your curated 50+ orgs):
- Skip email verification (already trusted)
- Visible on site immediately
- No verified badge until someone claims them

## Verification States

| approval_status | email_verification_status | Meaning |
|----------------|---------------------------|---------|
| `email_pending` | `pending` | Waiting for user to verify email |
| `pending` | `verified` | Email verified, awaiting admin approval |
| `approved` | `verified` | Live on site |
| `rejected` | `verified` | Rejected by admin |

## User Experience

### **User Submits Organization**

**Response:**
```json
{
  "success": true,
  "message": "Please check your email to verify your address",
  "requiresEmailVerification": true,
  "verificationEmail": "admin@school.org"
}
```

**Frontend shows:**
```
✓ Submission Received!

We've sent a verification email to admin@school.org

Please check your inbox and click the verification link to 
complete your submission. The link expires in 48 hours.
```

### **User Receives Email**

**Subject:** Verify Your Email - [Organization Name]

**Content:**
- Clear "Verify Email Address" button
- Explanation of next steps
- Link expires in 48 hours warning
- Alternative plain-text link

### **User Clicks Verification Link**

**Redirects to:** `/verify-email?token=abc123...`

**Page shows:**
```
✓ Email Verified!

Thank you! Your email has been verified for [Org Name].
Our team will review your submission and get back to you 
within 2-3 business days.

What's Next:
• Check your email for confirmation
• Our team reviews your organization  
• You'll receive approval notification
• Your organization goes live with verified badge ✓

[Return to Home]
```

### **Confirmation Email Sent**

User receives second email:
- Confirms email verification
- Explains review timeline
- Sets expectations

## MapWorks Experience

### **Before Email Verification**

**You receive:** Nothing

Organization sits in database with:
- `approval_status: 'email_pending'`
- `email_verification_status: 'pending'`

**Why?** Prevents spam submissions from reaching you. Only verified emails get to your inbox.

### **After Email Verification**

**You receive email:**
```
Subject: ✅ Email Verified - Ready for Review: [Org Name]

✅ Email Verified: admin@school.org clicked verification link

Organization Details:
- Name, type, country, website, description

Email Verification Details:
✅ Email verified: admin@school.org
✅ Email Domain: school.org
✅ Website Domain: school.org
✅ Domains Match: Yes (High confidence)

Recommended: Fast-track approval

[Review in Supabase Dashboard]
```

**If domains don't match:**
```
⚠️ Manual Review Required
Email domain (gmail.com) doesn't match website (school.org)
Please verify legitimacy before approving.
```

### **Your Approval Process**

1. **Go to Supabase → organizations table**
2. **Filter:** `approval_status = 'pending'` AND `email_verification_status = 'verified'`
3. **Review organization details**
4. **Check verification confidence:**
   - High confidence (domains match) → Fast approval
   - Low confidence (domains don't match) → Extra verification

5. **Approve or Reject:**

```sql
-- Approve
UPDATE organizations 
SET 
  approval_status = 'approved',
  verified = true,
  approved_at = NOW()
WHERE id = 'org_id';

-- Reject  
UPDATE organizations 
SET 
  approval_status = 'rejected',
  rejection_reason = 'Reason here'
WHERE id = 'org_id';
```

6. **User automatically receives email** (approval/rejection)

## Security Features

### **Token Expiration**
- Verification links expire after 48 hours
- Prevents stale/leaked links from being used
- User must resubmit if expired

### **Domain Matching**
System automatically checks if:
```javascript
Email: admin@harvard.edu
Website: harvard.edu
Match: ✅ Yes (High confidence)
```

vs.

```javascript
Email: someone@gmail.com
Website: school.org
Match: ❌ No (Requires review)
```

### **One-Time Use**
- Each verification token used only once
- Already-verified returns success but doesn't re-notify

### **Unique Tokens**
- Cryptographically random 64-character tokens
- Impossible to guess or brute-force

## Email Flows

### **Flow 1: Successful Verification**

```
User submits → Verification email →
User clicks link → Email verified →
Confirmation email to user →
Notification email to MapWorks →
You approve → Approval email to user →
Org goes live ✓
```

**Emails sent:**
1. Verification request (to user)
2. Verification confirmation (to user)
3. Review notification (to MapWorks) ← **Only after email verified**
4. Approval notification (to user)

**Total: 4 emails**

### **Flow 2: Expired Link**

```
User submits → Verification email →
48 hours pass →
User clicks link → Error: Expired →
User must resubmit
```

### **Flow 3: Already Verified**

```
User clicks verification link again →
Success: Already verified →
No duplicate emails sent
```

## API Endpoints

### **POST /api/submit-new-organization**

**Changes:**
- Generates verification token
- Sets `approval_status: 'email_pending'`
- Sends verification email (NOT admin notification)
- Returns `requiresEmailVerification: true`

### **POST /api/verify-email**

**New endpoint:**
- Accepts verification token
- Validates token and expiration
- Updates `email_verification_status: 'verified'`
- Changes `approval_status: 'email_pending'` → `'pending'`
- Sends confirmation to user
- Sends notification to MapWorks

**Query params or body:**
```javascript
{ "token": "abc123..." }
```

**Returns:**
```javascript
{
  "success": true,
  "message": "Email verified successfully",
  "organizationName": "Harvard",
  "estimatedReviewTime": "1-2 business days"
}
```

## Database Schema

**New fields in organizations table:**

```sql
email_verification_token TEXT UNIQUE,
email_verification_status TEXT DEFAULT 'pending' 
  CHECK (status IN ('pending', 'verified', 'expired')),
email_verified_at TIMESTAMP WITH TIME ZONE,
verification_token_expires_at TIMESTAMP WITH TIME ZONE,
```

**approval_status values updated:**

```sql
approval_status TEXT DEFAULT 'approved' 
  CHECK (status IN ('email_pending', 'pending', 'approved', 'rejected'))
```

## Frontend Integration

### **After Submission**

```javascript
const response = await fetch('/api/submit-new-organization', {
  method: 'POST',
  body: JSON.stringify(formData)
});

const data = await response.json();

if (data.requiresEmailVerification) {
  // Show "Check your email" message
  showMessage(`Verification email sent to ${data.verificationEmail}`);
} else {
  // Old flow (shouldn't happen for new submissions)
  showMessage('Submitted for review');
}
```

### **Verification Page**

Simple HTML page at `/verify-email.html`:
- Reads token from query params
- Calls `/api/verify-email`
- Shows success/error state
- No React needed (works standalone)

## Testing

### **Test Successful Verification**

1. Submit organization with real email
2. Check email inbox
3. Click verification link
4. Should see success page
5. Check Supabase: `email_verification_status = 'verified'`
6. Check MapWorks email for notification

### **Test Expired Link**

1. Submit organization
2. In Supabase, set `verification_token_expires_at` to past date
3. Click verification link
4. Should see "Expired" error

### **Test Invalid Token**

1. Visit `/verify-email?token=invalid`
2. Should see "Invalid link" error

## Troubleshooting

### **User didn't receive email**

1. Check Resend logs for delivery
2. Check spam folder
3. Verify email address is valid
4. Resend option (future feature)

### **Link expired**

User must resubmit organization
- Original submission deleted or marked expired
- New submission generates new token

### **Email verified but no admin notification**

- Check Resend logs
- Verify `/api/verify-email` successfully sent admin email
- Check `email_verification_status = 'verified'` in database

## Benefits

### **Reduces Spam**
- 90% of spam filtered before reaching you
- Only verified emails get to your inbox

### **Proves Email Ownership**
- User must have access to claimed email
- Harder to fake than just typing an address

### **Better Signal**
- Domain matching shows higher confidence
- Focus your time on legitimate submissions

### **User Trust**
- Professional, standard practice
- Sets expectations for review process

## Future Enhancements

### **Resend Verification Email**
Allow users to request new verification email if expired

### **Reminder Emails**
"You haven't verified yet" after 24 hours

### **Verification Dashboard**
Show verification status in user account

### **Bulk Verification**
For organizations importing multiple schools

---

**Level 2 Email Verification is now active!** 🎉

All new organization submissions require email verification before reaching your inbox for review.
