/**
 * upload-batch2.js
 * Adds sports court and barbering class images to gallery.
 * Run with: node upload-batch2.js
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

const SUPABASE_URL = 'https://lshfwfliimepxwymjwrf.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const IMAGES_DIR = path.join(__dirname, 'public', 'images')

const newImages = [
  {
    localFile: 'sports-court.jpg',
    caption: 'Multi-Sport Court – Football, Basketball & Table Tennis',
    albumTitle: 'Sports & Recreation',
  },
  {
    localFile: 'barbering-class.jpg',
    caption: 'Barbering & Grooming Vocational Class',
    albumTitle: 'Vocational Skills',
  },
]

async function uploadAndSeed() {
  console.log('🚀 Starting batch 2 upload...\n')

  // Ensure albums exist
  const albumTitles = [...new Set(newImages.map(i => i.albumTitle))]
  const albumMap = {}

  for (const title of albumTitles) {
    const { data: existing } = await supabase
      .from('gallery_albums')
      .select('id')
      .eq('title', title)
      .single()

    if (existing) {
      albumMap[title] = existing.id
      console.log(`✅ Album exists: "${title}" (${existing.id})`)
    } else {
      const { data: created, error } = await supabase
        .from('gallery_albums')
        .insert({ title, is_active: true, display_order: 99 })
        .select()
        .single()

      if (error) {
        console.error(`❌ Failed to create album "${title}":`, error.message)
        process.exit(1)
      }
      albumMap[title] = created.id
      console.log(`🆕 Created album: "${title}" (${created.id})`)
    }
  }

  console.log('\n📤 Uploading images...\n')

  for (const img of newImages) {
    const filePath = path.join(IMAGES_DIR, img.localFile)

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found, skipping: ${img.localFile}`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(img.localFile).slice(1)
    const storagePath = `uploads/${Date.now()}-${img.localFile}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: true,
      })

    let publicUrl
    if (uploadError) {
      console.warn(`⚠️  Storage upload failed: ${uploadError.message}`)
      publicUrl = `/images/${img.localFile}`
    } else {
      const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath)
      publicUrl = data.publicUrl
      console.log(`☁️  Uploaded: ${storagePath}`)
    }

    const albumId = albumMap[img.albumTitle]
    const { error: insertError } = await supabase
      .from('gallery_images')
      .insert({ album_id: albumId, url: publicUrl, caption: img.caption, display_order: 99 })

    if (insertError) {
      console.error(`❌ DB insert failed for ${img.localFile}:`, insertError.message)
    } else {
      console.log(`✅ Added: "${img.caption}"`)
    }
  }

  console.log('\n🎉 Batch 2 upload complete!')
}

uploadAndSeed().catch(console.error)
