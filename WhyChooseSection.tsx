'use client'

import { motion } from 'framer-motion'
import type { WhyChooseFeature, CoreValue } from '@/types'

export function WhyChooseSection({ features }: { features: WhyChooseFeature[] }) {
  if (!features.length) return null
  return (
    <section className="py-24 bg-slate-50/50" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="section-label">Why Hamizak</span>
          <h2 className="section-title">What Sets Us Apart</h2>
          <p className="section-subtitle mx-auto text-center">
            Every decision we make puts your child&apos;s growth, joy, and wellbeing first.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-500 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl mb-6 ring-1 ring-teal-100 group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900 mb-3 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CoreValuesSection({ values }: { values: CoreValue[] }) {
  if (!values.length) return null
  return (
    <section className="py-24 bg-white" id="values">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="section-label">Our Philosophy</span>
          <h2 className="section-title">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.id}
              className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="text-4xl mb-4 grayscale-[0.5] group-hover:grayscale-0 transition-all">{v.icon}</div>
              <h3 className="font-heading font-black text-slate-900 mb-2 tracking-tight text-sm">{v.title}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
