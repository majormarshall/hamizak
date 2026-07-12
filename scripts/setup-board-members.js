// scripts/create-board-members-table.js
// Uses Supabase postgres REST API to create the table directly
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL     = 'https://lshfwfliimepxwymjwrf.supabase.co'
const SUPABASE_SVC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaGZ3ZmxpaW1lcHh3eW1qd3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzODkyNCwiZXhwIjoyMDkyMDE0OTI0fQ.v6GuJ2E2kMxiKEQICvVijs4ImIFYIymCXiPVBewsadk'

const supabase = createClient(SUPABASE_URL, SUPABASE_SVC_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// We call the Supabase pg REST proxy via the /query endpoint (available on the pg REST service)
async function runSQL(sql) {
  // Use the postgres REST endpoint that Supabase exposes for service-role clients
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SVC_KEY,
      'Authorization': `Bearer ${SUPABASE_SVC_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ query: sql }),
  })
  return res
}

const MEMBERS = [
  {
    slug: 'dr-maryam',
    name: 'Chief (Dr.) Maryam Jummai Bello Yasin',
    board_title: 'CHAIR / CHIEF OF BOARD',
    subtitle: '',
    is_chair: true,
    display_order: 0,
    extra_titles: ['Yeye Bashorun of Offa Kingdom','Sarauniyar Makama — Gusau','Sansanmin Bukkuyum — Zamfara State','WSO Educational Award Laureate, Las Vegas (2019)','UN-Nominated Observer, US General Elections 2024','Founder — Passionate Heart Empowerment Foundation'],
    quote: 'Her life remains a shining example of leadership, resilience, and commitment to national development and humanitarian service.',
    bio: `Dr. Maryam Jummai Bello Yasin is a distinguished Nigerian educationist, audit consultant, and seasoned public administrator, widely recognized for her outstanding contributions to governance, leadership, and social development. Born in the early 1960s in Wudil Local Government Area of Kano State, she has built a remarkable career defined by excellence, dedication, and service to humanity.\n\nHer academic journey reflects a strong commitment to knowledge and professional growth. She obtained a Teachers Certificate, followed by a Nigeria Certificate in Education (NCE) in Hausa/English with a minor in Islamic Studies. She further earned a Bachelor's and Master's degrees in Educational Administration and Planning from the University of Jos, and later a Doctor of Philosophy (PhD) in the same field from Ahmadu Bello University, Zaria. In addition, she acquired international certifications, including a Master Class Certificate in Business Management and Leadership and a Doctor of Humanities from institutions in the United Kingdom. She has also undergone extensive professional training in auditing, risk management, leadership, and service delivery across Europe and the United States.\n\nDr. Yasin began her career in the Federal Civil Service in 1984 when she was posted to the Ministry of Defence. She later served at the Federal Character Commission, where she contributed significantly to both the Economic and Financial Committee and the Communications Committee. In 2001, she was transferred to the Petroleum Equalization Fund (Management) Board, now known as the Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA). There, she held several strategic positions, including Deputy Chief Auditor, Head of Inspectorate and Investigations, and Zonal Coordinator overseeing multiple depots. She later coordinated zonal auditors nationwide and ultimately served as Head of the SERVICOM Unit at the corporate headquarters before retiring in 2019 after 35 years of meritorious service.\n\nBeyond her professional career, Dr. Maryam has been actively involved in numerous national and international organizations; she was nominated by the United Nations as an observer for the United States of America general elections, 2024, in Washington DC. Comrade Yasin is a member of the National Working Committee of the New Nigerians People's Party (National Women Leader), she is currently the acting President for Nigerian Women 36+ (Maryam Babangida Foundation), a member of the National Women Leaders Forum for all the 19 Political Parties in Nigeria. She is a Fellow of the Institute of Management Specialists (UK) and a member of several professional bodies, including the Nigerian Institute of Management and the National Association for Educational Administration and Planning. She has also played key roles in advocacy and leadership, serving as a delegate to Nigeria's National Conference and representing West African Women Transport Workers at international forums organized by the International Transport Federation (ITF). She bagged the World Safety Organization (WSO) Educational Award in Tuscany Suites and Casino in Las Vegas, Nevada, United States of America on 7th October, 2019.\n\nDr. Maryam is also a passionate philanthropist and the founder of the Passionate Heart Empowerment Foundation, through which she has impacted the lives of many less privileged individuals by promoting empowerment and social welfare initiatives. She is fondly called Uwar Marayu (Mother of the Less Privileged). Her contributions to public service and humanity have earned her numerous awards and recognitions, including international honors and distinctions as one of Africa's most outstanding public servants.\n\nIn recognition of her influence and service, she holds several prestigious traditional titles, including Yeye Bashorun of Offa Kingdom, Sarauniyar Makama in Gusau, and Sansanmin Bukkuyum in Zamfara State. She is also a recipient of goodwill ambassadorial honors in North America.\n\nA lover of travel, reading, music, fitness and sports, she organizes a yearly volleyball championship as her way of giving back to society by keeping the youths away from social vices. Dr. Maryam is a devoted Muslim, family woman, happily married and blessed with children and grandchildren. Her life remains a shining example of leadership, resilience, and commitment to national development and humanitarian service.`,
    image_url: '',
  },
  {
    slug: 'alh-bello',
    name: 'Alhaji Abdul Hakeem D. Bello',
    board_title: 'DIRECTOR OF FINANCE AND ACCOUNT',
    subtitle: 'Deputy Director Procurement',
    is_chair: false,
    display_order: 1,
    extra_titles: [],
    quote: '',
    bio: `Alhaji Bello Abdul-Hakeem Dan'Azimi (ACIPM, HRPL) is a seasoned Human Resources and Administration professional with over 18 years of progressive leadership experience spanning oil and gas, consulting, and organizational development.\n\nHe currently serves as Head, Human Resources & Administration at Bell Oil & Gas Ltd, where he provides strategic direction for HR & Administrative operations across multiple locations, with responsibility for talent management, employee engagement, learning and development, and industrial relations.\n\nPrior to this, he spent over a decade at Geoplex Drillteq Limited, where he rose through the ranks from Payroll Officer to Manager, Human Resources & Administration. In this role, he played a key part in scaling workforce capacity, developing structured training systems, and supporting complex manpower operations across multiple rigs and international partners.\n\nHe holds an MSc in Treasury Management and a BSc in Accounting from Bayero University, Kano, as well as a Diploma in Personnel Management. He is a certified member of the Chartered Institute of Personnel Management of Nigeria (CIPM) and a Chartered Human Resources Analyst.\n\nHe serves as Deputy Director Procurement and Head Procurement at Hamizak Montessori Academy, where he is passionate about leadership development, human capital growth, and creating environments where people and organizations thrive sustainably.`,
    image_url: '',
  },
  {
    slug: 'hajia-habeebah',
    name: "Hajia Habiba Mu'azu",
    board_title: 'DIRECTOR OF ADMINISTRATION',
    subtitle: '',
    is_chair: false,
    display_order: 2,
    extra_titles: [],
    quote: '',
    bio: `Hajia Habiba Mu'azu is a graduate of Business Administration with Upper Second Class Honours from Bayero University Kano. She obtained her Master's in Treasury Management from the same institution.\n\nShe is a Certified Chartered Chief Procurement Officer, an interior decorator, a union treasurer, and a serial administrator. She also serves as Director of Administration at Hamizak Montessori Academy, Abuja, Nigeria, bringing structured governance, financial discipline, and operational excellence to every role she undertakes.`,
    image_url: '',
  },
  {
    slug: 'amina-ladidi',
    name: 'Mrs. Amina Ladidi Suleiman',
    board_title: 'DIRECTOR',
    subtitle: '',
    is_chair: false,
    display_order: 3,
    extra_titles: [],
    quote: '',
    bio: `Mrs. Amina Ladidi Suleiman is a distinguished entrepreneur, business leader, and advocate for women's economic empowerment and enterprise development. With over a decade of experience in business leadership, operations, and strategic management, she has built successful brands while championing local content, innovation, and sustainable development.\n\nShe holds a Bachelor of Science in Computer Science from Kano University of Science and Technology, Wudil, and a Certificate in Business and Entrepreneurship Management from Richland College, Dallas, Texas, USA.\n\nMrs. Amina Ladidi is the Founder and Chief Executive Officer of MINALADI Nigeria, a premium fashion brand renowned for bespoke and ready-to-wear collections that celebrate modesty, elegance, and African heritage. She also leads MINALADI Enterprises, producers of quality Nigerian spices and food products, including the widely acclaimed Lekki Yaji, made with over 80% locally sourced ingredients.\n\nShe currently serves as Director of Hamizak Montessori Academy, Abuja, where she is committed to promoting excellence in education, character development, and leadership among young learners.\n\nKey Achievements: Appointed ECOWAS Small Business Coalition (ESBC) Ambassador for Fashion in Nigeria; successfully built and expanded MINALADI Nigeria into a recognized luxury fashion brand with international presence; led MINALADI Foods in producing premium Nigerian spices while promoting local sourcing and value addition; represented Nigeria at prestigious local and international exhibitions across Africa; and mentored aspiring entrepreneurs, particularly women and young people.`,
    image_url: '',
  },
  {
    slug: 'zainab-okunola',
    name: 'Mrs. Zainab Balaraba Okunola',
    board_title: 'DIRECTOR',
    subtitle: '',
    is_chair: false,
    display_order: 4,
    extra_titles: [],
    quote: '',
    bio: `Zainab Okunola is a Nigerian entrepreneur, business strategist, and the visionary founder of Khaltenscent, one of Nigeria's leading fragrance companies specializing in premium perfume oils, luxury perfumes, and scent solutions. Based in Lagos, Nigeria, she has built a respected brand known for quality, innovation, and excellence within the fragrance industry.\n\nShe studied Entrepreneurship and Business Management, earned a Master of Business Administration (MBA) from the National Open University of Nigeria, and holds a Postgraduate Diploma in Education (PGDE) from Ignatius Ajuru University of Education.\n\nAs the founder of Khaltenscent, Zainab has positioned the company as a trusted supplier of premium fragrance oils, luxury perfumes, fragrance raw materials, diffuser fragrances, and scent marketing solutions. The company serves both retail and wholesale customers and has established operations in Lagos, Kano, and Port Harcourt. Khaltenscent is also the exclusive Nigerian distributor of Maryaj Perfumes and Astana Millano, while representing Argeville, a renowned French fragrance manufacturer, in Nigeria.\n\nBeyond the fragrance business, Zainab is deeply committed to entrepreneurship development and women's economic empowerment. She is passionate about building strategic partnerships, mentoring aspiring entrepreneurs, and creating opportunities for women through business networking, collaboration, and capacity-building initiatives.\n\nA dedicated wife, mother, and accomplished business leader, Zainab continues to inspire others through her vision, resilience, and commitment to redefining African luxury, one fragrance at a time.`,
    image_url: '',
  },
]

