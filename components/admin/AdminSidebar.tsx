'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, Users, Star, Image as GalleryIcon, MessageSquare,
  ClipboardList, Calendar, Mail, Settings, LogOut,
  PanelLeftClose, PanelLeftOpen, Globe, ChevronDown, ChevronUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',              icon: LayoutDashboard, label: 'Overview',      exact: true,  section: 'Overview' },
  { href: '/admin/programs',     icon: BookOpen,        label: 'Programs',                    section: 'Content' },
  { href: '/admin/team',         icon: Users,           label: 'Team',                        section: 'Content' },
  { href: '/admin/testimonials', icon: Star,            label: 'Testimonials',                section: 'Content' },
  { href: '/admin/gallery',      icon: GalleryIcon,     label: 'Gallery',                     section: 'Content' },
  { href: '/admin/events',       icon: Calendar,        label: 'Events & News',               section: 'Content' },
  { href: '/admin/admissions',   icon: ClipboardList,   label: 'Admissions',   dot: true,     section: 'Enquiries' },
  { href: '/admin/messages',     icon: MessageSquare,   label: 'Messages',     dot: true,     section: 'Enquiries' },
  { href: '/admin/subscribers',  icon: Mail,            label: 'Subscribers',                 section: 'Enquiries' },
  { href: '/admin/settings',     icon: Settings,        label: 'Settings',                    section: 'System' },
]

const SECTIONS = ['Overview', 'Content', 'Enquiries', 'System']

export default function AdminSidebar() {
  const path = usePathname()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [portalsOpen, setPortalsOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside
      className={`flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-60'}`}
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      {/* Brand */}
      <div className={`px-4 py-5 border-b border-white/5 ${collapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 h-9 w-9 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/10 shadow-lg">
              <Image
                src="/images/hma-logo.jpg"
                alt="HMA Logo"
                width={28}
                height={28}
                className="rounded-lg object-contain"
              />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white tracking-tight truncate leading-tight">Hamizak</p>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] truncate">Admin Panel</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-all shrink-0"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mt-4 mx-auto p-2 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-hide">
        {SECTIONS.map(section => {
          const items = NAV.filter(n => n.section === section)
          return (
            <div key={section} className="space-y-0.5">
              {!collapsed && (
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 px-2 mb-2">
                  {section}
                </p>
              )}
              {items.map(({ href, icon: Icon, label, exact, dot }) => {
                const active = exact ? path === href : path.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-xl
                      text-[13px] font-medium transition-all duration-200 group
                      ${active
                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                        : 'text-white/55 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {collapsed && active && (
                      <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-green-400 rounded-r-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    )}
                    <Icon size={16} className={`shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {!collapsed && (
                      <span className="flex-1 truncate">{label}</span>
                    )}
                    {!collapsed && dot && (
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}

        {/* Portals Section */}
        <div className="space-y-0.5">
          {!collapsed && (
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 px-2 mb-2">
              External Portals
            </p>
          )}
          
          <button
            onClick={() => {
              if (collapsed) {
                setCollapsed(false)
                setPortalsOpen(true)
              } else {
                setPortalsOpen(!portalsOpen)
              }
            }}
            className={`
              relative flex items-center w-full ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-xl
              text-[13px] font-medium transition-all duration-200 group text-white/55 hover:text-white hover:bg-white/5
            `}
          >
            <Globe size={16} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">School Portals</span>
                {portalsOpen ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
              </>
            )}
          </button>

          {!collapsed && portalsOpen && (
            <div className="mt-1 pl-4 space-y-1 border-l border-white/5 ml-4">
              <a
                href="https://admin.hamizakma.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Admin Portal
              </a>
              <a
                href="https://staff.hamizakma.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Staff Portal
              </a>
              <a
                href="https://hamizakma.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Student Portal
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`
            flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-xl
            text-[13px] font-medium w-full transition-all duration-200
            text-white/40 hover:text-red-400 hover:bg-red-500/10 group
          `}
        >
          <LogOut size={16} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
