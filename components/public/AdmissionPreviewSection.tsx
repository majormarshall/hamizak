'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import type { AdmissionStep } from '@/types'

export default function AdmissionPreviewSection({ steps }: { steps: AdmissionStep[] }) {
  return (
    <section className="py-24 bg-white" id="admission">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Admissions</span>
            <h2 className="section-title">How to Join Our Community</h2>
            <p className="section-subtitle mb-12">
              Our simple enrolment process is designed to be clear, welcoming, and stress-free.
            </p>
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={step.id} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center
                                  justify-center font-heading font-black shrink-0 text-lg shadow-lg shadow-teal-900/20 group-hover:scale-110 transition-transform duration-300">
                    {step.step_number}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-lg mb-1 tracking-tight">{step.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/admission" className="btn-primary !px-8 !py-4 text-base shadow-xl shadow-teal-900/20 flex items-center gap-2 group">
                Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:bg-slate-50 transition-all">Book a Tour</Link>
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

            <h3 className="font-heading font-black text-2xl text-slate-900 mb-8 tracking-tight">Requirements Checklist</h3>
            <div className="space-y-4">
              {[
                'Child must meet the minimum age for chosen program',
                'Completed online application form',
                'Copy of child\'s birth certificate',
                'Passport photographs (2 copies)',
                'Previous school records (if applicable)',
                'Payment of application/registration fee',
                'Attendance at parent orientation session',
              ].map((item) => (
                <div key={item} className="flex gap-4 group">
                  <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-teal-500 transition-colors shadow-sm mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4 font-medium">Have questions about the process?</p>
              <Link href="/contact" className="text-teal-600 font-black text-sm hover:text-teal-700 flex items-center gap-1.5 transition-colors uppercase tracking-widest">
                Contact Admissions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
