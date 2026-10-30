'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Download, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitApplication } from '@/lib/actions'
import Link from 'next/link'

// SEO metadata — note: 'use client' pages can't export metadata directly in Next.js
// This page's metadata is handled via the parent layout and head tags
// For full metadata on this page, consider splitting it into a server wrapper + client form component

const STEPS = ['Child Details', 'Parent Info', 'Program & Notes', 'Review']
const PROGRAMS = ['Toddler Community (18mo – 3yrs)', "Children's House (3 – 6yrs)", 'Elementary (6 – 12yrs)']
const HOW_HEARD = ['Word of mouth', 'Google search', 'Social media', 'Friend / family', 'Flyer / poster', 'Other']

const INITIAL = {
  child_name: '', child_age: '', child_dob: '', program_interest: '',
  parent_name: '', parent_email: '', parent_phone: '', address: '',
  how_heard: '', additional_notes: '',
}

export default function AdmissionPage() {
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState(INITIAL)
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof INITIAL, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit() {
    setLoading(true)
    try {
      await submitApplication(form)
      setDone(true)
      toast.success('Application submitted successfully!')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-slate-50/50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-teal-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-teal-900/10"
        >
          <CheckCircle className="w-12 h-12 text-teal-600" />
        </motion.div>
        <h1 className="font-heading font-black text-4xl text-slate-900 mb-4 tracking-tight">Application Received!</h1>
        <p className="text-slate-500 max-w-md mb-10 font-medium text-lg leading-relaxed">
          Thank you, {form.parent_name}! We have received your application for <span className="text-teal-600 font-bold">{form.child_name}</span>.
          Our admissions team will contact you within 2-3 business days.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/2349151556664?text=${encodeURIComponent(`Hello Hamizak Admissions, I just submitted an admission application for ${form.child_name} for the ${form.program_interest} programme. My name is ${form.parent_name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all hover:scale-105"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Notify Admissions on WhatsApp</span>
          </a>
          <Link href="/" className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">Return Home</Link>
          <Link href="/contact" className="btn-primary !px-8 !py-4 shadow-xl shadow-teal-900/20">Contact Us</Link>
        </div>
      </div>
    )
  }

  const Field = ({ label, field, type = 'text', placeholder = '', required = false }: {
    label: string; field: keyof typeof INITIAL; type?: string; placeholder?: string; required?: boolean
  }) => (
    <div>
      <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <input type={type} className="form-input" value={form[field]}
             onChange={e => set(field, e.target.value)} placeholder={placeholder} />
    </div>
  )

  return (
    <div className="py-24 px-4 bg-slate-50/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">Enrollment</span>
          <h1 className="section-title">Admission Application</h1>
          <p className="section-subtitle mx-auto text-center">
            Start your child&apos;s Montessori journey at Hamizak. Our simple process helps us understand your child&apos;s needs.
          </p>
          <button className="mt-8 px-6 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-600 font-bold text-sm flex items-center gap-2 mx-auto hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4 text-teal-500" /> Download School Prospectus
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-12 px-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-500 shadow-lg ${
                i < step ? 'bg-teal-600 text-white shadow-teal-900/20' : i === step ? 'bg-slate-900 text-white' : 'bg-white text-slate-300 border border-slate-100'
              }`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <div className="flex-1 flex flex-col hidden sm:block">
                <span className={`text-[10px] font-black uppercase tracking-widest ${i === step ? 'text-teal-600' : 'text-slate-400'}`}>{STEPS[i]}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-500 ${i < step ? 'bg-teal-600' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 sm:p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="sm:col-span-2">
                    <h3 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Child&apos;s Information</h3>
                    <p className="text-slate-500 text-sm font-medium mb-4">Please provide details about your child as they appear on official documents.</p>
                  </div>
                  <div className="sm:col-span-2"><Field label="Child's Full Name" field="child_name" placeholder="Fatima Yusuf" required /></div>
                  <Field label="Current Age" field="child_age" placeholder="e.g. 4 years" required />
                  <Field label="Date of Birth" field="child_dob" type="date" required />
                </div>
              )}

              {step === 1 && (
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="sm:col-span-2">
                    <h3 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Parent Information</h3>
                    <p className="text-slate-500 text-sm font-medium mb-4">How can we contact you regarding this application?</p>
                  </div>
                  <div className="sm:col-span-2"><Field label="Parent / Guardian Name" field="parent_name" required /></div>
                  <Field label="Email Address" field="parent_email" type="email" required />
                  <Field label="Phone Number" field="parent_phone" required />
                  <div className="sm:col-span-2"><Field label="Residential Address" field="address" /></div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Program Interest</h3>
                    <p className="text-slate-500 text-sm font-medium mb-4">Tell us which program you are interested in and any additional context.</p>
                  </div>
                  <div>
                    <label className="form-label">Program of Interest <span className="text-red-500">*</span></label>
                    <select className="form-input" value={form.program_interest} onChange={e => set('program_interest', e.target.value)}>
                      <option value="">Select a program…</option>
                      {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">How did you hear about us?</label>
                    <select className="form-input" value={form.how_heard} onChange={e => set('how_heard', e.target.value)}>
                      <option value="">Select…</option>
                      {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-input resize-none" rows={4} value={form.additional_notes}
                              onChange={e => set('additional_notes', e.target.value)}
                              placeholder="Any additional information about your child, special needs, questions, etc." />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Final Review</h3>
                    <p className="text-slate-500 text-sm font-medium">Please confirm that all information provided is accurate.</p>
                  </div>
                  <div className="grid gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {[
                      ['Child Name', form.child_name], ['Child Age', form.child_age], ['Date of Birth', form.child_dob],
                      ['Program', form.program_interest], ['Parent Name', form.parent_name],
                      ['Email', form.parent_email], ['Phone', form.parent_phone],
                      ['Address', form.address], ['How Heard', form.how_heard],
                    ].map(([label, value]) => value ? (
                      <div key={label} className="flex bg-white px-6 py-4 gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-32 flex-shrink-0 pt-1">{label}</span>
                        <span className="text-sm text-slate-800 font-bold">{value}</span>
                      </div>
                    ) : null)}
                  </div>
                  {form.additional_notes && (
                    <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-2">Additional Notes</p>
                      <p className="text-sm text-teal-800 font-medium leading-relaxed">{form.additional_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-10 border-t border-slate-100">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm flex items-center gap-2 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary !px-8 !py-3 flex items-center gap-2 shadow-xl shadow-teal-900/10">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary !px-8 !py-3 flex items-center gap-3 shadow-xl shadow-teal-900/20 group">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                <span className="font-bold">Submit Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
