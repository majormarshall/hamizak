'use client'

import { useState, useRef, useEffect } from 'react'
import {
  updateApplicationStatus,
  deleteApplication,
  deleteAllApplications,
  generateAdmissionNumber,
  updateAdmissionNumber,
} from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { AdmissionApplication, ApplicationStatus } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'
import { CheckCircle, Hash, Mail, Loader2, Eye, X, Pencil, Trash2, AlertTriangle, Check } from 'lucide-react'

interface Props { initial: AdmissionApplication[] }

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'reviewed', 'contacted', 'enrolled', 'declined']

// ── Inline editable admission number cell ──────────────────────
function AdmissionNumberCell({
  app,
  onSave,
}: {
  app: AdmissionApplication
  onSave: (id: string, val: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue]     = useState(app.admission_number ?? '')
  const [saving, setSaving]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  async function commit() {
    if (!value.trim()) { setEditing(false); setValue(app.admission_number ?? ''); return }
    setSaving(true)
    await onSave(app.id, value.trim())
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setValue(app.admission_number ?? '') } }}
          className="w-32 text-xs border-2 border-teal-400 rounded-lg px-2 py-1 outline-none font-bold text-teal-700 bg-teal-50"
          placeholder="HMA/2026/001"
        />
        <button onClick={commit} disabled={saving} className="p-1 text-teal-600 hover:text-teal-800">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => { setEditing(false); setValue(app.admission_number ?? '') }} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to edit admission number"
      className="group flex items-center gap-1.5"
    >
      {app.admission_number ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs ring-1 ring-teal-100 group-hover:ring-teal-400 transition-all">
          <Hash className="w-3 h-3" />
          {app.admission_number}
          <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-300 text-xs italic group-hover:text-teal-500 transition-colors">
          <Pencil className="w-3 h-3" /> Click to assign
        </span>
      )}
    </button>
  )
}

