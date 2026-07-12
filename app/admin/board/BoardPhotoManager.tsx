'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Upload, CheckCircle2, AlertCircle, Loader2,
  Camera, RefreshCw, Cloud, HardDrive, ExternalLink,
} from 'lucide-react'

/* ─── Board member config ────────────────────────────────────────── */
const BOARD_MEMBERS = [
  {
    slug:      'dr-maryam',
    name:      'Chief (Dr.) Maryam Jummai Bello Yasin',
    role:      'Chair / Chief of Board',
    localFile: '/images/board/dr-maryam.jpg',
    accent:    'amber' as const,
  },
  {
    slug:      'alh-bello',
    name:      'Alhaji Abdul Hakeem D. Bello',
    role:      'Director of Finance and Account',
    localFile: '/images/board/alh-bello.jpg',
    accent:    'teal' as const,
  },
  {
    slug:      'hajia-habeebah',
    name:      "Hajia Habeebah Mu'azu",
    role:      'Director of Administration',
    localFile: '/images/board/hajia-habeebah.jpg',
    accent:    'teal' as const,
  },
  {
    slug:      'amina-ladidi',
    name:      'Mrs. Amina Ladidi Suleiman',
    role:      'Director',
    localFile: '/images/board/amina-ladidi.jpg',
    accent:    'teal' as const,
  },
  {
    slug:      'zainab-okunola',
    name:      'Mrs. Zainab Balaraba Okunola',
    role:      'Director',
    localFile: '/images/board/zainab-okunola.jpg',
    accent:    'teal' as const,
  },
]

type Member = typeof BOARD_MEMBERS[number]

type UploadState = {
  status:   'idle' | 'uploading' | 'success' | 'error'
  message?: string
  preview?: string   // object-URL for instant local preview
  newUrl?:  string   // Supabase public URL returned by the API
}