async function main() {
  console.log('🚀 Creating board_members table via INSERT approach...\n')

  // Try inserting first record to check if table exists
  const { error: checkErr } = await supabase.from('board_members').select('slug').limit(1)
  
  if (checkErr && checkErr.message.includes('schema cache')) {
    console.log('❌ Table does not exist yet.')
    console.log('\n👉 Please run this SQL in the Supabase SQL Editor at:')
    console.log('   https://supabase.com/dashboard/project/lshfwfliimepxwymjwrf/sql/new\n')
    console.log(`CREATE TABLE IF NOT EXISTS board_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  board_title   TEXT NOT NULL DEFAULT '',
  subtitle      TEXT NOT NULL DEFAULT '',
  bio           TEXT NOT NULL DEFAULT '',
  is_chair      BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  extra_titles  TEXT[] NOT NULL DEFAULT '{}',
  quote         TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bm_public_read"   ON board_members FOR SELECT USING (true);
CREATE POLICY "bm_service_write" ON board_members FOR ALL USING (true) WITH CHECK (true);`)
    process.exit(1)
  }

  console.log('✅ Table exists. Seeding members...\n')

  for (const member of MEMBERS) {
    const { error } = await supabase
      .from('board_members')
      .upsert({ ...member, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
    if (error) console.error(`  ❌ ${member.name}:`, error.message)
    else       console.log(`  ✅ ${member.name}${member.subtitle ? ' [' + member.subtitle + ']' : ''}`)
  }

  const { data } = await supabase.from('board_members').select('name,subtitle,is_chair').order('display_order')
  console.log('\n📋 Seeded members:')
  data?.forEach(r => console.log(`  • ${r.name}${r.is_chair ? ' ⭐' : ''}${r.subtitle ? ' — ' + r.subtitle : ''}`))
  console.log('\n🎉 Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
