'use client'

import { useState } from 'react'
import {
  updateApplicationStatus,
  deleteApplication,
  updateApplication,
  clearAllApplications
} from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { AdmissionApplication, ApplicationStatus } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'
import { GraduationCap, Trash2, X, Sparkles } from 'lucide-react'

interface Props { initial: AdmissionApplication[] }

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'reviewed', 'contacted', 'enrolled', 'declined']

// Helpers for parsing/storing Admission Number inside additional_notes
function getAdmissionNumber(notes: string | null): string {
  if (!notes) return ''
  const match = notes.match(/\[ADMISSION_NO:\s*([^\]]+)\]/)
  return match ? match[1] : ''
}

function setAdmissionNumber(notes: string | null, num: string): string {
  const cleanNotes = notes ? notes.replace(/\[ADMISSION_NO:\s*([^\]]+)\]/, '').trim() : ''
  if (!num) return cleanNotes
  return `${cleanNotes} [ADMISSION_NO: ${num}]`.trim()
}

function safeFormatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return formatDate(d)
  } catch {
    return String(dateStr)
  }
}

export default function AdmissionsManager({ initial }: Props) {
  const [apps, setApps] = useState<AdmissionApplication[]>(initial)
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null)
  const [admissionNumberInput, setAdmissionNumberInput] = useState('')
  const [savingNum, setSavingNum] = useState(false)
  const [clearingLogs, setClearingLogs] = useState(false)

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      await updateApplicationStatus(id, status)
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success('Status updated successfully')
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this application log?')) return
    try {
      await deleteApplication(id)
      setApps(prev => prev.filter(a => a.id !== id))
      toast.success('Application deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  async function handleClearAll() {
    if (!confirm('WARNING: This will permanently delete ALL admission logs. This action cannot be undone. Are you sure you want to continue?')) return
    setClearingLogs(true)
    try {
      await clearAllApplications()
      setApps([])
      toast.success('All applications cleared')
    } catch {
      toast.error('Failed to clear application log')
    } finally {
      setClearingLogs(false)
    }
  }

  function handleOpenDetails(a: AdmissionApplication) {
    setSelectedApp(a)
    setAdmissionNumberInput(getAdmissionNumber(a.additional_notes))
  }

  function handleGenerateNumber() {
    const year = new Date().getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    setAdmissionNumberInput(`HMA/${year}/${rand}`)
  }

  async function handleSaveAdmissionNumber() {
    if (!selectedApp) return
    setSavingNum(true)
    try {
      const updatedNotes = setAdmissionNumber(selectedApp.additional_notes, admissionNumberInput)
      await updateApplication(selectedApp.id, { additional_notes: updatedNotes })
      setApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, additional_notes: updatedNotes } : a))
      setSelectedApp(prev => prev ? { ...prev, additional_notes: updatedNotes } : null)
      toast.success('Admission number assigned successfully')
    } catch {
      toast.error('Failed to update admission number')
    } finally {
      setSavingNum(false)
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
          <p className="text-[10px] text-slate-400">{a.parent_phone}</p>
        </div>
      ),
    },
    {
      key: 'admission_number',
      label: 'Admission ID',
      render: (a: AdmissionApplication) => {
        const num = getAdmissionNumber(a.additional_notes)
        return num ? (
          <span className="font-mono text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
            {num}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
        )
      }
    },
    {
      key: 'created_at',
      label: 'Applied',
      sortable: true,
      render: (a: AdmissionApplication) => <span className="text-slate-500 tabular-nums">{safeFormatDate(a.created_at)}</span>,
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
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="admin-section-label">Manage</p>
          <h1 className="text-xl font-bold text-slate-900">Admission Applications</h1>
          <p className="text-sm text-slate-500 mt-1">{apps.filter(a => a.status === 'new').length} new applications pending review</p>
        </div>
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
        addButton={
          apps.length > 0 ? (
            <button
              onClick={handleClearAll}
              disabled={clearingLogs}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Logs
            </button>
          ) : undefined
        }
        actions={(a) => (
          <div className="flex items-center gap-2">
            <select
              defaultValue={a.status}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white text-slate-700 focus:ring-2 focus:ring-teal-400 transition-all"
              onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => handleOpenDetails(a)}
              className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
              title="Manage / Assign Number"
            >
              <GraduationCap className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(a.id)}
              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="Delete Log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Detail / Edit Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center text-teal-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">Manage Application</h3>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {selectedApp.id.slice(0, 8)}...</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Admission Number Section */}
              <div className="p-5 bg-teal-50/50 border border-teal-100/50 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Admission Number Assignment</h4>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter or generate ID..."
                    className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white text-slate-700 font-mono font-semibold"
                    value={admissionNumberInput}
                    onChange={(e) => setAdmissionNumberInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateNumber}
                    className="px-3.5 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-600 font-semibold text-xs hover:bg-teal-50 transition-all shrink-0"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAdmissionNumber}
                    disabled={savingNum}
                    className="btn-primary !px-5 !py-2.5 text-xs shrink-0"
                  >
                    {savingNum ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <p className="text-[11px] text-teal-700 leading-snug">
                  Assigning an admission number will include it in the confirmation email when the student is enrolled.
                </p>
              </div>

              {/* Student & Parent Details */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Column 1: Child Details */}
                <div className="space-y-4">
                  <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-wider">Student Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Full Name</span>
                      <p className="text-sm font-semibold text-slate-800">{selectedApp.child_name}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Age &amp; Date of Birth</span>
                      <p className="text-sm font-semibold text-slate-800">{selectedApp.child_age} ({safeFormatDate(selectedApp.child_dob)})</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Program of Interest</span>
                      <p className="text-sm font-semibold text-slate-800">{selectedApp.program_interest}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Parent Details */}
                <div className="space-y-4">
                  <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-wider">Parent &amp; Contact Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Parent/Guardian Name</span>
                      <p className="text-sm font-semibold text-slate-800">{selectedApp.parent_name}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Email / Phone</span>
                      <p className="text-sm font-semibold text-slate-800 leading-normal">
                        {selectedApp.parent_email} <br />
                        <span className="text-slate-500 font-medium">{selectedApp.parent_phone}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Home Address</span>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{selectedApp.address}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Other Info */}
              <div className="border-t border-slate-100 pt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">How they heard about us</span>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedApp.how_heard || '—'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Date Submitted</span>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{safeFormatDate(selectedApp.created_at)}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[11px] text-slate-400 font-medium">Additional Notes</span>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-1.5 leading-relaxed font-medium">
                  {selectedApp.additional_notes ? selectedApp.additional_notes.replace(/\[ADMISSION_NO:\s*([^\]]+)\]/, '').trim() || 'No additional notes.' : 'No additional notes.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
