/**
 * upload-batch3.js
 * Processes and adds the community outreach photos to the gallery:
 * 1. Orients images correctly using sharp.
 * 2. Saves copies to public/images/.
 * 3. Uploads to Supabase Storage ('gallery' bucket).
 * 4. Ensures 'Community Outreach' album exists in 'gallery_albums'.
 * 5. Inserts image entries into 'gallery_images'.
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lshfwfliimepxwymjwrf.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const IMAGES_DIR = path.join(__dirname, 'public', 'images')

const rawImages = [
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/f095d591-6e7b-44e8-8232-9e9ea41ca572/.user_uploaded/media_1793189805198_66ef94b7.jpg',
    targetFile: 'community-outreach-1.jpg',
    rotate: 0,
    caption: 'Community Outreach – Students and staff presenting welfare packages to community elders',
    albumTitle: 'Community Outreach',
    order: 1
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/f095d591-6e7b-44e8-8232-9e9ea41ca572/.user_uploaded/media_1793189805209_4fc13cdb.jpg',
    targetFile: 'community-outreach-2.jpg',
    rotate: 270,
    caption: 'Community Outreach Day – Community gathering and outreach program at the school grounds',
    albumTitle: 'Community Outreach',
    order: 2
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/f095d591-6e7b-44e8-8232-9e9ea41ca572/.user_uploaded/media_1793189805232_da03ae6f.jpg',
    targetFile: 'community-outreach-3.jpg',
    rotate: 270,
    caption: 'Community Outreach – Supporting community elders, families, and persons with disabilities',
    albumTitle: 'Community Outreach',
    order: 3
  }
]

async function run() {
  console.log('🚀 Processing images...\n')

  for (const item of rawImages) {
    const dest = path.join(IMAGES_DIR, item.targetFile)
    let pipeline = sharp(item.src)
    if (item.rotate !== 0) {
      pipeline = pipeline.rotate(item.rotate)
    }
    await pipeline.jpeg({ quality: 90 }).toFile(dest)
    console.log(` Saved ${item.targetFile} (rotated: ${item.rotate}°)`)
  }

  // Ensure Album exists
  console.log('\n Checking/Creating Album...')
  const albumTitle = 'Community Outreach'
  let albumId

  const { data: existingAlbum, error: albFetchErr } = await supabase
    .from('gallery_albums')
    .select('id')
    .eq('title', albumTitle)
    .maybeSingle()

  if (existingAlbum) {
    albumId = existingAlbum.id
    console.log(` Album "${albumTitle}" exists with id: ${albumId}`)
  } else {
    const { data: newAlbum, error: albCreateErr } = await supabase
      .from('gallery_albums')
      .insert({
        title: albumTitle,
        is_active: true,
        display_order: 4
      })
      .select()
      .single()

    if (albCreateErr) {
      console.error(' Failed to create album:', albCreateErr.message)
      process.exit(1)
    }
    albumId = newAlbum.id
    console.log(` Created new album "${albumTitle}" with id: ${albumId}`)
  }

  // Upload to Supabase Storage and Insert into gallery_images
  console.log('\n Uploading to Supabase Storage and inserting to database...')
  for (const item of rawImages) {
    const filePath = path.join(IMAGES_DIR, item.targetFile)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `uploads/${Date.now()}-${item.targetFile}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    let publicUrl
    if (uploadError) {
      console.warn(`⚠️ Storage upload failed: ${uploadError.message}. Using local path fallback.`)
      publicUrl = `/images/${item.targetFile}`
    } else {
      const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath)
      publicUrl = data.publicUrl
      console.log(` Uploaded to Supabase Storage: ${storagePath}`)
    }

    const { data: inserted, error: insertError } = await supabase
      .from('gallery_images')
      .insert({
        album_id: albumId,
        url: publicUrl,
        caption: item.caption,
        display_order: item.order
      })
      .select()
      .single()

    if (insertError) {
      console.error(`❌ DB insert failed for ${item.targetFile}:`, insertError.message)
    } else {
      console.log(` Added to gallery_images: ID ${inserted.id} (${item.caption})`)
    }
  }

  console.log('\n All gallery images processed and added successfully!')
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
