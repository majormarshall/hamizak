const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'
)

async function diagnose() {
  console.log('\n=== Gallery Albums ===')
  const { data: albums, error: albumErr } = await supabase
    .from('gallery_albums')
    .select('id, title, is_active, display_order')
    .order('display_order')

  if (albumErr) { console.error('Album error:', albumErr.message); return }
  console.log(`Found ${albums.length} albums:`)
  albums.forEach(a => console.log(`  [${a.is_active ? 'ACTIVE' : 'INACTIVE'}] ${a.title} (id: ${a.id})`))

  console.log('\n=== Gallery Images ===')
  const { data: images, error: imgErr } = await supabase
    .from('gallery_images')
    .select('id, album_id, url, caption')

  if (imgErr) { console.error('Image error:', imgErr.message); return }
  console.log(`Found ${images.length} images total`)
  images.slice(0, 5).forEach(i => console.log(`  album:${i.album_id} | ${i.url.substring(0, 60)}...`))

  console.log('\n=== Storage Buckets ===')
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets()
  if (bucketErr) { console.error('Bucket error:', bucketErr.message) }
  else buckets.forEach(b => console.log(`  Bucket: ${b.name} (public: ${b.public})`))
}

diagnose()
