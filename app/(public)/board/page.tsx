import Image from 'next/image'

export const metadata = {
  title: 'Meet the Board of Directors — Hamizak Montessori Academy',
  description:
    'Meet the distinguished Board of Directors of Hamizak Montessori Academy, led by Chief (Dr.) Maryam Jummai Bello Yasin — visionary leaders committed to excellence in education.',
  keywords: [
    'hamizak board of directors',
    'dr maryam jummai bello yasin',
    'hamizak montessori leadership',
    'hamizak abuja board',
  ],
  alternates: { canonical: 'https://hamizak.com.ng/board' },
  openGraph: {
    title: 'Board of Directors — Hamizak Montessori Academy',
    description:
      'Distinguished leaders guiding Hamizak Montessori Academy with excellence, integrity, and vision.',
    url: 'https://hamizak.com.ng/board',
    images: [
      {
        url: '/images/hma-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Hamizak Montessori Academy Board of Directors',
      },
    ],
  },
}

/* ─────────────────────────────────────────────
   Board data
───────────────────────────────────────────── */
const CHAIR = {
  name: 'Chief (Dr.) Maryam Jummai Bello Yasin',
  title: 'CHAIR / CHIEF OF BOARD',
  image: '/images/board/dr-maryam.jpg',
  citation: `Dr. Maryam Jummai Bello Yasin is a distinguished Nigerian educationist, audit consultant, and seasoned public administrator, widely recognized for her outstanding contributions to governance, leadership, and social development. Born in the early 1960s in Wudil Local Government Area of Kano State, she has built a remarkable career defined by excellence, dedication, and service to humanity.

Her academic journey reflects a strong commitment to knowledge and professional growth. She obtained a Teachers Certificate, followed by a Nigeria Certificate in Education (NCE) in Hausa/English with a minor in Islamic Studies. She further earned a Bachelor's and Master's degrees in Educational Administration and Planning from the University of Jos, and later a Doctor of Philosophy (PhD) in the same field from Ahmadu Bello University, Zaria. In addition, she acquired international certifications, including a Master Class Certificate in Business Management and Leadership and a Doctor of Humanities from institutions in the United Kingdom. She has also undergone extensive professional training in auditing, risk management, leadership, and service delivery across Europe and the United States.

Dr. Yasin began her career in the Federal Civil Service in 1984 when she was posted to the Ministry of Defence. She later served at the Federal Character Commission, where she contributed significantly to both the Economic and Financial Committee and the Communications Committee. In 2001, she was transferred to the Petroleum Equalization Fund (Management) Board, now known as the Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA). There, she held several strategic positions, including Deputy Chief Auditor, Head of Inspectorate and Investigations, and Zonal Coordinator overseeing multiple depots. She later coordinated zonal auditors nationwide and ultimately served as Head of the SERVICOM Unit at the corporate headquarters before retiring in 2019 after 35 years of meritorious service.

Beyond her professional career, Dr. Maryam has been actively involved in numerous national and international organizations; she was nominated by the United Nations as an observer for the United States of America general elections, 2024, in Washington DC. Comrade Yasin is a member of the National Working Committee of the New Nigerians People's Party (National Women Leader), she is currently the acting President for Nigerian Women 36+ (Maryam Babangida Foundation), a member of the National Women Leaders Forum for all the 19 Political Parties in Nigeria. She is a Fellow of the Institute of Management Specialists (UK) and a member of several professional bodies, including the Nigerian Institute of Management and the National Association for Educational Administration and Planning. She has also played key roles in advocacy and leadership, serving as a delegate to Nigeria's National Conference and representing West African Women Transport Workers at international forums organized by the International Transport Federation (ITF). She bagged the World Safety Organization (WSO) Educational Award in Tuscany Suites and Casino in Las Vegas, Nevada, United States of America on 7th October, 2019.

Dr. Maryam is also a passionate philanthropist and the founder of the Passionate Heart Empowerment Foundation, through which she has impacted the lives of many less privileged individuals by promoting empowerment and social welfare initiatives. She is fondly called Uwar Marayu (Mother of the Less Privileged). Her contributions to public service and humanity have earned her numerous awards and recognitions, including international honors and distinctions as one of Africa's most outstanding public servants.

In recognition of her influence and service, she holds several prestigious traditional titles, including Yeye Bashorun of Offa Kingdom, Sarauniyar Makama in Gusau, and Sansanmin Bukkuyum in Zamfara State. She is also a recipient of goodwill ambassadorial honors in North America.

A lover of travel, reading, music, fitness and sports, she organizes a yearly volleyball championship as her way of giving back to society by keeping the youths away from social vices. Dr. Maryam is a devoted Muslim, family woman, happily married and blessed with children and grandchildren. Her life remains a shining example of leadership, resilience, and commitment to national development and humanitarian service.`,
  titles: [
    'Yeye Bashorun of Offa Kingdom',
    'Sarauniyar Makama — Gusau',
    'Sansanmin Bukkuyum — Zamfara State',
    'WSO Educational Award Laureate, Las Vegas (2019)',
    'UN-Nominated Observer, US General Elections 2024',
    'Founder — Passionate Heart Empowerment Foundation',
  ],
}

