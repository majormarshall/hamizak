const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'
)

const BUCKET     = 'gallery'
const IMAGES_DIR = path.join(__dirname, 'gallery-upload')
const ALBUM_NAME = 'School Life at HMA'
const ALBUM_DESC = 'A glimpse into life at Hamizak Montessori Academy — our facilities, students and activities.'

async function run() {
  // 1. Ensure bucket exists and is public
  console.log('Checking storage bucket...')
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET)
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) { console.error('Bucket error:', error.message); return }
    console.log('✅ Created public bucket: gallery')
  } else {
    await supabase.storage.updateBucket(BUCKET, { public: true })
    console.log('✅ Bucket exists and is public')
  }

  // 2. Create or reuse album
  console.log('\nSetting up album...')
  let albumId
  const { data: existing } = await supabase
    .from('gallery_albums')
    .select('id')
    .eq('title', ALBUM_NAME)
    .single()

  if (existing) {
    albumId = existing.id
    console.log(`✅ Using existing album: "${ALBUM_NAME}"`)
  } else {
    const { data: newAlbum, error } = await supabase
      .from('gallery_albums')
      .insert({ title: ALBUM_NAME, description: ALBUM_DESC, is_active: true, display_order: 1 })
      .select().single()
    if (error) { console.error('Album error:', error.message); return }
    albumId = newAlbum.id
    console.log(`✅ Created album: "${ALBUM_NAME}"`)
  }

  // 3. Upload images
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`\n⚠️  Folder not found: ${IMAGES_DIR}`)
    return
  }

  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))

  if (files.length === 0) {
    console.log(`\n⚠️  No images found in gallery-upload folder`)
    return
  }

  console.log(`\nUploading ${files.length} photo(s)...`)

  const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext  = path.extname(file).toLowerCase()
    const storagePath = `school-life/${Date.now()}-${i}.${ext.slice(1)}`

    const buffer = fs.readFileSync(path.join(IMAGES_DIR, file))
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: mimeMap[ext] || 'image/jpeg', upsert: true })

    if (uploadErr) { console.error(`❌ ${file}:`, uploadErr.message); continue }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    const caption = path.basename(file, ext).replace(/[-_\d]/g, ' ').trim()

    const { error: dbErr } = await supabase.from('gallery_images').insert({
      album_id: albumId,
      url: urlData.publicUrl,
      caption,
      display_order: i + 1
    })

    if (dbErr) { console.error(`❌ DB error for ${file}:`, dbErr.message) }
    else { console.log(`✅ ${file}`) }
  }

  console.log('\n🎉 Done! Your gallery page will now show all photos.')
}

run()
