'use client'

import { useState, useRef, useCallback, useTransition } from 'react'
import Image from 'next/image'
import {
  Upload, Camera, Cloud, HardDrive, Loader2, CheckCircle2,
  AlertCircle, Plus, Trash2, Save, X, ChevronDown, ChevronUp,
  ExternalLink, RefreshCw, Edit3,
} from 'lucide-react'
import { upsertBoardMember, deleteBoardMember } from '@/lib/actions'
import type { BoardMember } from '@/lib/actions'

const LOCAL_FALLBACKS: Record<string, string> = {
  'dr-maryam':      '/images/board/dr-maryam.jpg',
  'alh-bello':      '/images/board/alh-bello.jpg',
  'hajia-habeebah': '/images/board/hajia-habeebah.jpg',
  'amina-ladidi':   '/images/board/amina-ladidi.jpg',
  'zainab-okunola': '/images/board/zainab-okunola.jpg',
}

function photoSrc(m: BoardMember, preview?: string) {
  return preview || m.image_url || LOCAL_FALLBACKS[m.slug] || '/images/board/placeholder.jpg'
}

/* ── Empty member template ── */
function emptyMember(): Omit<BoardMember, 'id' | 'updated_at'> {
  return {
    slug: '', name: '', board_title: '', subtitle: '',
    bio: '', is_chair: false, display_order: 99,
    extra_titles: [], quote: '', image_url: '',
  }
}

/* ── Photo upload hook ── */
function usePhotoUpload(slug: string) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadMsg, setUploadMsg] = useState('')
  const [preview, setPreview] = useState<string>('')
  const [uploadedUrl, setUploadedUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadStatus('error'); setUploadMsg('Please select an image file.'); return }
    if (file.size > 10 * 1024 * 1024) { setUploadStatus('error'); setUploadMsg('Max 10 MB.'); return }
    const prev = URL.createObjectURL(file)
    setPreview(prev)
    setUploadStatus('uploading')
    const form = new FormData()
    form.append('member', slug)
    form.append('file', file)
    try {
      const res = await fetch('/api/board-photo', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) { setUploadStatus('error'); setUploadMsg(data.error ?? 'Upload failed.'); return }
      setUploadedUrl(data.imageUrl)
      setUploadStatus('success')
      setUploadMsg('Photo saved to Supabase!')
    } catch { setUploadStatus('error'); setUploadMsg('Network error.') }
  }, [slug])

  return { inputRef, preview, uploadedUrl, uploadStatus, uploadMsg, upload, setUploadStatus }
}

