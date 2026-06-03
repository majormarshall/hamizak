const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'
)

const BUCKET = 'gallery'

// ── Image files to upload ──────────────────────────────────────────────────
// Put your images in the scripts/gallery-upload/ folder, then run this script
const IMAGES_DIR = path.join(__dirname, 'gallery-upload')

const ALBUM_NAME  = 'School Life at HMA'
const ALBUM_DESC  = 'A glimpse into life at Hamizak Montessori Academy — our facilities, students and activities.'

async function run() {
  // 1. Ensure bucket exists and is public
  console.log('Checking storage bucket...')
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET)

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) { console.error('Could not create bucket:', error.message); return }
    console.log('✅ Created public bucket: gallery')
  } else {
    // Make sure it is public
    await supabase.storage.updateBucket(BUCKET, { public: true })
    console.log('✅ Bucket exists: gallery (set to public)')
  }

  // 2. Create (or reuse) the album
  console.log('\nCreating album...')
  let albumId
  const { data: existing } = await supabase
    .from('gallery_albums')
    .select('id')
    .eq('title', ALBUM_NAME)
    .single()

  if (existing) {
    albumId = existing.id
    console.log(`✅ Reusing album: ${ALBUM_NAME} (${albumId})`)
  } else {
    const { data: newAlbum, error } = await supabase
      .from('gallery_albums')
      .insert({ title: ALBUM_NAME, description: ALBUM_DESC, is_active: true, display_order: 1 })
      .select()
      .single()
    if (error) { console.error('Album insert error:', error.message); return }
    albumId = newAlbum.id
    console.log(`✅ Created album: ${ALBUM_NAME} (${albumId})`)
  }

  // 3. Upload images from the gallery-upload folder
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`\n⚠️  No images folder found at: ${IMAGES_DIR}`)
    console.log('   Please create the folder and put your images there, then run again.')
    console.log('   Supported formats: .jpg .jpeg .png .webp')
    return
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  )

  if (files.length === 0) {
    console.log(`\n⚠️  No images found in ${IMAGES_DIR}`)
    return
  }

  console.log(`\nUploading ${files.length} image(s)...`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(IMAGES_DIR, file)
    const ext = path.extname(file).toLowerCase()
    const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }
    const contentType = mimeMap[ext] || 'image/jpeg'
    const storagePath = `school-life/${Date.now()}-${i}-${file.replace(/\s+/g, '-')}`

    const buffer = fs.readFileSync(filePath)
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType, upsert: true })

    if (uploadErr) {
      console.error(`❌ Failed to upload ${file}:`, uploadErr.message)
      continue
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    const caption = path.basename(file, ext)
      .replace(/[-_]/g, ' ')
      .replace(/^\d+\s*/, '')

    const { error: dbErr } = await supabase.from('gallery_images').insert({
      album_id: albumId,
      url: publicUrl,
      caption: caption,
      display_order: i + 1,
    })

    if (dbErr) {
      console.error(`❌ DB insert error for ${file}:`, dbErr.message)
    } else {
      console.log(`✅ ${file} → uploaded & saved`)
    }
  }

  console.log('\n🎉 Done! Refresh your gallery page to see the photos.')
}

run()
