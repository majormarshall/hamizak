import { getEvents } from '@/lib/actions'
import Image from 'next/image'
import NewsGrid from '@/components/public/NewsGrid'

export const revalidate = 60

export const metadata = {
  title: 'Events & News — Hamizak Montessori Academy',
  description: 'Stay updated with the latest events, news, community outreach programs, and announcements from Hamizak Montessori Academy in Sabon Lugbe, Abuja.',
  keywords: ['hamizak school news', 'montessori events abuja', 'school announcements abuja', 'HMA updates', 'community outreach abuja'],
  alternates: { canonical: 'https://hamizak.com.ng/news' },
  openGraph: {
    title: 'Events & News | Hamizak Montessori Academy Abuja',
    description: 'Stories, activities, community outreach, and announcements from our school community.',
    url: 'https://hamizak.com.ng/news',
    images: [{ url: '/images/community-outreach-1.jpg', width: 1200, height: 630, alt: 'Events & News at HMA Abuja' }],
  },
}

export default async function NewsPage() {
  const events = await getEvents(false)

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 scale-110">
          <Image src="/images/school-building-colorful.jpg" alt="" fill className="object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-teal-900/40" />

        <div className="relative z-10">
          <div className="shrink-0 p-1 bg-white/10 rounded-2xl border border-white/20 shadow-2xl inline-block mb-6">
            <Image
              src="/images/hma-logo.jpg"
              alt="HMA"
              width={64}
              height={64}
              className="rounded-xl object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">
            School Bulletin
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            Events &amp; News
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Stories, community outreach, achievements, and upcoming activities from our vibrant learning community.
          </p>
        </div>
      </section>

      {/* Posts List & Filters */}
      <NewsGrid initialEvents={events} />
    </div>
  )
}
