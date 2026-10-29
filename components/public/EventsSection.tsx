'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { EventPost } from '@/types'

export default function EventsSection({ events }: { events: EventPost[] }) {
  if (!events || events.length === 0) return null

  // Show up to 3 most recent events on the homepage
  const displayed = events.slice(0, 3)

  return (
    <section className="py-24 bg-slate-50/70 border-y border-slate-100" id="news">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="section-label">HMA Updates</span>
          <h2 className="section-title">Events &amp; News</h2>
          <p className="section-subtitle mx-auto text-center">
            Discover our latest outreach programs, school events, and community updates.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map((item, i) => {
            const dateStr = item.event_date || item.published_at || item.created_at
            return (
              <motion.article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Image / Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-teal-900 to-slate-900">
                  {item.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-teal-400 p-6 text-center">
                      <Sparkles className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-xs font-black uppercase tracking-widest text-white/50">Hamizak Montessori</p>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                      item.category === 'event'
                        ? 'bg-emerald-500/90 text-white'
                        : item.category === 'announcement'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-teal-600/90 text-white'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {dateStr && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(dateStr, 'dd MMMM yyyy')}</span>
                      </div>
                    )}
                    <h3 className="font-heading font-black text-xl text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                      <Link href={`/news/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    {item.excerpt && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                        {item.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 group-hover:text-teal-800 transition-colors"
                    >
                      Read Full Story
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-900/10 hover:shadow-teal-900/20"
          >
            <span>View All News &amp; Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