// ── Delete All Confirmation Modal ──────────────────────────────
function ClearAllModal({ count, onConfirm, onClose }: { count: number; onConfirm: () => void; onClose: () => void }) {
  const [typed, setTyped] = useState('')
  const CONFIRM_WORD = 'DELETE ALL'
  const match = typed.toUpperCase() === CONFIRM_WORD

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-red-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="font-black text-lg">Clear All Applications</h2>
          </div>
          <p className="text-white/80 text-sm">This action is permanent and cannot be undone.</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm text-red-700 font-semibold">
              You are about to permanently delete <strong>{count} application{count !== 1 ? 's' : ''}</strong>.
              All student records, status history, and admission numbers will be lost forever.
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Type <span className="font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{CONFIRM_WORD}</span> to confirm:
            </p>
            <input
              autoFocus
              value={typed}
              onChange={e => setTyped(e.target.value)}
              className="form-input border-2 border-slate-200 focus:border-red-400 w-full"
              placeholder={CONFIRM_WORD}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline-green flex-1">Cancel</button>
            <button
              onClick={onConfirm}
              disabled={!match}
              className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All {count} Records
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export default function AdmissionsManager({ initial }: Props) {
  const [apps, setApps]             = useState<AdmissionApplication[]>(initial)
  const [accepting, setAccepting]   = useState<string | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [viewApp, setViewApp]       = useState<AdmissionApplication | null>(null)
  const [showClearAll, setShowClearAll] = useState(false)
  const [clearingAll, setClearingAll]   = useState(false)

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      await updateApplicationStatus(id, status)
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success('Status updated')
    } catch { toast.error('Failed to update status') }
  }

  async function handleAcceptAndEmail(app: AdmissionApplication) {
    setAccepting(app.id)
    try {
      await updateApplicationStatus(app.id, 'enrolled')
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'enrolled' } : a))
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: app.parent_email,
          parentName: app.parent_name,
          childName: app.child_name,
          programInterest: app.program_interest,
          admissionNumber: app.admission_number ?? 'To be assigned',
        }),
      })
      if (!res.ok) throw new Error('Email failed')
      toast.success(`✅ Accepted! Confirmation email sent to ${app.parent_email}`)
    } catch (err) {
      console.error(err)
      toast.error('Status updated but email failed — check Gmail credentials in .env.local')
    } finally {
      setAccepting(null)
    }
  }

  async function handleGenerateNumber(id: string) {
    setGenerating(id)
    try {
      const num = await generateAdmissionNumber(id)
      setApps(prev => prev.map(a => a.id === id ? { ...a, admission_number: num } : a))
      toast.success(`Generated: ${num}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate — ensure admission_number column exists in Supabase')
    } finally {
      setGenerating(null)
    }
  }

  async function handleEditNumber(id: string, val: string) {
    try {
      await updateAdmissionNumber(id, val)
      setApps(prev => prev.map(a => a.id === id ? { ...a, admission_number: val } : a))
      toast.success(`Admission number updated: ${val}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update admission number')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteApplication(id)
      setApps(prev => prev.filter(a => a.id !== id))
      toast.success('Application deleted')
    } catch { toast.error('Delete failed') }
  }

  async function handleClearAll() {
    setClearingAll(true)
    try {
      await deleteAllApplications()
      setApps([])
      toast.success('All applications have been deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to clear applications')
    } finally {
      setClearingAll(false)
      setShowClearAll(false)
    }
  }

  const columns = [
    {
      key: 'child_name',
      label: 'Child',
      sortable: true,
      render: (a: AdmissionApplication) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center text-[11px] font-black text-teal-700 shrink-0">
            {a.child_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{a.child_name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{a.child_age}</p>
          </div>
        </div>
      ),
    },
    { key: 'program_interest', label: 'Program', sortable: true },
    {
      key: 'parent_name',
      label: 'Parent',
      render: (a: AdmissionApplication) => (
        <div>
          <p className="text-slate-700 font-medium">{a.parent_name}</p>
          <p className="text-[10px] text-slate-400">{a.parent_email}</p>
          <p className="text-[10px] text-slate-400">{a.parent_phone}</p>
        </div>
      ),
    },
    {
      key: 'admission_number',
      label: 'Admission No.',
      render: (a: AdmissionApplication) => (
        <AdmissionNumberCell app={a} onSave={handleEditNumber} />
      ),
    },
    {
      key: 'created_at',
      label: 'Applied',
      sortable: true,
      render: (a: AdmissionApplication) => (
        <span className="text-slate-500 tabular-nums">{formatDate(a.created_at)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a: AdmissionApplication) => (
        <span className={`badge badge-${a.status}`}>{a.status}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="admin-section-label">Manage</p>
          <h1 className="text-xl font-bold text-slate-900">Admission Applications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {apps.filter(a => a.status === 'new').length} new · {apps.length} total
          </p>
        </div>

        {/* Clear All button */}
        {apps.length > 0 && (
          <button
            onClick={() => setShowClearAll(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-300 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Records
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(s => {
          const count = apps.filter(a => a.status === s).length
          return (
            <div key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm">
              <span className={`badge badge-${s}`}>{s}</span>
              <span className="font-bold text-slate-700 tabular-nums">{count}</span>
            </div>
          )
        })}
      </div>

      <AdminTable
        title="All Applications"
        data={apps}
        columns={columns}
        searchKeys={['child_name', 'parent_name', 'program_interest']}
        emptyMessage="No applications submitted yet."
        onDelete={handleDelete}
        actions={(a) => (
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Details */}
            <button
              onClick={() => setViewApp(a)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="View full details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Status change */}
            <select
              value={a.status}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white text-slate-700 focus:ring-2 focus:ring-teal-400 transition-all"
              onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Generate admission number (if not yet assigned) */}
            {!a.admission_number && (
              <button
                onClick={() => handleGenerateNumber(a.id)}
                disabled={generating === a.id}
                title="Auto-generate admission number"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {generating === a.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Hash className="w-3.5 h-3.5" />}
                Gen. No.
              </button>
            )}

            {/* Accept + Email */}
            {a.status !== 'enrolled' && a.parent_email && (
              <button
                onClick={() => handleAcceptAndEmail(a)}
                disabled={accepting === a.id}
                title={`Accept & send email to ${a.parent_email}`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {accepting === a.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <><CheckCircle className="w-3.5 h-3.5" /><Mail className="w-3.5 h-3.5" /></>
                }
                Accept
              </button>
            )}
            {a.status === 'enrolled' && (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle className="w-3.5 h-3.5" /> Enrolled
              </span>
            )}
          </div>
        )}
      />

      {/* ── Application Detail Modal ── */}
      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 sticky top-0">
              <div>
                <h2 className="font-bold text-slate-900">Application Details</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <AdmissionNumberCell
                    app={viewApp}
                    onSave={async (id, val) => {
                      await handleEditNumber(id, val)
                      setViewApp(prev => prev ? { ...prev, admission_number: val } : null)
                    }}
                  />
                </div>
              </div>
              <button onClick={() => setViewApp(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Child Name', viewApp.child_name],
                  ['Age', viewApp.child_age],
                  ['Date of Birth', viewApp.child_dob],
                  ['Program', viewApp.program_interest],
                  ['Parent Name', viewApp.parent_name],
                  ['Parent Email', viewApp.parent_email],
                  ['Parent Phone', viewApp.parent_phone],
                  ['How Heard', viewApp.how_heard],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{val || '—'}</p>
                  </div>
                ))}
              </div>
              {viewApp.address && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm font-semibold text-slate-800">{viewApp.address}</p>
                </div>
              )}
              {viewApp.additional_notes && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Additional Notes</p>
                  <p className="text-sm text-slate-600">{viewApp.additional_notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <span className={`badge badge-${viewApp.status}`}>{viewApp.status}</span>
                <span className="text-xs text-slate-400">Applied {formatDate(viewApp.created_at)}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex justify-between gap-2 flex-wrap">
              {/* Delete this application from the modal */}
              <button
                onClick={() => {
                  handleDelete(viewApp.id)
                  setViewApp(null)
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-100 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Application
              </button>

              {/* Accept + email from modal */}
              {viewApp.status !== 'enrolled' && (
                <button
                  onClick={() => { handleAcceptAndEmail(viewApp); setViewApp(null) }}
                  className="flex items-center gap-2 btn-primary text-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <Mail className="w-3.5 h-3.5" />
                  Accept & Send Email
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Clear All Confirmation Modal ── */}
      {showClearAll && !clearingAll && (
        <ClearAllModal
          count={apps.length}
          onConfirm={handleClearAll}
          onClose={() => setShowClearAll(false)}
        />
      )}
      {clearingAll && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="font-bold text-slate-700">Deleting all records…</p>
          </div>
        </div>
      )}
    </div>
  )
}
