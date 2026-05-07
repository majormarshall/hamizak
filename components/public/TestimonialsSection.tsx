'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import type { Testimonial } from '@/types'

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [idx, setIdx] = useState(0)

  if (!testimonials.length) return null

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx((i) => (i + 1) % testimonials.length)

  const t = testimonials[idx]

  return (
    <section 
      className="py-24 relative overflow-hidden" 
      id="testimonials"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      {/* Decorative glass blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">
            Parent Voices
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
            Trusted by Families
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl relative"
          >
            {/* Quote icon accent */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-500/40">
              <Star className="w-6 h-6 fill-white" />
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1.5 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'fill-teal-400 text-teal-400' : 'text-white/10'}`} />
              ))}
            </div>

            <blockquote className="text-white/90 text-xl sm:text-2xl lg:text-3xl leading-relaxed mb-10 font-medium italic tracking-tight">
              &ldquo;{t.testimonial_text}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              {t.photo_url ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative ring-2 ring-white/10 shadow-lg">
                  <Image src={t.photo_url} alt={t.parent_name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center
                                font-heading font-black text-teal-400 text-lg">
                  {t.parent_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="font-heading font-black text-white text-base tracking-tight leading-none">{t.parent_name}</p>
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mt-1.5">{t.child_program}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={prev} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-teal-500 hover:text-white border border-white/10 flex items-center justify-center text-white/50 transition-all duration-300 shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === idx ? 'bg-teal-400 w-8' : 'bg-white/10 w-2 hover:bg-white/30'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-teal-500 hover:text-white border border-white/10 flex items-center justify-center text-white/50 transition-all duration-300 shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