const DIRECTORS = [
  {
    id: 1,
    name: 'Alhaji Abdul Hakeem D. Bello',
    title: 'DIRECTOR OF FINANCE AND ACCOUNT',
    image: '/images/board/alh-bello.jpg',
    bio: `Alhaji Bello Abdul-Hakeem Dan'Azimi (ACIPM, HRPL) is a seasoned Human Resources and Administration professional with over 18 years of progressive leadership experience spanning oil and gas, consulting, and organizational development.

He currently serves as Head, Human Resources & Administration at Bell Oil & Gas Ltd, where he provides strategic direction for HR & Administrative operations across multiple locations, with responsibility for talent management, employee engagement, learning and development, and industrial relations.

Prior to this, he spent over a decade at Geoplex Drillteq Limited, where he rose through the ranks from Payroll Officer to Manager, Human Resources & Administration. In this role, he played a key part in scaling workforce capacity, developing structured training systems, and supporting complex manpower operations across multiple rigs and international partners.

He holds an MSc in Treasury Management and a BSc in Accounting from Bayero University, Kano, as well as a Diploma in Personnel Management. He is a certified member of the Chartered Institute of Personnel Management of Nigeria (CIPM) and a Chartered Human Resources Analyst.

He serves as Deputy Director Procurement and Head Procurement at Hamizak Montessori Academy, where he is passionate about leadership development, human capital growth, and creating environments where people and organizations thrive sustainably.`,
  },
  {
    id: 2,
    name: 'Hajia Habeebah Mu\'azu',
    title: 'DIRECTOR OF ADMINISTRATION',
    image: '/images/board/hajia-habeebah.jpg',
    bio: `Hajia Habbiba Bello Mu'azu is a graduate of Business Administration with Upper Second Class Honours from Bayero University Kano. She obtained her Master's in Treasury Management from the same institution.

She is a Certified Chartered Chief Procurement Officer, an interior decorator, a union treasurer, and a serial administrator. She also serves as Director of Administration at Hamizak Montessori Academy, Abuja, Nigeria, bringing structured governance, financial discipline, and operational excellence to every role she undertakes.`,
  },
  {
    id: 3,
    name: 'Mrs. Amina Ladidi Suleiman',
    title: 'DIRECTOR',
    image: '/images/board/amina-ladidi.jpg',
    bio: `Mrs. Amina Ladidi Suleiman is a distinguished entrepreneur, business leader, and advocate for women's economic empowerment and enterprise development. With over a decade of experience in business leadership, operations, and strategic management, she has built successful brands while championing local content, innovation, and sustainable development.

She holds a Bachelor of Science in Computer Science from Kano University of Science and Technology, Wudil, and a Certificate in Business and Entrepreneurship Management from Richland College, Dallas, Texas, USA.

Mrs. Amina Ladidi is the Founder and Chief Executive Officer of MINALADI Nigeria, a premium fashion brand renowned for bespoke and ready-to-wear collections that celebrate modesty, elegance, and African heritage. She also leads MINALADI Enterprises, producers of quality Nigerian spices and food products, including the widely acclaimed Lekki Yaji, made with over 80% locally sourced ingredients.

She currently serves as Director of Hamizak Montessori Academy, Abuja, where she is committed to promoting excellence in education, character development, and leadership among young learners.

Key Achievements: Appointed ECOWAS Small Business Coalition (ESBC) Ambassador for Fashion in Nigeria; successfully built and expanded MINALADI Nigeria into a recognized luxury fashion brand with international presence; led MINALADI Foods in producing premium Nigerian spices while promoting local sourcing and value addition; represented Nigeria at prestigious local and international exhibitions across Africa; and mentored aspiring entrepreneurs, particularly women and young people.`,
  },
  {
    id: 4,
    name: 'Mrs. Zainab Balaraba Okunola',
    title: 'DIRECTOR',
    image: '/images/board/zainab-okunola.jpg',
    bio: `Zainab Okunola is a Nigerian entrepreneur, business strategist, and the visionary founder of Khaltenscent, one of Nigeria's leading fragrance companies specializing in premium perfume oils, luxury perfumes, and scent solutions. Based in Lagos, Nigeria, she has built a respected brand known for quality, innovation, and excellence within the fragrance industry.

She studied Entrepreneurship and Business Management, earned a Master of Business Administration (MBA) from the National Open University of Nigeria, and holds a Postgraduate Diploma in Education (PGDE) from Ignatius Ajuru University of Education.

As the founder of Khaltenscent, Zainab has positioned the company as a trusted supplier of premium fragrance oils, luxury perfumes, fragrance raw materials, diffuser fragrances, and scent marketing solutions. The company serves both retail and wholesale customers and has established operations in Lagos, Kano, and Port Harcourt. Khaltenscent is also the exclusive Nigerian distributor of Maryaj Perfumes and Astana Millano, while representing Argeville, a renowned French fragrance manufacturer, in Nigeria.

Beyond the fragrance business, Zainab is deeply committed to entrepreneurship development and women's economic empowerment. She is passionate about building strategic partnerships, mentoring aspiring entrepreneurs, and creating opportunities for women through business networking, collaboration, and capacity-building initiatives.

A dedicated wife, mother, and accomplished business leader, Zainab continues to inspire others through her vision, resilience, and commitment to redefining African luxury, one fragrance at a time.`,
  },
]

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function BoardImage({
  src,
  alt,
  size = 'md',
}: {
  src: string
  alt: string
  size?: 'lg' | 'md'
}) {
  const dim = size === 'lg' ? 'w-52 h-52 sm:w-64 sm:h-64' : 'w-36 h-36 sm:w-44 sm:h-44'
  return (
    <div
      className={`relative ${dim} rounded-3xl overflow-hidden mx-auto ring-4 ring-white shadow-2xl`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        onError={(e) => {
          // fallback handled by next/image — keep placeholder visible
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}

function Initials({ name, size = 'md' }: { name: string; size?: 'lg' | 'md' }) {
  const letters = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const dim = size === 'lg' ? 'w-52 h-52 sm:w-64 sm:h-64 text-5xl' : 'w-36 h-36 sm:w-44 sm:h-44 text-3xl'
  return (
    <div
      className={`${dim} rounded-3xl mx-auto bg-gradient-to-br from-teal-700 to-emerald-900 flex items-center justify-center font-heading font-black text-white ring-4 ring-white shadow-2xl`}
    >
      {letters}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function BoardPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section
        className="relative py-28 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-[10px] font-black text-teal-400 tracking-[0.25em] uppercase mb-5 bg-teal-400/10 px-4 py-1.5 rounded-full border border-teal-400/20">
            Hamizak Montessori Academy
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 leading-tight tracking-tight">
            Meet the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Board of Directors
            </span>
          </h1>
          <p className="text-white/60 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Distinguished leaders united by a shared commitment to excellence, integrity, and
            the transformative power of Montessori education.
          </p>
        </div>

        {/* wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 48L1440 48L1440 12C1200 48 960 0 720 12C480 24 240 0 0 12L0 48Z" fill="white" />
        </svg>
      </section>

      {/* ── CHAIR CITATION ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-teal-600 tracking-[0.25em] uppercase mb-3 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
              Citation of Chief
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Chair of the Board
            </h2>
          </div>

          {/* Chair card */}
          <div className="relative bg-gradient-to-br from-teal-950 to-emerald-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Decorative rings */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-teal-500/10 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-teal-500/10 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none" />

            {/* Gold top accent */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

            <div className="p-8 sm:p-12 lg:p-16">
              <div className="grid lg:grid-cols-[auto_1fr] gap-12 items-start">
                {/* Photo column */}
                <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8">
                  <div className="relative">
                    <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-[2rem] overflow-hidden ring-4 ring-amber-400/40 shadow-2xl shadow-black/40 relative">
                      <Image
                        src={CHAIR.image}
                        alt={CHAIR.name}
                        fill
                        sizes="(max-width: 640px) 224px, 288px"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    {/* Gold badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ★ Chair of the Board ★
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="font-heading font-black text-white text-xl sm:text-2xl leading-tight mb-1">
                      {CHAIR.name}
                    </h3>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">
                      {CHAIR.title}
                    </p>
                  </div>

                  {/* Titles list */}
                  <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                    <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3">
                      Honours &amp; Titles
                    </p>
                    {CHAIR.titles.map((t) => (
                      <div key={t} className="flex items-start gap-2.5">
                        <span className="text-amber-400 mt-0.5 shrink-0">✦</span>
                        <span className="text-white/70 text-xs font-medium leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio column */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest whitespace-nowrap">
                      Full Citation
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-amber-400/40 to-transparent" />
                  </div>

                  <div className="space-y-5">
                    {CHAIR.citation.split('\n\n').map((para, i) => (
                      <p
                        key={i}
                        className="text-white/75 leading-[1.9] font-medium text-[15px] sm:text-base"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Quote highlight */}
                  <div className="mt-10 border-l-4 border-amber-400 pl-6 py-2">
                    <p className="text-white/90 italic text-lg font-medium leading-relaxed">
                      &ldquo;Her life remains a shining example of leadership, resilience, and
                      commitment to national development and humanitarian service.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white px-4">
            Board of Directors Cont'd
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </div>

      {/* ── DIRECTORS GRID ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-teal-600 tracking-[0.25em] uppercase mb-3 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
              Leadership Team
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Our Distinguished Directors
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl mx-auto">
              Each director brings deep expertise, passion, and a shared vision for transformative
              education.
            </p>
          </div>

          <div className="space-y-12">
            {DIRECTORS.map((director, idx) => (
              <article
                key={director.id}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/60 overflow-hidden hover:shadow-2xl hover:shadow-teal-100/40 transition-all duration-500"
              >
                <div
                  className={`grid ${idx % 2 === 0 ? 'lg:grid-cols-[320px_1fr]' : 'lg:grid-cols-[1fr_320px]'} items-stretch`}
                >
                  {/* Photo panel — alternate left/right */}
                  <div
                    className={`relative bg-gradient-to-br from-teal-900 to-emerald-950 flex flex-col items-center justify-center py-12 px-8 gap-6 ${
                      idx % 2 !== 0 ? 'lg:order-last' : ''
                    }`}
                  >
                    {/* Decorative blob */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[1.75rem] overflow-hidden ring-4 ring-white/20 shadow-2xl group-hover:ring-amber-400/30 transition-all duration-500">
                        <Image
                          src={director.image}
                          alt={director.name}
                          fill
                          sizes="(max-width: 640px) 176px, 208px"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <h3 className="font-heading font-black text-white text-lg sm:text-xl leading-tight mb-2">
                        {director.name}
                      </h3>
                      <span className="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {director.title}
                      </span>
                    </div>
                  </div>

                  {/* Bio panel */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <span className="text-teal-600 font-black font-heading text-sm">0{director.id}</span>
                      </div>
                      <div>
                        <p className="font-heading font-black text-slate-900 text-lg leading-tight">
                          {director.name}
                        </p>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          {director.title}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {director.bio.split('\n\n').map((para, i) => (
                        <p key={i} className="text-slate-500 text-sm sm:text-base leading-[1.85] font-medium">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-[2.5rem] p-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0b2a22 0%, #134e3a 50%, #041510 100%)' }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-400 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-400 blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.25em] mb-4">
                Join Our Community
              </p>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4 tracking-tight">
                Guided by Vision, Driven by Purpose
              </h2>
              <p className="text-white/60 font-medium mb-8 max-w-lg mx-auto">
                Our Board of Directors ensures that every decision at Hamizak Montessori Academy is
                rooted in excellence, integrity, and the best interest of our children.
              </p>
              <a
                href="/admission"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-teal-900/40 transition-all duration-300 hover:scale-105"
              >
                Apply for Admission
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
