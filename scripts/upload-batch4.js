/**
 * upload-batch4.js
 * Processes and adds the 5 new community outreach photos to the gallery:
 * 1. Copies/sharpens images to public/images/.
 * 2. Uploads to Supabase Storage ('gallery' bucket).
 * 3. Finds 'Community Outreach' album in 'gallery_albums'.
 * 4. Inserts image entries into 'gallery_images'.
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lshfwfliimepxwymjwrf.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')

const rawImages = [
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/c753e012-8a1e-4a04-a065-618219228622/.user_uploaded/media_1793289001147_23ec121d.jpg',
    targetFile: 'community-outreach-4.jpg',
    caption: 'Community Outreach – Student Address & Goodwill Message to Community Elders',
    albumTitle: 'Community Outreach',
    order: 4
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/c753e012-8a1e-4a04-a065-618219228622/.user_uploaded/media_1793289001175_d3dc99dd.jpg',
    targetFile: 'community-outreach-5.jpg',
    caption: 'Community Outreach – Student Recitation & Engagement with Community Leaders',
    albumTitle: 'Community Outreach',
    order: 5
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/c753e012-8a1e-4a04-a065-618219228622/.user_uploaded/media_1793289001209_ada1d9b8.jpg',
    targetFile: 'community-outreach-6.jpg',
    caption: 'Community Outreach – Unloading Welfare Packages & Food Supplies from the School Bus',
    albumTitle: 'Community Outreach',
    order: 6
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/c753e012-8a1e-4a04-a065-618219228622/.user_uploaded/media_1793289001247_883918d0.jpg',
    targetFile: 'community-outreach-7.jpg',
    caption: 'Community Outreach – Presentation of Food Provisions & Relief Packages',
    albumTitle: 'Community Outreach',
    order: 7
  },
  {
    src: 'C:/Users/exboi marshall/.gemini/antigravity/brain/c753e012-8a1e-4a04-a065-618219228622/.user_uploaded/media_1793289001269_1919b846.jpg',
    targetFile: 'community-outreach-8.jpg',
    caption: 'Community Outreach – Students Gathered by the Academy Bus during Outreach Visit',
    albumTitle: 'Community Outreach',
    order: 8
  }
]

async function run() {
  console.log('🚀 Processing images...\n')

  for (const item of rawImages) {
    const dest = path.join(IMAGES_DIR, item.targetFile)
    await sharp(item.src)
      .jpeg({ quality: 92 })
      .toFile(dest)
    console.log(`✅ Saved ${item.targetFile} to public/images/`)
  }

  // Ensure Album exists
  console.log('\n🔍 Checking Album...')
  const albumTitle = 'Community Outreach'
  let albumId

  const { data: existingAlbum, error: albFetchErr } = await supabase
    .from('gallery_albums')
    .select('id')
    .eq('title', albumTitle)
    .maybeSingle()

  if (existingAlbum) {
    albumId = existingAlbum.id
    console.log(`✅ Album "${albumTitle}" found with id: ${albumId}`)
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
      console.error('❌ Failed to create album:', albCreateErr.message)
      process.exit(1)
    }
    albumId = newAlbum.id
    console.log(`🆕 Created new album "${albumTitle}" with id: ${albumId}`)
  }

  // Upload to Supabase Storage and Insert into gallery_images
  console.log('\n📤 Uploading to Supabase Storage and inserting to database...')
  for (const item of rawImages) {
    const filePath = path.join(IMAGES_DIR, item.targetFile)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `uploads/${Date.now()}-${item.targetFile}`

    const { error: uploadErr } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadErr) {
      console.error(`❌ Failed to upload ${item.targetFile}:`, uploadErr.message)
      continue
    }

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl
    console.log(`☁️  Uploaded: ${publicUrl}`)

    const { error: dbErr } = await supabase
      .from('gallery_images')
      .insert({
        album_id: albumId,
        url: publicUrl,
        caption: item.caption,
        display_order: item.order,
      })

    if (dbErr) {
      console.error(`❌ Failed to insert DB record for ${item.targetFile}:`, dbErr.message)
    } else {
      console.log(`✅ DB record inserted for ${item.targetFile}`)
    }
  }

  console.log('\n🎉 Finished processing and uploading all 5 images!')
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
