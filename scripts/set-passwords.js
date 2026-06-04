const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ADMINS = [
  { email: 'kalibest10@gmail.com',      password: 'airbone123'   },
  { email: 'hussainyusuf393@gmail.com', password: 'YusufHussain' },
]

async function run() {
  for (const admin of ADMINS) {
    console.log(`\nProcessing: ${admin.email}`)

    // Check if user already exists
    const { data: list } = await supabase.auth.admin.listUsers()
    const existing = list?.users?.find(u => u.email === admin.email)

    if (existing) {
      // Update password
      const { error } = await supabase.auth.admin.updateUserById(existing.id, {
        password: admin.password,
        email_confirm: true,
      })
      if (error) console.error(`  ❌ Update failed:`, error.message)
      else console.log(`  ✅ Password updated for ${admin.email}`)
    } else {
      // Create new user
      const { error } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
      })
      if (error) console.error(`  ❌ Create failed:`, error.message)
      else console.log(`  ✅ User created: ${admin.email}`)
    }
  }
  console.log('\nDone.')
}

run()
