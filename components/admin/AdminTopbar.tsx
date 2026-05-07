'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Bell } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function AdminTopbar({ user }: { user: User }) {
  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'AD'
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between flex-shrink-0 z-10">
      <div className="flex items-center gap-2.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Welcome back,
        </p>
        <p className="text-sm font-semibold text-slate-700">{user.email}</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-teal-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>

        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100 ml-1">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-teal-100">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
