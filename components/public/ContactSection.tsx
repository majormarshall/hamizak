'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactMessage } from '@/lib/actions'
import type { SiteSettings } from '@/types'

export default function ContactSection({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      await submitContactMessage(form)
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const info = [
    { icon: MapPin, label: 'Address', value: settings?.address ?? 'Plot A.H.E 26111, Sabon Lugbe, AMAC Estate, Airport Road, Abuja' },
    { icon: Phone,  label: 'Phone',   value: `${settings?.phone1 ?? '08032253811'} | ${settings?.phone2 ?? '08062418351'}` },
    { icon: Mail,   label: 'Email',   value: settings?.email ?? 'info@hamizakmontessori.edu.ng' },
    { icon: Clock,  label: 'Hours',   value: 'Mon – Fri: 7:30am – 3:30pm' },
  ]

  return (
    <section className="py-24 bg-slate-50/50" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Connect</span>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle mx-auto text-center">
            We&apos;d love to hear from you. Reach out to schedule a visit or ask any questions about our curriculum.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="grid sm:grid-cols-2 gap-8">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-slate-600 text-sm font-semibold leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="w-full h-64 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-teal-500/5 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-8 h-8 text-teal-500" />
                </div>
                <div className="text-center px-6">
                  <p className="text-slate-900 font-black tracking-tight text-lg">Airport Road, Abuja</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Visit Our Campus</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 p-10 sm:p-12 flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Send a Message</h3>
              <p className="text-slate-500 text-sm font-medium">Expected response time: within 24 hours</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Fatima Abdullahi" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" />
              </div>
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input className="form-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Enquiry about admission" />
            </div>

            <div>
              <label className="form-label">Your Message</label>
              <textarea
                rows={4}
                className="form-input resize-none"
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary !py-4 flex items-center justify-center gap-3 mt-2 shadow-xl shadow-teal-900/20 group">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <>
                  <span className="font-bold">Send Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
