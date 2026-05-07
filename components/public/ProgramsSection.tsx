'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import type { Program } from '@/types'

const DEFAULT_ICONS: Record<string, string> = {
  'Toddler Community': '🌱',
  "Children's House":  '🌿',
  'Elementary':        '🌳',
}

export default function ProgramsSection({ programs }: { programs: Program[] }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="programs">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Our Curriculum</span>
          <h2 className="section-title">Montessori Learning at Every Stage</h2>
          <p className="section-subtitle mx-auto text-center">
            Carefully crafted programs that honour each child&apos;s natural development timeline
            and nurture a lifelong love of learning.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.id}
              className="card p-8 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {prog.image_url ? (
                <div className="w-full h-48 rounded-[1.5rem] overflow-hidden mb-6 relative shadow-lg">
                  <Image src={prog.image_url} alt={prog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl mb-6 ring-1 ring-teal-100">
                  {prog.icon ?? DEFAULT_ICONS[prog.title] ?? '📚'}
                </div>
              )}

              <h3 className="font-heading font-black text-2xl text-slate-900 mb-2">{prog.title}</h3>
              <p className="text-[10px] font-black text-teal-600 mb-4 tracking-[0.2em] uppercase">{prog.age_range}</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{prog.description}</p>

              {prog.features?.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {prog.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                      <div className="h-5 w-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3 h-3 text-teal-600" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
