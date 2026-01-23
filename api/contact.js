// Serverless function for handling contact form submissions
// This function sends emails via Resend (https://resend.com)
// Environment variable required: RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, organization, subject, message } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Send email using Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send notification to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@mapworkslearning.org>',
        to: 'hello@mapworkslearning.org',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!adminEmailResponse.ok) {
      const errorData = await adminEmailResponse.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send admin notification');
    }

    // Send thank you email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Virtual Exchange <hello@mapworkslearning.org>',
        to: email,
        subject: 'Thank you for contacting The Virtual Exchange',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Thank You for Reaching Out!</h2>
            <p>Hi ${firstName},</p>
            <p>We've received your message and appreciate you contacting The Virtual Exchange. Our team will review your inquiry and get back to you as soon as possible.</p>

            <div style="background-color: #f9fafb; border-left: 4px solid #1f2937; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Your message:</strong></p>
              <p style="margin-top: 8px;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Browse our <a href="https://virtual-exchange.vercel.app" style="color: #1f2937;">partner organizations</a></li>
              <li>Learn more about <a href="https://virtual-exchange.vercel.app" style="color: #1f2937;">getting verified</a></li>
              <li>Explore our <a href="https://virtual-exchange.vercel.app" style="color: #1f2937;">AI-powered matching tool</a></li>
            </ul>

            <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><em>"Every conversation is a step toward solidarity"</em></p>
              <p><strong>The Virtual Exchange</strong><br>A MapWorks Learning Initiative</p>
              <p>Questions? Reply to this email or contact us at hello@mapworkslearning.org</p>
            </div>
          </div>
        `
      })
    });

    if (!userEmailResponse.ok) {
      const errorData = await userEmailResponse.json();
      console.error('Failed to send thank you email:', errorData);
      // Don't fail the request if thank you email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to send message. Please try again or email us directly at hello@mapworkslearning.org'
    });
  }
}
