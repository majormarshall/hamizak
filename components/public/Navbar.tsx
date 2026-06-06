'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Lock, Shield, Users, GraduationCap } from 'lucide-react'
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

const PORTALS = [
  {
    label: 'Admin Portal',
    description: 'School management & admin tools',
    href: '/admin',
    icon: Shield,
    dot: 'bg-red-400',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    label: 'Staff Portal',
    description: 'Staff dashboard & resources',
    href: 'https://staff.hamizakma.com.ng',
    icon: Users,
    dot: 'bg-blue-400',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    external: true,
  },
  {
    label: 'Student Portal',
    description: 'Student records & learning',
    href: 'https://hamizakma.com.ng',
    icon: GraduationCap,
    dot: 'bg-emerald-400',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    external: true,
  },
]

export default function Navbar({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen]               = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [portalsOpen, setPortalsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPortalsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
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
        </ul>

        {/* CTA + Portals + Hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/admission" className="btn-primary text-xs hidden sm:inline-flex shadow-teal-100">
            Apply Now
          </Link>

          {/* ── Beautiful Portals Dropdown ── */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            <button
              onClick={() => setPortalsOpen(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 shadow-sm border
                ${portalsOpen
                  ? 'bg-teal-600 text-white border-teal-600 shadow-teal-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:text-teal-700 hover:shadow-teal-100'
                }`}
            >
              <Lock className={`w-3.5 h-3.5 ${portalsOpen ? 'text-white' : 'text-teal-600'}`} />
              <span>Portals</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${portalsOpen ? 'rotate-180 text-white' : 'text-slate-400'}`}
              />
            </button>

            <AnimatePresence>
              {portalsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl
                             rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100
                             overflow-hidden z-50"
                >
                  {/* Dropdown header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-teal-600 to-emerald-600">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-white/80" />
                      <p className="text-xs font-black text-white uppercase tracking-widest">Access Portals</p>
                    </div>
                    <p className="text-[11px] text-white/60 font-medium">Select your portal to continue</p>
                  </div>

                  {/* Portal items */}
                  <div className="p-2">
                    {PORTALS.map((portal) => {
                      const Icon = portal.icon
                      const linkProps = portal.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {}
                      return (
                        <a
                          key={portal.label}
                          href={portal.href}
                          {...linkProps}
                          onClick={() => setPortalsOpen(false)}
                          className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl
                                     hover:bg-slate-50 transition-all duration-150 group"
                        >
                          <div className={`w-9 h-9 rounded-xl ${portal.iconBg} flex items-center justify-center shrink-0
                                          group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className={`w-4.5 h-4.5 ${portal.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 leading-tight">{portal.label}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{portal.description}</p>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${portal.dot} shrink-0`} />
                        </a>
                      )
                    })}
                  </div>

                  {/* Footer divider */}
                  <div className="mx-4 border-t border-slate-50 pb-3 pt-2 px-1">
                    <p className="text-[10px] text-slate-300 text-center font-medium">
                      🔒 Secure · Hamizak Montessori Academy
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
              <li className="border-t border-slate-50 pt-3 mt-2">
                <div className="flex items-center gap-2 px-3 mb-3">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Portals</p>
                </div>
                <div className="flex flex-col gap-1">
                  {PORTALS.map((portal) => {
                    const Icon = portal.icon
                    return (
                      <a
                        key={portal.label}
                        href={portal.href}
                        target={portal.external ? '_blank' : undefined}
                        rel={portal.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 text-sm font-semibold text-slate-700
                                   hover:text-teal-600 hover:bg-teal-50 px-3 py-2.5 rounded-xl transition"
                      >
                        <span className={`w-2 h-2 rounded-full ${portal.dot}`} />
                        <Icon className="w-4 h-4 opacity-60" />
                        {portal.label}
                      </a>
                    )
                  })}
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
