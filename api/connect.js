// Serverless function for handling connection requests between organizations
// This function sends emails via Resend (https://resend.com)
// Environment variable required: RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    yourOrganization,
    yourRole,
    partnershipInterest,
    timeline,
    targetOrganization,
    targetEmail,
    organizationWebsite
  } = req.body;

  // Validate required fields
  if (!yourOrganization || !yourRole || !partnershipInterest || !targetEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(targetEmail)) {
    return res.status(400).json({ error: 'Invalid target email address' });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send connection request to target organization
    const connectionEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: targetEmail,
        replyTo: 'hello@thevirtualexchange.org',
        subject: `Partnership Request from ${yourOrganization}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px;">
              <h1 style="color: #1f2937; font-weight: 300; font-size: 28px; margin-bottom: 8px;">The Virtual Exchange</h1>
              <p style="color: #6b7280; font-style: italic; margin: 0;">"Every conversation is a step toward solidarity"</p>
            </div>

            <h2 style="color: #1f2937; margin-bottom: 16px;">New Partnership Request</h2>

            <p style="color: #4b5563; line-height: 1.6;">
              ${targetOrganization} has received a connection request through The Virtual Exchange platform.
            </p>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">Request Details</h3>

              <div style="margin-bottom: 16px;">
                <strong style="color: #374151; display: block; margin-bottom: 4px;">Organization:</strong>
                <span style="color: #4b5563;">${yourOrganization}</span>
              </div>

              <div style="margin-bottom: 16px;">
                <strong style="color: #374151; display: block; margin-bottom: 4px;">Contact Role:</strong>
                <span style="color: #4b5563;">${yourRole}</span>
              </div>

              <div style="margin-bottom: 16px;">
                <strong style="color: #374151; display: block; margin-bottom: 4px;">Preferred Timeline:</strong>
                <span style="color: #4b5563;">${timeline}</span>
              </div>

              <div>
                <strong style="color: #374151; display: block; margin-bottom: 8px;">Partnership Interest:</strong>
                <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                  ${partnershipInterest.replace(/\n/g, '<br>')}
                </p>
              </div>
            </div>

            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Next Steps:</strong> Reply to this email at hello@mapworkslearning.org to express interest or request more information.
                We'll facilitate the connection between your organizations.
              </p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Visit The Virtual Exchange
              </a>
            </div>

            <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>The Virtual Exchange</strong><br>
              A MapWorks Learning Initiative<br>
              Breaking down borders through education</p>
              <p style="margin-top: 16px;">
                Questions? Reply to this email or contact us at hello@thevirtualexchange.org
              </p>
            </div>
          </div>
        `
      })
    });

    if (!connectionEmailResponse.ok) {
      const errorData = await connectionEmailResponse.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send connection request');
    }

    // Send confirmation to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@thevirtualexchange.org>',
        to: 'hello@mapworkslearning.org',
        subject: 'New Connection Request',
        html: `
          <h2>New Connection Request</h2>
          <p><strong>From:</strong> ${yourOrganization}</p>
          <p><strong>Role:</strong> ${yourRole}</p>
          <p><strong>To:</strong> ${targetOrganization} (${targetEmail})</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          <p><strong>Interest:</strong></p>
          <p>${partnershipInterest.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!adminEmailResponse.ok) {
      console.error('Failed to send admin notification');
      // Don't fail the request if admin notification fails
    }

    return res.status(200).json({
      success: true,
      message: 'Connection request sent successfully'
    });

  } catch (error) {
    console.error('Connection request error:', error);
    return res.status(500).json({
      error: 'Failed to send connection request'
    });
  }
}
