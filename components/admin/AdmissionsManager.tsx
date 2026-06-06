'use client'

import { useState } from 'react'
import { updateApplicationStatus, deleteApplication, generateAdmissionNumber } from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { AdmissionApplication, ApplicationStatus } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'
import { CheckCircle, Hash, Mail, Loader2, Eye, X } from 'lucide-react'

interface Props { initial: AdmissionApplication[] }

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'reviewed', 'contacted', 'enrolled', 'declined']

export default function AdmissionsManager({ initial }: Props) {
  const [apps, setApps]           = useState<AdmissionApplication[]>(initial)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [viewApp, setViewApp]     = useState<AdmissionApplication | null>(null)

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
      // 1. Update status to enrolled
      await updateApplicationStatus(app.id, 'enrolled')
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'enrolled' } : a))

      // 2. Send acceptance email
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
      toast.success(`Admission number generated: ${num}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate number — ensure admission_number column exists in Supabase')
    } finally {
      setGenerating(null)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteApplication(id)
      setApps(prev => prev.filter(a => a.id !== id))
      toast.success('Application deleted')
    } catch { toast.error('Delete failed') }
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
      render: (a: AdmissionApplication) => a.admission_number ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs ring-1 ring-teal-100">
          <Hash className="w-3 h-3" />
          {a.admission_number}
        </span>
      ) : (
        <span className="text-slate-300 text-xs italic">Not assigned</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Applied',
      sortable: true,
      render: (a: AdmissionApplication) => <span className="text-slate-500 tabular-nums">{formatDate(a.created_at)}</span>,
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
      <div>
        <p className="admin-section-label">Manage</p>
        <h1 className="text-xl font-bold text-slate-900">Admission Applications</h1>
        <p className="text-sm text-slate-500 mt-1">{apps.filter(a => a.status === 'new').length} new applications pending review</p>
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
              title="View details"
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

            {/* Generate admission number */}
            <button
              onClick={() => handleGenerateNumber(a.id)}
              disabled={!!a.admission_number || generating === a.id}
              title={a.admission_number ? `Already assigned: ${a.admission_number}` : 'Generate admission number'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {generating === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Hash className="w-3.5 h-3.5" />}
              {a.admission_number ? 'Assigned' : 'Gen. No.'}
            </button>

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

      {/* Application Detail Modal */}
      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 sticky top-0">
              <div>
                <h2 className="font-bold text-slate-900">Application Details</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">
                  {viewApp.admission_number ?? 'No admission number yet'}
                </p>
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
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex justify-between gap-2">
              <button
                onClick={() => { handleGenerateNumber(viewApp.id); setViewApp(null) }}
                disabled={!!viewApp.admission_number}
                className="flex items-center gap-2 btn-outline-green text-xs disabled:opacity-40"
              >
                <Hash className="w-3.5 h-3.5" /> Generate No.
              </button>
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
    </div>
  )
}
