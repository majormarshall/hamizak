/**
 * seed-gallery.js
 * Inserts the 5 provided photos into Supabase gallery_albums + gallery_images.
 * Run with: node seed-gallery.js
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

const SUPABASE_URL = 'https://goujqsklmwvdayhodrnu.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdWpxc2tsbXd2ZGF5aG9kcm51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwOTY4MywiZXhwIjoyMDkzNjg1NjgzfQ.UtHrwVmNqqkeMI26rWpOR5w_xLAcfHYBiXmBv7wwh94'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// The 5 new images the user provided, mapped to existing public/images filenames
// Image 1: School building front view (main green building with school buses)
// Image 2: Colorful school annex (rainbow-painted building with football field)
// Image 3: Swimming pool with children
// Image 4: Science lab with microscopes
// Image 5: Robotics/STEM class

const SITE_BASE = 'https://goujqsklmwvdayhodrnu.supabase.co/storage/v1/object/public/gallery'

// We'll upload these from public/images or use their already-uploaded URLs
// Since the images aren't yet in Supabase storage, we'll first upload them

const IMAGES_DIR = path.join(__dirname, 'public', 'images')

const newImages = [
  {
    localFile: 'school-building-main.jpg',
    caption: 'Hamizak Montessori Academy – Main Campus Building',
    albumTitle: 'Our Campus',
  },
  {
    localFile: 'school-building-colorful.jpg',
    caption: 'Vibrant Annex Building with Football Field',
    albumTitle: 'Our Campus',
  },
  {
    localFile: 'swimming-pool.jpg',
    caption: 'Students Enjoying the School Swimming Pool',
    albumTitle: 'Sports & Recreation',
  },
  {
    localFile: 'science-lab-microscope.jpg',
    caption: 'Science Lab – Microscopy Session',
    albumTitle: 'Academic Life',
  },
  {
    localFile: 'stem-robotics.jpg',
    caption: 'STEM Robotics Class in Session',
    albumTitle: 'Academic Life',
  },
]

async function uploadAndSeed() {
  console.log('🚀 Starting gallery seed...\n')

  // 1. Ensure albums exist
  const albumTitles = [...new Set(newImages.map(i => i.albumTitle))]
  const albumMap = {}

  for (const title of albumTitles) {
    // Check if album already exists
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
        .insert({ title, is_active: true, display_order: Object.keys(albumMap).length + 1 })
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

  // 2. Upload images to Supabase Storage & insert gallery_images rows
  console.log('\n📤 Uploading images...\n')

  for (const img of newImages) {
    const filePath = path.join(IMAGES_DIR, img.localFile)

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found, skipping: ${img.localFile}`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(img.localFile).slice(1)
    const storagePath = `campus/${Date.now()}-${img.localFile}`

    // Upload to Supabase Storage bucket "gallery"
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: true,
      })

    if (uploadError) {
      // If bucket doesn't exist or upload fails, use local public URL
      console.warn(`⚠️  Storage upload failed for ${img.localFile}: ${uploadError.message}`)
      console.log(`   Using local public URL instead`)

      const publicUrl = `/images/${img.localFile}`
      const albumId = albumMap[img.albumTitle]

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({ album_id: albumId, url: publicUrl, caption: img.caption, display_order: 1 })

      if (insertError) {
        console.error(`❌ Insert failed for ${img.localFile}:`, insertError.message)
      } else {
        console.log(`✅ Inserted (local URL): ${img.caption}`)
      }
      continue
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(storagePath)
    const albumId = albumMap[img.albumTitle]

    const { error: insertError } = await supabase
      .from('gallery_images')
      .insert({ album_id: albumId, url: publicUrl, caption: img.caption, display_order: 1 })

    if (insertError) {
      console.error(`❌ Insert failed for ${img.localFile}:`, insertError.message)
    } else {
      console.log(`✅ Uploaded & inserted: ${img.caption}`)
    }
  }

  console.log('\n🎉 Gallery seed complete!')
}

uploadAndSeed().catch(console.error)