/* ── Member editor card ── */
function MemberCard({
  member,
  onSaved,
  onDeleted,
  isNew = false,
  onCancelNew,
}: {
  member: BoardMember
  onSaved: (m: BoardMember) => void
  onDeleted: (id: string) => void
  isNew?: boolean
  onCancelNew?: () => void
}) {
  const [expanded, setExpanded] = useState(isNew)
  const [editing, setEditing] = useState(isNew)
  const [form, setForm] = useState<Partial<BoardMember>>({ ...member })
  const [extraTitleInput, setExtraTitleInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMsg, setSaveMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { inputRef, preview, uploadedUrl, uploadStatus, uploadMsg, upload, setUploadStatus } =
    usePhotoUpload(form.slug || member.slug)

  const isChair = form.is_chair ?? member.is_chair

  function set<K extends keyof BoardMember>(key: K, val: BoardMember[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function addExtraTitle() {
    if (!extraTitleInput.trim()) return
    set('extra_titles', [...(form.extra_titles ?? []), extraTitleInput.trim()])
    setExtraTitleInput('')
  }

  function removeExtraTitle(i: number) {
    set('extra_titles', (form.extra_titles ?? []).filter((_, idx) => idx !== i))
  }

  function handleSave() {
    if (!form.name?.trim() || !form.slug?.trim()) { setSaveStatus('error'); setSaveMsg('Name and slug are required.'); return }
    startTransition(async () => {
      try {
        const payload = { ...form }
        if (uploadedUrl) payload.image_url = uploadedUrl
        if (!isNew) payload.id = member.id
        const saved = await upsertBoardMember(payload)
        setSaveStatus('success'); setSaveMsg('Saved!')
        setEditing(false)
        onSaved(saved)
      } catch (e: unknown) {
        setSaveStatus('error')
        setSaveMsg(e instanceof Error ? e.message : 'Save failed.')
      }
    })
  }

  function handleDelete() {
    if (!member.id) { onDeleted('new'); return }
    startTransition(async () => {
      await deleteBoardMember(member.id)
      onDeleted(member.id)
    })
  }

  const displaySrc = photoSrc({ ...member, image_url: uploadedUrl || member.image_url }, preview)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300
      ${isChair ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-100 hover:border-slate-200'}`}>
      {/* Accent strip */}
      <div className={`h-1.5 ${isChair
        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400'
        : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`} />

      {/* Card header */}
      <div className="p-5 flex items-center gap-4">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className={`relative w-16 h-16 rounded-xl overflow-hidden ring-2 ${isChair ? 'ring-amber-200' : 'ring-teal-100'}`}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={member.name} className="w-full h-full object-cover object-top" />
            ) : (
              <Image src={displaySrc} alt={member.name} fill className="object-cover object-top" sizes="64px" />
            )}
          </div>
          {editing && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow transition-colors"
              title="Change photo"
            >
              <Camera size={11} />
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="sr-only"
            onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isChair && (
            <span className="inline-block text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-1">
              ★ Chair
            </span>
          )}
          <p className="font-bold text-slate-900 text-sm truncate">{form.name || 'New Member'}</p>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider truncate">
            {form.board_title || 'No title set'}
            {form.subtitle ? ` · ${form.subtitle}` : ''}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {(uploadedUrl || member.image_url) ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Cloud size={8} /> Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                <HardDrive size={8} /> Local
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button onClick={() => { setEditing(true); setExpanded(true) }}
              className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-500 flex items-center justify-center transition-colors"
              title="Edit">
              <Edit3 size={14} />
            </button>
          )}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center transition-colors"
              title="Delete">
              <Trash2 size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-red-600">Sure?</span>
              <button onClick={handleDelete} disabled={isPending}
                className="text-[10px] font-black px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                {isPending ? '…' : 'Yes'}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                No
              </button>
            </div>
          )}
          <button onClick={() => setExpanded(e => !e)}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Upload status */}
      {(uploadStatus === 'success' || uploadStatus === 'error') && (
        <div className={`mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
          ${uploadStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {uploadStatus === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          <span className="flex-1">{uploadMsg}</span>
          <button onClick={() => setUploadStatus('idle')} className="p-0.5 rounded hover:opacity-70"><X size={11} /></button>
        </div>
      )}
      {uploadStatus === 'uploading' && (
        <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
          <Loader2 size={13} className="animate-spin" /> Uploading photo…
        </div>
      )}

      {/* Expanded editor */}
      {expanded && (
        <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-5">
          {editing ? (
            <>
              {/* Photo drop zone */}
              <div>
                <label className="field-label">Photo</label>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-slate-50 rounded-xl p-4 text-center transition-all">
                  <Upload size={18} className="text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-600">Click to upload photo</p>
                  <p className="text-[10px] text-slate-400">JPG, PNG, WebP · max 10 MB</p>
                  {(uploadedUrl || member.image_url) && (
                    <a href={uploadedUrl || member.image_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[9px] text-teal-600 hover:underline font-mono"
                      onClick={e => e.stopPropagation()}>
                      <ExternalLink size={9} /> View current Supabase URL
                    </a>
                  )}
                </div>
              </div>

              {/* Core fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input className="field-input" value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="Chief (Dr.) Maryam Yasin" />
                </div>
                <div>
                  <label className="field-label">Slug * (URL-safe identifier)</label>
                  <input className="field-input font-mono" value={form.slug ?? ''} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="dr-maryam" />
                </div>
                <div>
                  <label className="field-label">Board Title</label>
                  <input className="field-input" value={form.board_title ?? ''} onChange={e => set('board_title', e.target.value)} placeholder="CHAIR / CHIEF OF BOARD" />
                </div>
                <div>
                  <label className="field-label">Subtitle / Role tag</label>
                  <input className="field-input" value={form.subtitle ?? ''} onChange={e => set('subtitle', e.target.value)} placeholder="Deputy Director Procurement" />
                </div>
                <div>
                  <label className="field-label">Display Order</label>
                  <input type="number" className="field-input" value={form.display_order ?? 0} onChange={e => set('display_order', Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" id={`chair-${member.id || 'new'}`}
                    checked={form.is_chair ?? false}
                    onChange={e => set('is_chair', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                  <label htmlFor={`chair-${member.id || 'new'}`} className="text-sm font-semibold text-slate-700">
                    This is the Chair of the Board
                  </label>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="field-label">Biography / Citation</label>
                <textarea
                  className="field-input resize-y min-h-[180px]"
                  value={form.bio ?? ''}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Write the full bio here. Separate paragraphs with a blank line."
                />
              </div>

              {/* Quote */}
              <div>
                <label className="field-label">Highlight Quote (optional)</label>
                <input className="field-input" value={form.quote ?? ''} onChange={e => set('quote', e.target.value)} placeholder="A memorable quote displayed on the page" />
              </div>

              {/* Extra Titles */}
              <div>
                <label className="field-label">Honours &amp; Extra Titles</label>
                <div className="flex gap-2 mb-2">
                  <input className="field-input flex-1" value={extraTitleInput} onChange={e => setExtraTitleInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExtraTitle() } }}
                    placeholder="e.g. Yeye Bashorun of Offa Kingdom" />
                  <button onClick={addExtraTitle} className="px-3 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.extra_titles ?? []).map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                      {t}
                      <button onClick={() => removeExtraTitle(i)} className="text-teal-400 hover:text-red-500 transition-colors"><X size={10} /></button>
                    </span>
                  ))}
                  {(form.extra_titles ?? []).length === 0 && (
                    <span className="text-xs text-slate-400 italic">No titles added yet</span>
                  )}
                </div>
              </div>

              {/* Save / Cancel */}
              {saveStatus !== 'idle' && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                  ${saveStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {saveStatus === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  {saveMsg}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {isPending ? 'Saving…' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); if (isNew) onCancelNew?.(); setSaveStatus('idle') }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                  <X size={14} /> Cancel
                </button>
              </div>
            </>
          ) : (
            /* Read-only view */
            <div className="space-y-4">
              {form.subtitle && (
                <p className="text-xs text-teal-700 font-bold bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl inline-block">
                  {form.subtitle}
                </p>
              )}
              <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
                {(form.bio || '').split('\n\n').slice(0, 2).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {(form.bio || '').split('\n\n').length > 2 && (
                  <p className="text-slate-400 italic text-xs">…{(form.bio || '').split('\n\n').length - 2} more paragraphs</p>
                )}
              </div>
              {(form.extra_titles ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(form.extra_titles ?? []).map((t, i) => (
                    <span key={i} className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              <button onClick={() => { setEditing(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-sm font-bold rounded-xl transition-colors">
                <Edit3 size={13} /> Edit this member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main manager ── */
export default function BoardManager({ initialMembers }: { initialMembers: BoardMember[] }) {
  const [members, setMembers] = useState<BoardMember[]>(initialMembers)
  const [addingNew, setAddingNew] = useState(false)
  const [, startTransition] = useTransition()

  function handleSaved(saved: BoardMember) {
    setMembers(ms => {
      const idx = ms.findIndex(m => m.id === saved.id)
      if (idx >= 0) { const next = [...ms]; next[idx] = saved; return next }
      return [...ms, saved]
    })
    setAddingNew(false)
  }

  function handleDeleted(id: string) {
    setMembers(ms => ms.filter(m => m.id !== id))
    setAddingNew(false)
  }

  const chair = members.filter(m => m.is_chair)
  const directors = members.filter(m => !m.is_chair)

  const newMemberPlaceholder: BoardMember = {
    id: '', slug: '', name: '', board_title: '', subtitle: '', bio: '',
    is_chair: false, display_order: members.length, extra_titles: [], quote: '', image_url: '',
    updated_at: '',
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Styles injected inline for field classes */}
      <style>{`
        .field-label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#64748b; margin-bottom:4px; }
        .field-input { display:block; width:100%; border:1px solid #e2e8f0; border-radius:12px; padding:8px 12px; font-size:13px; color:#0f172a; background:#fff; outline:none; transition:border-color .15s; }
        .field-input:focus { border-color:#0d9488; box-shadow:0 0 0 3px rgb(20 184 166 / .1); }
        .field-input::placeholder { color:#94a3b8; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="admin-section-label">Board of Directors</p>
          <h1 className="text-xl font-bold text-slate-900">Manage Board Members</h1>
          <p className="text-sm text-slate-500 mt-1">
            Edit names, titles, bios, photos and honours for each board member.{' '}
            <a href="/board" target="_blank" rel="noopener noreferrer"
              className="text-teal-600 hover:underline font-semibold inline-flex items-center gap-1">
              View public page <ExternalLink size={11} />
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => startTransition(() => window.location.reload())}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => setAddingNew(true)} disabled={addingNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
            <Plus size={14} /> Add Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: members.length },
          { label: 'On Supabase', value: members.filter(m => m.image_url).length },
          { label: 'Local Fallback', value: members.filter(m => !m.image_url).length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New member form */}
      {addingNew && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3">New Member</p>
          <MemberCard
            member={newMemberPlaceholder}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
            isNew
            onCancelNew={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Chair */}
      {chair.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Chair of the Board</p>
          <div className="space-y-4">
            {chair.map(m => (
              <MemberCard key={m.id} member={m} onSaved={handleSaved} onDeleted={handleDeleted} />
            ))}
          </div>
        </div>
      )}

      {/* Directors */}
      {directors.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3">Board Directors</p>
          <div className="grid sm:grid-cols-1 gap-4">
            {directors.map(m => (
              <MemberCard key={m.id} member={m} onSaved={handleSaved} onDeleted={handleDeleted} />
            ))}
          </div>
        </div>
      )}

      {members.length === 0 && !addingNew && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-bold mb-2">No board members yet</p>
          <p className="text-sm">Click &quot;Add Member&quot; to create the first one.</p>
        </div>
      )}
    </div>
  )
}
