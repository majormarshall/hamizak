const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://lshfwfliimepxwymjwrf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  console.log('🚀 Starting Clean Restoration & Seeding Process...\n')

  // 1. SITE SETTINGS
  console.log('🔄 Restoring Site Settings...')
  const initialSettings = {
    id: 1,
    school_name: 'Hamizak Montessori Academy',
    address: 'Sabon Lugbe, Airport Road, Abuja',
    phone1: '08032253811',
    phone2: '08062418351',
    email: 'hamizakacademy@gmail.com',
    whatsapp: '2348032253811',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    google_maps_embed: '',
    logo_url: '/images/hma-logo.jpg',
    favicon_url: '/images/hma-logo.jpg',
    primary_color: '#2D6A4F',
    secondary_color: '#F4A261',
    accent_color: '#457B9D',
    footer_copyright: '© 2025 Hamizak Montessori Academy. All rights reserved.',
    meta_title: 'Hamizak Montessori Academy | Abuja, Nigeria',
    meta_description: 'Hamizak Montessori Academy — Discipline, Integrity & Excellence. Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja.',
    maintenance_mode: false,
    announcement_enabled: false,
    announcement_text: '',
    announcement_color: '#2D6A4F',
    hero_headline: 'Nurturing Independent Learners for a Bright Future',
    hero_subtitle: 'Welcome to Hamizak Montessori Academy — Where Every Child Blooms',
    hero_image_url: '/images/school-building-main.jpg',
    hero_cta_primary: 'Enroll Now',
    hero_cta_secondary: 'Book a School Tour',
    applications_open: true
  }

  const { error: settingsErr } = await supabase
    .from('site_settings')
    .upsert(initialSettings, { onConflict: 'id' })

  if (settingsErr) {
    console.error('❌ Site Settings error:', settingsErr.message)
  } else {
    console.log('✅ Site Settings restored successfully.')
  }

  // 2. PROGRAMS
  console.log('\n🔄 Restoring Programs...')
  await supabase.from('programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const programs = [
    {
      title: 'Toddler Community',
      age_range: '18 months – 3 years',
      description: 'Gentle introduction to independence, language, and sensory exploration in a warm, nurturing environment guided by trained educators.',
      image_url: '/images/toddler-play.jpg',
      icon: '🌱',
      features: ["Practical life activities", "Sensory materials", "Language development", "Social grace and courtesy"],
      display_order: 1,
      is_active: true
    },
    {
      title: "Children's House",
      age_range: '3 – 6 years',
      description: 'The classic Montessori experience — child-led learning with rich materials across all curriculum areas including Montessori materials.',
      image_url: '/images/montessori-materials.jpg',
      icon: '🌿',
      features: ["Math & numeracy", "Reading & writing", "Cultural studies", "Art & music", "VR-enhanced learning"],
      display_order: 2,
      is_active: true
    },
    {
      title: 'Elementary',
      age_range: '6 – 12 years',
      description: 'Collaborative deep-dives into science, robotics, arts and mathematics. Students build real robots, learn in science labs and explore VR.',
      image_url: '/images/robotics-class.jpg',
      icon: '🌳',
      features: ["Robotics & STEM", "Science lab experiments", "VR learning experiences", "Music & arts", "Vocational skills"],
      display_order: 3,
      is_active: true
    }
  ]

  for (const program of programs) {
    const { error } = await supabase.from('programs').insert(program)
    if (error) console.error(`❌ Program "${program.title}":`, error.message)
    else console.log(`✅ Program: ${program.title}`)
  }

  // 3. CORE VALUES
  console.log('\n🔄 Restoring Core Values...')
  await supabase.from('core_values').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const coreValues = [
    { icon: '💚', title: 'Respect', description: 'Every child is valued and treated as a unique, capable individual.', display_order: 1 },
    { icon: '🔍', title: 'Curiosity', description: 'We celebrate questioning, exploring, and discovering the world.', display_order: 2 },
    { icon: '🤝', title: 'Community', description: 'Learning together builds stronger, more empathetic children.', display_order: 3 },
    { icon: '🌿', title: 'Nature', description: 'Connection to the natural world grounds and inspires us all.', display_order: 4 },
    { icon: '⭐', title: 'Excellence', description: 'We set high, achievable standards and celebrate every milestone.', display_order: 5 }
  ]

  for (const value of coreValues) {
    const { error } = await supabase.from('core_values').insert(value)
    if (error) console.error(`❌ Core value "${value.title}":`, error.message)
    else console.log(`✅ Core value: ${value.title}`)
  }

  // 4. WHY CHOOSE US FEATURES
  console.log('\n🔄 Restoring Why Choose Us Features...')
  await supabase.from('why_choose_us_features').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const whyChoose = [
    { icon: '🤖', title: 'Robotics & STEM Lab', description: 'Students build and program real robots, developing critical thinking and engineering skills from an early age.', display_order: 1 },
    { icon: '🔬', title: 'Fully Equipped Science Lab', description: 'Hands-on chemistry and biology experiments in our professional laboratory with trained science educators.', display_order: 2 },
    { icon: '🥽', title: 'VR-Enhanced Learning', description: 'We integrate Virtual Reality technology to make learning immersive, engaging, and unforgettable.', display_order: 3 },
    { icon: '🎵', title: 'Music & Arts Programme', description: 'Students learn violin, guitar, and other instruments in our dedicated music room alongside fine arts.', display_order: 4 },
    { icon: '🏊', title: 'Swimming Pool & Sports', description: 'Our on-site swimming pool, football pitch, basketball court, and table tennis facilities keep students active.', display_order: 5 },
    { icon: '✂️', title: 'Vocational Skills Training', description: 'Practical training in tailoring, barbering, and cosmetology prepares students for real-world self-reliance.', display_order: 6 }
  ]

  for (const feature of whyChoose) {
    const { error } = await supabase.from('why_choose_us_features').insert(feature)
    if (error) console.error(`❌ Feature "${feature.title}":`, error.message)
    else console.log(`✅ Feature: ${feature.title}`)
  }

  // 5. ADMISSION STEPS
  console.log('\n🔄 Restoring Admission Steps...')
  await supabase.from('admission_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const steps = [
    { step_number: 1, title: 'Download Prospectus', description: 'Get our full programme guide, curriculum overview, and fee schedule.' },
    { step_number: 2, title: 'Submit Application', description: 'Complete our online application form with your child\'s details.' },
    { step_number: 3, title: 'Schedule a Tour', description: 'Visit us, experience the Hamizak environment, and meet our guides.' },
    { step_number: 4, title: 'Enrolment & Orientation', description: 'Complete registration paperwork and attend our welcome orientation.' }
  ]

  for (const step of steps) {
    const { error } = await supabase.from('admission_steps').insert(step)
    if (error) console.error(`❌ Step ${step.step_number}:`, error.message)
    else console.log(`✅ Admission step ${step.step_number}: ${step.title}`)
  }

  // 6. GALLERY BUCKET AND IMAGES
  console.log('\n🧹 Clearing old gallery images and albums...')
  await supabase.from('gallery_images').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('gallery_albums').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('\n🖼️  Processing Gallery Images...')
  const BUCKET = 'gallery'

  // Ensure storage bucket is public
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET)
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) {
      console.error('❌ Storage Bucket creation error:', error.message)
      return
    }
    console.log('✅ Created public bucket: gallery')
  } else {
    await supabase.storage.updateBucket(BUCKET, { public: true })
    console.log('✅ Bucket "gallery" exists and is public')
  }

  // Seed gallery albums and images
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

  const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
  const albumMap = {}

  for (const img of newImages) {
    // Ensure Album
    if (!albumMap[img.albumTitle]) {
      const { data: existingAlbum } = await supabase
        .from('gallery_albums')
        .select('id')
        .eq('title', img.albumTitle)
        .single()

      if (existingAlbum) {
        albumMap[img.albumTitle] = existingAlbum.id
        console.log(`✅ Using existing album: "${img.albumTitle}"`)
      } else {
        const { data: newAlbum, error: albumErr } = await supabase
          .from('gallery_albums')
          .insert({ title: img.albumTitle, is_active: true, display_order: Object.keys(albumMap).length + 1 })
          .select()
          .single()

        if (albumErr) {
          console.error(`❌ Failed to create album "${img.albumTitle}":`, albumErr.message)
          continue
        }
        albumMap[img.albumTitle] = newAlbum.id
        console.log(`🆕 Created album: "${img.albumTitle}"`)
      }
    }

    const albumId = albumMap[img.albumTitle]
    const filePath = path.join(IMAGES_DIR, img.localFile)

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Local file not found, skipping: ${img.localFile} (Path: ${filePath})`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(img.localFile).slice(1)
    const storagePath = `campus/${Date.now()}-${img.localFile}`

    // Upload to Storage
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: true
      })

    if (uploadErr) {
      console.warn(`⚠️  Upload failed for ${img.localFile}: ${uploadErr.message}. Falling back to local URL.`)
      const publicUrl = `/images/${img.localFile}`
      const { error: dbErr } = await supabase.from('gallery_images').insert({
        album_id: albumId,
        url: publicUrl,
        caption: img.caption,
        display_order: 1
      })
      if (dbErr) console.error(`❌ DB insert failed for ${img.localFile}:`, dbErr.message)
      else console.log(`✅ Seeded ${img.localFile} using local fallback path`)
      continue
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    const { error: dbErr } = await supabase.from('gallery_images').insert({
      album_id: albumId,
      url: publicUrl,
      caption: img.caption,
      display_order: 1
    })

    if (dbErr) {
      console.error(`❌ DB insert failed for ${img.localFile}:`, dbErr.message)
    } else {
      console.log(`✅ Uploaded & seeded image: ${img.caption}`)
    }
  }

  console.log('\n🎉 Restoration and Gallery Seeding Complete!')
}

run().catch(console.error)
