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

            {/* Google Maps Embed */}
            <div className="w-full h-72 rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
              <iframe
                title="Hamizak Montessori Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4!2d7.2631!3d9.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0d4b3c4a1111%3A0x0!2sSabon+Lugbe%2C+Airport+Road%2C+Abuja%2C+Nigeria!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng&q=Sabon+Lugbe+AMAC+Estate+Airport+Road+Abuja+Nigeria"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              {/* Overlay link to open full Google Maps */}
              <a
                href="https://www.google.com/maps/search/Sabon+Lugbe+AMAC+Estate+Airport+Road+Abuja+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-teal-100 hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5" />
                Open in Maps
              </a>
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
