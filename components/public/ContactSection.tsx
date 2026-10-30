'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactMessage } from '@/lib/actions'
import { cleanWhatsAppNumber, generateWhatsAppLink, formatWhatsAppContactMessage } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types'

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}

export default function ContactSection({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<typeof form | null>(null)

  const schoolWhatsApp = cleanWhatsAppNumber(settings?.whatsapp || '09151556664')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill your name, email and message.')
    setLoading(true)
    try {
      await submitContactMessage(form)
      toast.success('Message sent & recorded!')
      setSubmittedData({ ...form })
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Pre-formatted WhatsApp text for submitted message
  const waSubmittedText = submittedData
    ? formatWhatsAppContactMessage(submittedData)
    : ''
  const waSubmittedUrl = generateWhatsAppLink(schoolWhatsApp, waSubmittedText)

  // Direct general chat link
  const directWaUrl = generateWhatsAppLink(
    schoolWhatsApp,
    'Hello Hamizak Montessori Academy, I would like to make an inquiry.'
  )

  const info = [
    {
      icon: MapPin,
      label: 'Address',
      value: settings?.address ?? 'Behind Police Station Phase 1 ACO Est, Trademore Area, Sabon Lugbe, Abuja',
    },
    {
      icon: Phone,
      label: 'Phone Call',
      value: `${settings?.phone1 ?? '0915 155 6664'}${settings?.phone2 && settings.phone2 !== settings.phone1 ? ` | ${settings.phone2}` : ''}`,
    },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp (Instant)',
      value: `${settings?.whatsapp ?? '0915 155 6664'} (Tap to chat)`,
      isLink: true,
      href: directWaUrl,
      highlight: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: settings?.email ?? 'hamizakmontessoriabuja@gmail.com',
    },
    {
      icon: Clock,
      label: 'Office Hours',
      value: 'Mon – Fri: 7:30am – 3:30pm',
    },
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
            We&apos;d love to hear from you. Reach out for admissions, enquiries, or to schedule a campus tour.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {info.map((item) => {
                const Icon = item.icon
                const content = (
                  <div
                    key={item.label}
                    className={`group p-4 rounded-2xl transition-all duration-300 ${
                      item.highlight
                        ? 'bg-emerald-50/60 border border-emerald-200/60 hover:bg-emerald-100/60'
                        : 'hover:bg-white hover:shadow-lg hover:shadow-slate-200/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                        item.highlight
                          ? 'bg-[#25D366] text-white shadow-emerald-500/30'
                          : 'bg-white border border-slate-100 text-teal-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          item.highlight ? 'text-emerald-700' : 'text-teal-600'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )

                if (item.isLink && item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {content}
                    </a>
                  )
                }

                return content
              })}
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-64 rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
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

          {/* Form Side */}
          {submitted && submittedData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Saved & Logged
                </span>
                <h3 className="font-heading font-black text-2xl text-slate-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{submittedData.name}</strong>! Your inquiry has been safely saved to our portal.
                </p>
              </div>

              {/* Fast WhatsApp Notification Action */}
              <div className="w-full p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-2xl border border-emerald-100 text-left space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span>Get an Instant Response on WhatsApp</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To get the fastest reply right away, you can also forward your message directly to the school administration on WhatsApp:
                </p>
                <a
                  href={waSubmittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20b858] text-white py-3.5 px-5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] text-sm"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Forward Message to School WhatsApp Now</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2"
              >
                ← Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 sm:p-12 flex flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-heading font-black text-2xl text-slate-900 mb-1 tracking-tight">
                    Send a Message
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">
                    We typically respond within a few hours.
                  </p>
                </div>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors border border-emerald-200"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Fast WhatsApp Reply</span>
                </a>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    required
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Fatima Abdullahi"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    required
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">
                    Phone / WhatsApp <span className="text-emerald-600 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. 0801 234 5678"
                  />
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Enquiry about admission"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  className="form-input resize-none"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 shadow-xl shadow-teal-900/20 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="font-bold">Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Or Chat Directly
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20b858] text-white py-3 px-5 rounded-2xl font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] text-sm"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Chat with Admissions on WhatsApp</span>
                </a>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}
