// Migration script to populate Supabase database with existing organizations
// Run with: node migrate-organizations.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not set!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// This data will be extracted from your App.jsx organizations array
// Copy the organizations array from App.jsx and paste it here
const organizations = [
  // PASTE YOUR ORGANIZATIONS HERE FROM App.jsx
  // Format:
  // {
  //   id: 1,
  //   name: "MapWorks Learning",
  //   type: "Provider",
  //   ...
  // }
]

async function migrateOrganizations() {
  console.log('🚀 Starting migration...')
  console.log(`📊 Found ${organizations.length} organizations to migrate\n`)

  let successCount = 0
  let errorCount = 0

  for (const org of organizations) {
    try {
      // Transform the data to match database schema
      const dbOrg = {
        name: org.name,
        type: org.type,
        category: org.category,
        country: org.country,
        region: org.region,
        description: org.description,
        languages: org.languages,
        interests: org.interests,
        capacity: org.capacity,
        email: org.email,
        phone: org.phone,
        verified: false, // No verified badge until claimed
        website: org.website,
        partnership_goals: org.partnershipGoals,
        programs: org.programs ? JSON.stringify(org.programs) : null,
        claimed: false,
        approval_status: 'approved', // Pre-loaded orgs are pre-approved
        email_verification_status: 'verified', // Skip email verification for pre-loaded orgs
        email_verified_at: new Date().toISOString(),
        approved_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('organizations')
        .insert(dbOrg)
        .select()

      if (error) {
        console.error(`❌ Failed to migrate: ${org.name}`)
        console.error(`   Error: ${error.message}`)
        errorCount++
      } else {
        console.log(`✅ Migrated: ${org.name}`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Unexpected error migrating ${org.name}:`, error.message)
      errorCount++
    }
  }

  console.log(`\n📈 Migration complete!`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
}

// Run migration
migrateOrganizations().catch(console.error)
