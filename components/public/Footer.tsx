'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { subscribeNewsletter } from '@/lib/actions'
import type { SiteSettings } from '@/types'

const quickLinks = [
  { label: 'About Us',  href: '/about' },
  { label: 'Programs',  href: '/programs' },
  { label: 'Admission', href: '/admission' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Events',    href: '/news' },
  { label: 'Contact',   href: '/contact' },
]

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await subscribeNewsletter(email)
      toast.success('Subscribed! Welcome to the Hamizak family.')
      setEmail('')
    } catch {
      toast.error('Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const socials = [
    { icon: Facebook,  url: settings?.facebook_url },
    { icon: Instagram, url: settings?.instagram_url },
    { icon: Twitter,   url: settings?.twitter_url },
    { icon: Youtube,   url: settings?.youtube_url },
  ].filter(s => s.url)

  return (
    <footer 
      className="text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="shrink-0 p-1 bg-white rounded-2xl shadow-lg ring-1 ring-white/10">
                <Image
                  src={settings?.logo_url || '/images/hma-logo.jpg'}
                  alt="HMA Logo"
                  width={56}
                  height={56}
                  className="rounded-xl object-contain"
                />
              </div>
              <div>
                <p className="font-heading font-black text-lg leading-tight tracking-tight">
                  {settings?.school_name ?? 'Hamizak Montessori'}
                </p>
                <p className="text-teal-400 font-black text-[9px] uppercase tracking-[0.2em] mt-1">
                  Academy
                </p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-medium max-w-sm">
              Nurturing independent learners and confident children since 2010. Where every child blooms through discipline, integrity, and excellence.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socials.map(({ icon: Icon, url }) => (
                  <a key={url} href={url!} target="_blank" rel="noopener noreferrer"
                     className="w-11 h-11 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-8">Navigation</h4>
            <ul className="grid grid-cols-2 gap-4">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500/20 group-hover:bg-teal-500 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-8">Newsletter</h4>
            <p className="text-white/40 text-sm font-medium">
              Join 200+ families receiving our weekly educational updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10
                           text-white placeholder-white/20 text-sm outline-none focus:border-teal-400 transition-colors"
              />
              <button type="submit" disabled={loading}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-widest
                                 px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-teal-900/40">
                {loading ? '...' : 'Join'}
              </button>
            </form>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-white/40 text-xs font-semibold">
                <MapPin className="w-4 h-4 text-teal-500" />
                {settings?.address ?? 'Airport Road, Abuja'}
              </div>
              <div className="flex items-center gap-3 text-white/40 text-xs font-semibold">
                <Phone className="w-4 h-4 text-teal-500" />
                {settings?.phone1}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
            {settings?.footer_copyright ?? '© 2025 Hamizak Montessori Academy. All rights reserved.'}
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
