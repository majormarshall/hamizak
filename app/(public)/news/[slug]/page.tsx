import { getEventBySlug, getEvents } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft, Tag, Share2, Sparkles, GraduationCap } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Post Not Found — Hamizak Montessori Academy' }

  return {
    title: `${event.title} — Hamizak Montessori Academy`,
    description: event.excerpt || event.content.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.excerpt || event.content.slice(0, 160),
      url: `https://hamizak.com.ng/news/${event.slug}`,
      images: event.featured_image_url ? [{ url: event.featured_image_url }] : [],
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  const dateStr = event.event_date || event.published_at || event.created_at

  // Split content into paragraphs for clean typography
  const paragraphs = event.content
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <article className="min-h-screen bg-white">
      {/* Article Header */}
      <section 
        className="pt-24 pb-16 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 bg-teal-900/30" />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events &amp; News
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md ${
              event.category === 'event'
                ? 'bg-emerald-500 text-white'
                : event.category === 'announcement'
                ? 'bg-amber-500 text-white'
                : 'bg-teal-600 text-white'
            }`}>
              {event.category}
            </span>

            {dateStr && (
              <span className="flex items-center gap-1.5 text-xs text-white/70 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                {formatDate(dateStr, 'EEEE, dd MMMM yyyy')}
              </span>
            )}
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
            {event.title}
          </h1>

          {event.excerpt && (
            <p className="text-white/70 text-lg sm:text-xl font-medium leading-relaxed max-w-3xl">
              {event.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        {/* Featured Image */}
        {event.featured_image_url && (
          <div className="relative w-full h-80 sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl mb-12 ring-1 ring-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.featured_image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Render */}
        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed sm:text-lg">
          {paragraphs.map((para, idx) => {
            // Check if it's bullet list items
            if (para.includes('\n- ') || para.startsWith('- ')) {
              const lines = para.split('\n').filter(Boolean)
              return (
                <ul key={idx} className="space-y-2.5 my-4 pl-4 list-disc list-inside text-slate-700">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="font-medium">
                      {line.replace(/^-\s*/, '')}
                    </li>
                  ))}
                </ul>
              )
            }

            // Check if it looks like a section heading or emoji header
            if (para.length < 80 && (para.startsWith('🌟') || para.startsWith('📍') || para.startsWith('❤️') || para.startsWith('🤝') || para.startsWith('✨') || para.endsWith(':'))) {
              return (
                <h3 key={idx} className="font-heading font-black text-2xl text-slate-900 pt-4">
                  {para}
                </h3>
              )
            }

            return (
              <p key={idx} className="font-normal whitespace-pre-line leading-relaxed">
                {para}
              </p>
            )
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-16 p-8 bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-400">
              <GraduationCap className="w-4 h-4" />
              Hamizak Montessori Academy
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Experience the HMA Difference
            </h3>
            <p className="text-white/60 text-sm max-w-md">
              Admissions are open for our Creche, Nursery, and Primary school. Schedule a private tour today.
            </p>
          </div>
          <Link
            href="/admission"
            className="btn-primary shrink-0 px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20"
          >
            Apply for Admission &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}
