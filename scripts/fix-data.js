const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://lshfwfliimepxwymjwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'
)

async function fixData() {

  // ── 1. Fix site_settings ────────────────────────────────────────────────
  console.log('Fixing site settings...')
  const { error: settingsErr } = await supabase
    .from('site_settings')
    .upsert({
      id: 1,
      school_name: 'Hamizak Montessori Academy',
      address: 'Sabon Lugbe, Airport Road, Abuja',
      phone1: '08032253811',
      phone2: '',
      email: 'hamizakacademy@gmail.com',
      whatsapp: '2348032253811',
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      youtube_url: '',
      google_maps_embed: '',
      logo_url: '/images/hma-logo.jpg',
      favicon_url: '/images/hma-logo.jpg',
      primary_color: '#0d9488',
      secondary_color: '#134e4a',
      accent_color: '#f59e0b',
      footer_copyright: '© 2025 Hamizak Montessori Academy. All rights reserved.',
      meta_title: 'Hamizak Montessori Academy | Abuja, Nigeria',
      meta_description: 'Discipline, Integrity & Excellence — Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja.',
      maintenance_mode: false,
      announcement_enabled: false,
      announcement_text: '',
      announcement_color: '#f59e0b',
      hero_headline: 'Nurturing Independent Learners for a Future of Excellence',
      hero_subtitle: 'From Creche to High School, we provide a world-class Montessori education rooted in discipline, integrity, and innovation.',
      hero_image_url: '/images/school-building-main.jpg',
      hero_cta_primary: 'Apply Now',
      hero_cta_secondary: 'Learn More',
      applications_open: true,
    }, { onConflict: 'id' })

  if (settingsErr) console.error('❌ site_settings error:', settingsErr.message)
  else console.log('✅ site_settings fixed')

  // ── 2. Seed Programs ────────────────────────────────────────────────────
  console.log('\nSeeding programs...')

  // Clear old programs first
  await supabase.from('programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const programs = [
    {
      title: 'Creche',
      age_range: '3 months – 1 year',
      description: 'A nurturing and safe environment for our youngest learners, with trained caregivers providing round-the-clock care.',
      image_url: '/images/creche.jpg',
      icon: '🍼',
      features: ['Trained Caregivers', 'Safe Environment', 'Daily Reports', 'Nutritious Meals'],
      display_order: 1,
      is_active: true,
    },
    {
      title: 'Toddler',
      age_range: '1 – 2 years',
      description: 'Structured play and early sensory exploration help toddlers develop motor skills and curiosity.',
      image_url: '/images/toddler.jpg',
      icon: '🧸',
      features: ['Sensory Play', 'Motor Development', 'Language Skills', 'Social Learning'],
      display_order: 2,
      is_active: true,
    },
    {
      title: 'Nursery',
      age_range: '2 – 4 years',
      description: 'The Montessori method encourages self-directed learning, independence and a love for discovery.',
      image_url: '/images/nursery.jpg',
      icon: '🌱',
      features: ['Montessori Materials', 'Self-Directed Learning', 'Creative Arts', 'Early Numeracy'],
      display_order: 3,
      is_active: true,
    },
    {
      title: 'Primary School',
      age_range: '5 – 11 years',
      description: 'A rich academic curriculum blending core subjects with critical thinking and character development.',
      image_url: '/images/primary.jpg',
      icon: '📚',
      features: ['Core Curriculum', 'STEM Activities', 'Sports & PE', 'Character Building'],
      display_order: 4,
      is_active: true,
    },
    {
      title: 'High School',
      age_range: '12 – 18 years',
      description: 'Preparing students for higher education and leadership through rigorous academics and mentorship.',
      image_url: '/images/highschool.jpg',
      icon: '🎓',
      features: ['Advanced Sciences', 'ICT & Robotics', 'Leadership Training', 'University Prep'],
      display_order: 5,
      is_active: true,
    },
  ]

  for (const program of programs) {
    const { error } = await supabase.from('programs').insert(program)
    if (error) console.error(`❌ Program "${program.title}":`, error.message)
    else console.log(`✅ Program: ${program.title}`)
  }

  // ── 3. Seed Core Values ─────────────────────────────────────────────────
  console.log('\nSeeding core values...')
  await supabase.from('core_values').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const coreValues = [
    { icon: '🎯', title: 'Discipline', description: 'We cultivate self-discipline and responsibility in every student.', display_order: 1 },
    { icon: '💎', title: 'Integrity', description: 'Honesty and strong moral character are the foundation of all we do.', display_order: 2 },
    { icon: '⭐', title: 'Excellence', description: 'We pursue the highest standards in academics, character, and leadership.', display_order: 3 },
    { icon: '🤝', title: 'Community', description: 'A strong school community where every family feels welcomed and valued.', display_order: 4 },
  ]

  for (const value of coreValues) {
    const { error } = await supabase.from('core_values').insert(value)
    if (error) console.error(`❌ Core value "${value.title}":`, error.message)
    else console.log(`✅ Core value: ${value.title}`)
  }

  // ── 4. Seed Why Choose Us ───────────────────────────────────────────────
  console.log('\nSeeding why choose us...')
  await supabase.from('why_choose_us_features').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const whyChoose = [
    { icon: '🏫', title: 'World-Class Facilities', description: 'Modern classrooms, science labs, pool, and sports facilities.', display_order: 1 },
    { icon: '👩‍🏫', title: 'Expert Teachers', description: 'Qualified and passionate educators dedicated to every child\'s growth.', display_order: 2 },
    { icon: '🤖', title: 'STEM & Robotics', description: 'Hands-on technology and robotics programs from an early age.', display_order: 3 },
    { icon: '🌍', title: 'Holistic Development', description: 'Academics, arts, sports and character development in balance.', display_order: 4 },
    { icon: '🔒', title: 'Safe Environment', description: 'Secure, monitored campus ensuring every child\'s safety.', display_order: 5 },
    { icon: '🚌', title: 'Transport Services', description: 'Reliable school bus service covering major areas of Abuja.', display_order: 6 },
  ]

  for (const feature of whyChoose) {
    const { error } = await supabase.from('why_choose_us_features').insert(feature)
    if (error) console.error(`❌ Feature "${feature.title}":`, error.message)
    else console.log(`✅ Feature: ${feature.title}`)
  }

  // ── 5. Seed Admission Steps ─────────────────────────────────────────────
  console.log('\nSeeding admission steps...')
  await supabase.from('admission_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const steps = [
    { step_number: 1, title: 'Submit Application', description: 'Complete and submit the online admission form with all required details.' },
    { step_number: 2, title: 'Document Review', description: 'Our admissions team reviews your application and supporting documents.' },
    { step_number: 3, title: 'Assessment', description: 'Schedule an assessment/interview for your child with our academic team.' },
    { step_number: 4, title: 'Admission Offer', description: 'Receive your admission offer letter and confirm your acceptance.' },
    { step_number: 5, title: 'Enrollment', description: 'Complete registration, pay fees, and get your child ready to start!' },
  ]

  for (const step of steps) {
    const { error } = await supabase.from('admission_steps').insert(step)
    if (error) console.error(`❌ Step ${step.step_number}:`, error.message)
    else console.log(`✅ Admission step ${step.step_number}: ${step.title}`)
  }

  console.log('\n🎉 All data fixed and seeded! Refresh the site to see changes.')
}

fixData()
