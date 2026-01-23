# Email Setup Guide

This application uses [Resend](https://resend.com) to send transactional emails from `hello@mapworkslearning.org`.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your email address

### 2. Verify Your Domain

1. In the Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter `mapworkslearning.org`
4. Add the DNS records provided by Resend to your domain registrar:
   - TXT record for domain verification
   - DKIM records for email authentication
   - Optional: DMARC record for enhanced security
5. Wait for DNS propagation (can take up to 48 hours, usually much faster)
6. Click **Verify** in Resend dashboard

### 3. Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name like "Virtual Exchange Production"
4. Select **Full Access** permission
5. Copy the API key (starts with `re_`)

### 4. Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (e.g., `re_123abc...`)
   - **Environments:** Check Production, Preview, and Development
4. Click **Save**

### 5. Redeploy Your Application

1. Go to **Deployments** in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Testing

Once configured, the following features will work:

### Contact Form
- User fills out contact form
- Admin receives notification at `hello@mapworkslearning.org`
- User receives thank you email

### Signup Form
- User creates an account
- User receives welcome email with next steps
- Admin receives new user notification

## Email Templates

The serverless functions at `/api/contact.js` and `/api/signup.js` contain the email templates.

### Customizing Templates

To customize email content:
1. Edit the HTML in the `body` field of the Resend API call
2. Update sender name/address as needed
3. Test locally or on a preview deployment

## Troubleshooting

### Emails Not Sending

1. **Check API Key:** Ensure `RESEND_API_KEY` is set in Vercel environment variables
2. **Verify Domain:** Confirm domain verification is complete in Resend dashboard
3. **Check Logs:** View Vercel function logs for error messages
4. **DNS Propagation:** Wait 24-48 hours after adding DNS records

### Emails in Spam

1. Add SPF, DKIM, and DMARC records as provided by Resend
2. Ensure "from" address matches verified domain
3. Avoid spam trigger words in subject/body

### Rate Limits

Free tier includes:
- 3,000 emails/month
- 100 emails/day

For higher volume, upgrade to a paid plan.

## Alternative Email Services

If you prefer a different service, you can modify the API functions to use:

- **SendGrid:** Popular, generous free tier
- **Postmark:** Excellent deliverability
- **Amazon SES:** Cost-effective for high volume
- **Mailgun:** Developer-friendly API

Update `/api/contact.js` and `/api/signup.js` to use your preferred service's API.

## Security Notes

- Never commit API keys to git
- Always use environment variables
- Use different API keys for development/production
- Rotate keys if compromised
- Monitor usage in Resend dashboard

## Support

For issues with:
- **Resend Service:** support@resend.com or docs.resend.com
- **This Application:** hello@mapworkslearning.org
