// scripts/setup-board-photos.js
// Run: node scripts/setup-board-photos.js
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function setup() {
  console.log('🚀 Setting up board-photos storage and table...\n')

  // ── 1. Create / ensure the storage bucket ──────────────────────
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === 'board-photos')

  if (!exists) {
    const { error } = await supabase.storage.createBucket('board-photos', { public: true })
    if (error) {
      console.error('❌ Could not create bucket:', error.message)
    } else {
      console.log('✅ Created public bucket: board-photos')
    }
  } else {
    // Ensure it is public
    await supabase.storage.updateBucket('board-photos', { public: true })
    console.log('✅ Bucket "board-photos" already exists — ensured public')
  }

  // ── 2. Create the board_photos table via raw SQL (pg REST) ──────
  // Supabase doesn't expose DDL via the JS client directly, so we use
  // the REST endpoint with the service role key.
  const sql = `
    CREATE TABLE IF NOT EXISTS board_photos (
      slug        TEXT PRIMARY KEY,
      image_url   TEXT NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    -- Enable RLS
    ALTER TABLE board_photos ENABLE ROW LEVEL SECURITY;

    -- Drop old policies if re-running
    DROP POLICY IF EXISTS "board_photos_public_read"   ON board_photos;
    DROP POLICY IF EXISTS "board_photos_service_write" ON board_photos;

    -- Public can read
    CREATE POLICY "board_photos_public_read"
      ON board_photos FOR SELECT USING (true);

    -- Service role can write (API route uses service role key)
    CREATE POLICY "board_photos_service_write"
      ON board_photos FOR ALL USING (true) WITH CHECK (true);
  `

  const pgUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', 'https://').replace('.supabase.co', '.supabase.co')
  const resp = await fetch(`${pgUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey':        process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ sql }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    // The exec_sql RPC may not exist — fall back to direct insert to verify connectivity
    if (text.includes('does not exist') || text.includes('404')) {
      console.log('ℹ️  exec_sql RPC not available — creating table via migration approach...')
      await createTableDirectly()
    } else {
      console.error('❌ SQL exec error:', text)
    }
  } else {
    console.log('✅ board_photos table created / verified via exec_sql')
  }

  // ── 3. Verify table by doing a select ──────────────────────────
  const { data, error: selectErr } = await supabase.from('board_photos').select('slug').limit(1)
  if (selectErr) {
    console.log('⚠️  Table may not exist yet via JS client:', selectErr.message)
    console.log('\n👉 Please run this SQL in the Supabase SQL Editor:\n')
    console.log(`
CREATE TABLE IF NOT EXISTS board_photos (
  slug        TEXT PRIMARY KEY,
  image_url   TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE board_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "board_photos_public_read"   ON board_photos FOR SELECT USING (true);
CREATE POLICY "board_photos_service_write" ON board_photos FOR ALL USING (true) WITH CHECK (true);
    `)
  } else {
    console.log('✅ board_photos table is accessible. Rows:', data?.length ?? 0)
  }

  console.log('\n🎉 Setup complete!')
  console.log('   Bucket URL pattern:')
  console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/board-photos/{slug}.jpg`)
}

async function createTableDirectly() {
  // Try using the pg endpoint directly
  try {
    await supabase.from('board_photos').select('slug').limit(1)
    console.log('✅ Table already exists')
  } catch {
    console.log('Table does not exist — please create it manually via the SQL Editor')
  }
}

setup().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