/* ─── Single member card ─────────────────────────────────────────── */
function MemberCard({
  member,
  initialUrl,
}: {
  member:     Member
  initialUrl: string | null   // Supabase URL from DB, or null if not yet uploaded
}) {
  const [state,    setState]    = useState<UploadState>({ status: 'idle' })
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isChair        = member.accent === 'amber'
  const hasSupabaseUrl = !!(state.newUrl ?? initialUrl)
  // What to display in the photo frame
  const displaySrc     = state.preview ?? state.newUrl ?? initialUrl ?? member.localFile

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      setState({ status: 'error', message: 'Please select an image file (JPG, PNG or WebP).' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setState({ status: 'error', message: 'Image must be under 10 MB.' })
      return
    }

    const preview = URL.createObjectURL(file)
    setState({ status: 'uploading', preview })

    const form = new FormData()
    form.append('member', member.slug)
    form.append('file',   file)

    try {
      const res  = await fetch('/api/board-photo', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        setState({ status: 'error', message: data.error ?? 'Upload failed.' })
        return
      }

      setState({
        status:  'success',
        preview,
        newUrl:  data.imageUrl,
        message: '✓ Saved to Supabase Storage — public page updated!',
      })
    } catch {
      setState({ status: 'error', message: 'Network error — please try again.' })
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ''
  }

  const currentSupabaseUrl = state.newUrl ?? initialUrl

  return (
    <div className={`
      bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300
      ${isChair
        ? 'border-amber-200 shadow-amber-50 ring-1 ring-amber-100'
        : 'border-slate-100 hover:shadow-md hover:border-slate-200'}
    `}>
      {/* Colour accent strip */}
      <div className={`h-1.5 ${isChair
        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400'
        : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}
      />

      <div className="p-6">
        {/* ── Photo + info row ───────────────────────────────────── */}
        <div className="flex items-start gap-5 mb-5">
          {/* Photo thumbnail */}
          <div className="relative shrink-0">
            <div className={`
              relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 shadow-lg
              ${isChair ? 'ring-amber-200' : 'ring-teal-100'}
            `}>
              {/* Blob previews can't go through next/image optimiser */}
              {state.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.preview}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <Image
                  src={displaySrc}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="112px"
                  unoptimized={displaySrc.startsWith('blob:')}
                />
              )}
            </div>

            {/* Camera quick-trigger */}
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-md transition-colors"
              title="Change photo"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Name / role / storage status */}
          <div className="flex-1 min-w-0">
            {isChair && (
              <span className="inline-block text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-1.5">
                ★ Chair of the Board
              </span>
            )}
            <h3 className="text-sm font-bold text-slate-900 leading-tight" title={member.name}>
              {member.name}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              {member.role}
            </p>

            {/* Source badge */}
            <div className="flex items-center gap-1.5 mt-2">
              {hasSupabaseUrl ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <Cloud size={9} /> Supabase Storage
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  <HardDrive size={9} /> Local fallback
                </span>
              )}
            </div>

            {/* Supabase URL pill — shown after first upload */}
            {currentSupabaseUrl && (
              <a
                href={currentSupabaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-[9px] text-teal-600 hover:text-teal-800 font-mono truncate max-w-[220px] hover:underline"
                title={currentSupabaseUrl}
              >
                <ExternalLink size={9} className="shrink-0" />
                {currentSupabaseUrl.replace('https://', '').slice(0, 48)}…
              </a>
            )}
          </div>
        </div>

        {/* ── Drop zone ──────────────────────────────────────────── */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-xl p-5 text-center
            transition-all duration-200 select-none
            ${dragging
              ? 'border-teal-400 bg-teal-50 scale-[1.01]'
              : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50/70'}
            ${state.status === 'uploading' ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={onInputChange}
            aria-label={`Upload photo for ${member.name}`}
          />

          {state.status === 'uploading' ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={22} className="text-teal-500 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Uploading to Supabase…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${dragging ? 'bg-teal-100' : 'bg-slate-100'}`}>
                <Upload size={18} className={dragging ? 'text-teal-600' : 'text-slate-400'} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {dragging ? 'Drop to replace photo' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WebP · max 10 MB</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Status message ─────────────────────────────────────── */}
        {(state.status === 'success' || state.status === 'error') && (
          <div className={`
            mt-3 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold
            ${state.status === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50 text-red-700 border border-red-100'}
          `}>
            {state.status === 'success'
              ? <CheckCircle2 size={15} className="shrink-0" />
              : <AlertCircle  size={15} className="shrink-0" />}
            <span className="flex-1">{state.message}</span>
            {state.status === 'success' && (
              <button
                onClick={() => setState(s => ({ ...s, status: 'idle' }))}
                className="p-1 rounded-lg hover:bg-emerald-100 transition-colors shrink-0"
                title="Dismiss"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Manager (client root) ──────────────────────────────────────── */
export default function BoardPhotoManager({
  supabasePhotos,
}: {
  supabasePhotos: Record<string, string>
}) {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <p className="admin-section-label">Board of Directors</p>
        <h1 className="text-xl font-bold text-slate-900">Manage Board Photos</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a new photo for any board member. Photos are stored permanently in{' '}
          <span className="font-semibold text-emerald-700">Supabase Storage</span> and survive
          every deployment. The public{' '}
          <a
            href="/board"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline font-semibold"
          >
            Board of Directors page ↗
          </a>{' '}
          updates automatically within 60 seconds.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
        <span className="text-amber-500 text-lg shrink-0 mt-0.5">💡</span>
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          Photos should be <strong>portrait-oriented</strong>, at least <strong>400 × 400 px</strong>, and show
          a clear head-and-shoulders shot. The image will be automatically cropped to fill the card.
          Accepted formats: <strong>JPG, PNG, WebP</strong>.
        </p>
      </div>

      {/* Supabase status strip */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3">
        <Cloud size={16} className="text-emerald-600 shrink-0" />
        <p className="text-sm text-emerald-800 font-medium">
          <strong>{Object.keys(supabasePhotos).length}</strong> of 5 photos currently stored in Supabase.
          Cards showing <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full"><HardDrive size={9} /> Local fallback</span> use the static image from the repo until you upload a replacement.
        </p>
      </div>

      {/* Chair card (full width) */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Chair of the Board</p>
        <MemberCard
          member={BOARD_MEMBERS[0]}
          initialUrl={supabasePhotos['dr-maryam'] ?? null}
        />
      </div>

      {/* Directors grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3">Board Directors</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {BOARD_MEMBERS.slice(1).map(member => (
            <MemberCard
              key={member.slug}
              member={member}
              initialUrl={supabasePhotos[member.slug] ?? null}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-6">
        <p className="text-xs text-slate-400 text-center">
          Photos are uploaded to{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">board-photos</code>{' '}
          Supabase Storage bucket and URLs are recorded in the{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">board_photos</code>{' '}
          table. Local <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/public/images/board/</code> images
          remain as fallbacks.
        </p>
      </div>
    </div>
  )
}
