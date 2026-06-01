'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
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
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-white'
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

        {/* Desktop Nav Links */}
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

        {/* Right-side controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/admission"
            className="btn-primary text-xs hidden sm:inline-flex shadow-teal-100"
          >
            Apply Now
          </Link>

          {/* ── Portal Access Dropdown (desktop) ── */}
          <PortalDropdown />

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open
              ? <X    className="w-5 h-5 text-slate-600" />
              : <Menu className="w-5 h-5 text-slate-600" />
            }
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

              <li className="pt-2">
                <Link
                  href="/admission"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center block py-3"
                >
                  Apply Now
                </Link>
              </li>

              {/* ── Mobile Portal Links ── */}
              <li className="pt-3 border-t border-slate-100 mt-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 pb-2.5">
                  🔐 Portal Access
                </p>
                <div className="flex flex-col gap-2">
                  <MobilePortalLink
                    href="https://hamizakma.com.ng"
                    label="Student Portal"
                    icon="🎓"
                    gradient="from-teal-500 to-emerald-600"
                    onClick={() => setOpen(false)}
                  />
                  <MobilePortalLink
                    href="https://staff.hamizakma.com.ng"
                    label="Staff Portal"
                    icon="👩‍🏫"
                    gradient="from-blue-500 to-indigo-600"
                    onClick={() => setOpen(false)}
                  />
                  <MobilePortalLink
                    href="https://admin.hamizakma.com.ng"
                    label="Admin Portal"
                    icon="🛡️"
                    gradient="from-purple-500 to-violet-700"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Portal Dropdown — Desktop
───────────────────────────────────────────────────────────────── */
function PortalDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#hma-portal-root')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  return (
    <div id="hma-portal-root" className="relative">
      {/* Trigger button */}
      <button
        id="hma-portal-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl
                    border transition-all duration-200 select-none
                    ${isOpen
                      ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200'
                    }`}
      >
        <span>🔐</span>
        <span className="hidden sm:inline">Portals</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </motion.svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute right-0 top-full mt-2.5 w-76 bg-white
                       rounded-2xl shadow-2xl shadow-slate-200/70
                       border border-slate-100 overflow-hidden z-50"
            style={{ width: '19rem' }}
          >
            {/* Panel header */}
            <div className="px-5 pt-4 pb-3 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
              <p className="text-white font-extrabold text-sm">HMA Portal Access</p>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                Select your role to continue
              </p>
            </div>

            {/* Cards */}
            <div className="p-3 flex flex-col gap-2">
              <PortalCard
                href="https://hamizakma.com.ng"
                label="Student Portal"
                description="View grades, timetable & resources"
                icon="🎓"
                gradient="from-teal-400 to-emerald-500"
                onClick={() => setIsOpen(false)}
              />
              <PortalCard
                href="https://staff.hamizakma.com.ng"
                label="Staff Portal"
                description="Manage classes, records & attendance"
                icon="👩‍🏫"
                gradient="from-blue-400 to-indigo-500"
                onClick={() => setIsOpen(false)}
              />
              <PortalCard
                href="https://admin.hamizakma.com.ng"
                label="Admin Portal"
                description="Full school management dashboard"
                icon="🛡️"
                gradient="from-purple-400 to-violet-600"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Footer hint */}
            <p className="text-[10px] text-center text-slate-400 pb-3.5 font-medium">
              Contact admin if you have login issues
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────── */
function PortalCard({
  href, label, description, icon, gradient, onClick,
}: {
  href: string; label: string; description: string
  icon: string; gradient: string; onClick: () => void
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      role="menuitem"
      className="group flex items-center gap-3 p-3 rounded-xl
                 hover:bg-slate-50 border border-transparent hover:border-slate-200
                 transition-all duration-150 cursor-pointer"
    >
      {/* Icon bubble */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradient}
                    flex items-center justify-center text-xl shadow`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors leading-tight">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight truncate">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5
                   transition-all duration-150 flex-shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  )
}

function MobilePortalLink({
  href, label, icon, gradient, onClick,
}: {
  href: string; label: string; icon: string; gradient: string; onClick: () => void
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-gradient-to-r ${gradient} text-white font-bold text-sm
                  shadow-sm hover:opacity-90 transition-opacity`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 ml-auto opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  )
}
