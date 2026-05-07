'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { StaffMember } from '@/types'

export default function TeamSection({ staff }: { staff: StaffMember[] }) {
  if (!staff.length) return null
  return (
    <section className="py-24 bg-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="section-label">Our People</span>
          <h2 className="section-title">Dedicated Educators</h2>
          <p className="section-subtitle mx-auto text-center">
            Trained, certified, and passionate about guiding your child&apos;s journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {staff.map((m, i) => (
            <motion.div
              key={m.id}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative inline-block mb-6">
                {m.photo_url ? (
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden mx-auto
                                  ring-4 ring-slate-50 group-hover:ring-teal-100 transition-all duration-500 shadow-xl shadow-slate-200/50">
                    <Image src={m.photo_url} alt={m.name} fill className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-[2rem] bg-teal-50 flex items-center justify-center
                                  mx-auto font-heading font-black text-3xl text-teal-700
                                  ring-4 ring-slate-50 group-hover:ring-teal-100 transition-all duration-500 shadow-xl shadow-slate-200/50">
                    {m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                {/* Decorative accent */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] font-black">HMA</span>
                </div>
              </div>
              
              <h3 className="font-heading font-black text-slate-900 text-lg tracking-tight mb-1">{m.name}</h3>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">{m.role}</p>
              {m.bio && <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3 px-4">{m.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
