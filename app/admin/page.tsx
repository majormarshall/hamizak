import { ClipboardList, MessageSquare, Users, Image as ImageIcon, GraduationCap, Bell, TrendingUp } from 'lucide-react'
import { getApplications, getContactMessages, getSubscribers, getGalleryAlbums } from '@/lib/actions'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AdmissionApplication, ContactMessage, NewsletterSubscriber, GalleryAlbum } from '@/types'

export default async function AdminOverviewPage() {
  let apps: AdmissionApplication[] = []
  let msgs: ContactMessage[] = []
  let subs: NewsletterSubscriber[] = []
  let albums: GalleryAlbum[] = []

  try {
    const [appsData, msgsData, subsData, albumsData] = await Promise.all([
      getApplications(),
      getContactMessages(),
      getSubscribers(),
      getGalleryAlbums(),
    ])
    apps = appsData
    msgs = msgsData
    subs = subsData
    albums = albumsData
  } catch (error) {
    console.error('Error loading admin dashboard data:', error)
  }

  const stats = [
    {
      label: 'Applications',
      value: apps.length,
      sub: `${apps.filter(a => a.status === 'new').length} pending`,
      icon: ClipboardList,
      href: '/admin/admissions',
      bg: 'bg-teal-50',
      ring: 'ring-teal-100',
      text: 'text-teal-600',
    },
    {
      label: 'Messages',
      value: msgs.length,
      sub: `${msgs.filter(m => !m.is_read).length} unread`,
      icon: MessageSquare,
      href: '/admin/messages',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-100',
      text: 'text-emerald-600',
    },
    {
      label: 'Subscribers',
      value: subs.length,
      sub: 'newsletter',
      icon: Users,
      href: '/admin/subscribers',
      bg: 'bg-green-50',
      ring: 'ring-green-100',
      text: 'text-green-700',
    },
    {
      label: 'Gallery Albums',
      value: albums.length,
      sub: `${albums.reduce((n, a) => n + (a.images?.length ?? 0), 0)} photos`,
      icon: ImageIcon,
      href: '/admin/gallery',
      bg: 'bg-slate-100',
      ring: 'ring-slate-200',
      text: 'text-slate-600',
    },
  ]

  const recentApps = apps.slice(0, 5)
  const recentMsgs = msgs.slice(0, 5)

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <p className="admin-section-label">Dashboard</p>
        <h1 className="text-xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here&apos;s what&apos;s happening at Hamizak Montessori.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, href, bg, ring, text }) => (
          <Link key={label} href={href}>
            <div className="admin-stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">{value.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${bg} ring-1 ${ring} shrink-0`}>
                  <Icon className={`h-5 w-5 ${text}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="admin-section-label">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Add Program',    href: '/admin/programs' },
            { label: 'Upload Gallery', href: '/admin/gallery' },
            { label: 'Create Event',   href: '/admin/events' },
            { label: 'Site Settings',  href: '/admin/settings' },
            { label: 'View Website',   href: '/', target: '_blank' },
          ].map(({ label, href, target }) => (
            <Link key={label} href={href} target={target}
                  className="btn-outline-green">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Two-col feed */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center">
                <ClipboardList className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
            </div>
            <Link href="/admin/admissions" className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentApps.length === 0 && (
              <div className="px-5 py-10 text-center">
                <GraduationCap className="h-6 w-6 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No applications yet.</p>
              </div>
            )}
            {recentApps.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 ring-1 ring-teal-100 flex items-center justify-center text-[11px] font-black text-teal-700 shrink-0">
                    {a.child_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{a.child_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.program_interest} · {a.parent_name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{formatDate(a.created_at, 'dd MMM')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                <Bell className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recent Messages</h2>
            </div>
            <Link href="/admin/messages" className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMsgs.length === 0 && (
              <div className="px-5 py-10 text-center">
                <MessageSquare className="h-6 w-6 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No messages yet.</p>
              </div>
            )}
            {recentMsgs.map((m) => (
              <div key={m.id} className={`flex items-start justify-between px-5 py-3.5 hover:bg-slate-50/60 transition-colors ${!m.is_read ? '' : 'opacity-60'}`}>
                <div className="flex items-center gap-3">
                  {!m.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
                  )}
                  <div>
                    <p className={`text-sm leading-tight ${!m.is_read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{m.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{m.subject || m.message}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 tabular-nums">{formatDate(m.created_at, 'dd MMM')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
