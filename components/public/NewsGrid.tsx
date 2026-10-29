'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ArrowRight, Sparkles, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { EventPost } from '@/types'

interface Props {
  initialEvents: EventPost[]
}

export default function NewsGrid({ initialEvents }: Props) {
  const [filter, setFilter] = useState<'all' | 'event' | 'news' | 'announcement'>('all')

  const filtered = filter === 'all'
    ? initialEvents
    : initialEvents.filter(e => e.category === filter)

  const categories = [
    { key: 'all', label: 'All Posts', count: initialEvents.length },
    { key: 'event', label: 'Events', count: initialEvents.filter(e => e.category === 'event').length },
    { key: 'news', label: 'News', count: initialEvents.filter(e => e.category === 'news').length },
    { key: 'announcement', label: 'Announcements', count: initialEvents.filter(e => e.category === 'announcement').length },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white" id="all-posts">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key as typeof filter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === cat.key
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-800'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-base font-semibold text-slate-600">No posts in this category yet.</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon for new school events and announcements.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, i) => {
              const dateStr = item.event_date || item.published_at || item.created_at
              return (
                <motion.article
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.08 }}
                >
                  {/* Featured Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-teal-900 to-slate-900">
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

                  {/* Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {dateStr && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(dateStr, 'dd MMMM yyyy')}</span>
                        </div>
                      )}
                      <h2 className="font-heading font-black text-xl text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                        <Link href={`/news/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h2>
                      {item.excerpt && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/news/${item.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 group-hover:text-teal-800 transition-colors"
                      >
                        Read Full Story
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        HMA Updates
                      </span>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
