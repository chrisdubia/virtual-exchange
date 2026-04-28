// Authentication signup endpoint using Supabase
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { firstName, lastName, email, password, role, organization } = req.body

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase not configured')
      return res.status(500).json({ error: 'Authentication service not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role,
        organization
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ error: 'Email already registered' })
      }
      return res.status(500).json({ error: 'Failed to create account' })
    }

    // Send welcome email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
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
                <h2 style="color: #1f2937;">Welcome, ${firstName}!</h2>
                <p>Your account has been created successfully. You can now:</p>
                <ul>
                  <li>Browse and search for partner organizations</li>
                  <li>Claim your organization's profile</li>
                  <li>Send connection requests</li>
                  <li>Access our resource library</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://virtual-exchange.vercel.app" style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px;">
                    Get Started
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                  The Virtual Exchange - A MapWorks Learning Initiative
                </p>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail signup if email fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Failed to create account' })
  }
}
