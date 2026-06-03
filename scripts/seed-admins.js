const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'
)

const APPROVED_ADMINS = [
  { email: 'kalibest10@gmail.com',      role: 'admin' },
  { email: 'hussainyusuf393@gmail.com', role: 'admin' },
]

async function seed() {
  console.log('Seeding admins table...')

  for (const admin of APPROVED_ADMINS) {
    const { error } = await supabase
      .from('admins')
      .upsert(admin, { onConflict: 'email' })

    if (error) {
      console.error(`❌ Failed to insert ${admin.email}:`, error.message)
    } else {
      console.log(`✅ Inserted: ${admin.email}`)
    }
  }

  console.log('\nDone.')
}

seed()
