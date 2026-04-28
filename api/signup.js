// Serverless function for handling signup form submissions
// This function sends welcome emails via Resend (https://resend.com)
// Environment variable required: RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, intent, role, organization } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send welcome email to new user
    const welcomeEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: email,
        subject: 'Welcome to The Virtual Exchange!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1f2937; font-weight: 300; font-size: 32px; margin-bottom: 8px;">The Virtual Exchange</h1>
              <p style="color: #6b7280; font-style: italic;">"Every conversation is a step toward solidarity"</p>
            </div>

            <h2 style="color: #1f2937;">Welcome, ${firstName}!</h2>
            <p>Thank you for joining The Virtual Exchange. We're excited to have you as part of our global community connecting educational institutions worldwide.</p>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Your Account Details</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              ${organization ? `<p style="margin: 8px 0;"><strong>Organization:</strong> ${organization}</p>` : ''}
              ${role ? `<p style="margin: 8px 0;"><strong>Role:</strong> ${role}</p>` : ''}
              ${intent ? `<p style="margin: 8px 0;"><strong>Intent:</strong> ${intent === 'provider' ? 'Virtual Exchange Provider' : 'Looking to Participate'}</p>` : ''}
            </div>

            <h3 style="color: #1f2937;">Next Steps</h3>
            <ol style="color: #4b5563; line-height: 1.8;">
              <li><strong>Complete Your Profile:</strong> Add more details about your organization and partnership goals</li>
              <li><strong>Browse Partners:</strong> Explore our network of verified educational institutions</li>
              <li><strong>Use AI Matching:</strong> Describe your ideal partnership and let our AI find perfect matches</li>
              <li><strong>Get Verified:</strong> Apply for verification to build trust and appear higher in search results</li>
            </ol>

            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>💡 Pro Tip:</strong> Organizations with complete profiles and verification badges receive 3x more partnership requests!</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Explore The Platform
              </a>
            </div>

            <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>Need Help?</strong></p>
              <p>Reply to this email or contact us at hello@thevirtualexchange.org</p>
              <p style="margin-top: 24px;"><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative<br>Breaking down borders through education</p>
            </div>
          </div>
        `
      })
    });

    if (!welcomeEmailResponse.ok) {
      const errorData = await welcomeEmailResponse.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send welcome email');
    }

    // Send notification to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: 'hello@mapworkslearning.org',
        subject: 'New User Registration',
        html: `
          <h2>New User Registered</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
          ${role ? `<p><strong>Role:</strong> ${role}</p>` : ''}
          ${intent ? `<p><strong>Intent:</strong> ${intent}</p>` : ''}
        `
      })
    });

    if (!adminEmailResponse.ok) {
      console.error('Failed to send admin notification');
      // Don't fail the request if admin notification fails
    }

    return res.status(200).json({
      success: true,
      message: 'Account created successfully. Check your email for next steps.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Failed to create account. Please try again.'
    });
  }
}
