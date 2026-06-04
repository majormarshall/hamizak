'use client'

import { useState } from 'react'
import { updateApplicationStatus, deleteApplication } from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { AdmissionApplication, ApplicationStatus } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'
import { GraduationCap } from 'lucide-react'

interface Props { initial: AdmissionApplication[] }

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'reviewed', 'contacted', 'enrolled', 'declined']

export default function AdmissionsManager({ initial }: Props) {
  const [apps, setApps] = useState<AdmissionApplication[]>(initial)

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      await updateApplicationStatus(id, status)
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success('Status updated')
    } catch { toast.error('Failed to update status') }
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
      label: "Child",
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
          <select
            defaultValue={a.status}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white text-slate-700 focus:ring-2 focus:ring-teal-400 transition-all"
            onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      />
    </div>
  )
}
