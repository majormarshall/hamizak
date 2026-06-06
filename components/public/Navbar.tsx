'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteSettings } from '@/types'

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'About Us',  href: '/about' },
  { label: 'Programs',  href: '/programs' },
  { label: 'Admission', href: '/admission' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Contact',   href: '/contact' },
]

export default function Navbar({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [desktopPortalsOpen, setDesktopPortalsOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src={settings?.logo_url || '/images/hma-logo.jpg'}
            alt={settings?.school_name ?? 'Hamizak Montessori Academy'}
            width={48}
            height={48}
            className="rounded-xl object-contain"
          />
          <div>
            <p className="font-heading font-extrabold text-slate-900 text-sm leading-tight">
              {settings?.school_name ?? 'Hamizak Montessori Academy'}
            </p>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-tight hidden sm:block mt-0.5">
              Discipline · Integrity · Excellence
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600
                           hover:bg-teal-50 px-3.5 py-2 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li 
            className="relative"
            onMouseEnter={() => setDesktopPortalsOpen(true)}
            onMouseLeave={() => setDesktopPortalsOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 px-3.5 py-2 rounded-xl transition-all"
            >
              <span>Portals</span>
              <ChevronDown className="w-4 h-4 text-slate-400 transition-colors" />
            </button>
            
            {desktopPortalsOpen && (
              <div 
                className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50"
              >
                <a
                  href="https://admin.hamizakma.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Admin Portal
                </a>
                <a
                  href="https://staff.hamizakma.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Staff Portal
                </a>
                <a
                  href="https://hamizakma.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Student Portal
                </a>
              </div>
            )}
          </li>
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/admission" className="btn-primary text-xs hidden sm:inline-flex shadow-teal-100">
            Apply Now
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-green-100 overflow-hidden"
          >
            <ul className="px-4 py-4 flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-sm font-semibold text-slate-700 hover:text-teal-600
                               hover:bg-teal-50 px-3 py-3 rounded-xl transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-slate-50 pt-2 mt-2">
                <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portals</p>
                <div className="flex flex-col gap-1">
                  <a
                    href="https://admin.hamizakma.com.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50 px-3 py-2.5 rounded-xl transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Admin Portal
                  </a>
                  <a
                    href="https://staff.hamizakma.com.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50 px-3 py-2.5 rounded-xl transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Staff Portal
                  </a>
                  <a
                    href="https://hamizakma.com.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50 px-3 py-2.5 rounded-xl transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Student Portal
                  </a>
                </div>
              </li>
              <li className="pt-2">
                <Link href="/admission" onClick={() => setOpen(false)} className="btn-primary w-full text-center block py-3">
                  Apply Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
