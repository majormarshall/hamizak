'use client'

import { useState } from 'react'
import { Plus, X, Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { upsertStaff, deleteStaff } from '@/lib/actions'
import { uploadImage } from '@/lib/utils'
import AdminTable from '@/components/admin/AdminTable'
import type { StaffMember } from '@/types'

interface Props { initial: StaffMember[] }

const EMPTY: Partial<StaffMember> = {
  name: '', role: '', bio: '', photo_url: '', is_active: true
}

export default function TeamManager({ initial }: Props) {
  const [staff, setStaff]     = useState<StaffMember[]>(initial)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Partial<StaffMember>>(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  function openNew()              { setEditing(EMPTY); setPhotoFile(null); setModal(true) }
  function openEdit(m: StaffMember) { setEditing({ ...m }); setPhotoFile(null); setModal(true) }

  async function handleSave() {
    if (!editing.name || !editing.role) return toast.error('Name and role are required.')
    setSaving(true)
    try {
      let data = { ...editing, is_active: true }
      if (photoFile) data.photo_url = await uploadImage(photoFile, 'media', 'team')
      const result = await upsertStaff(data)
      toast.success(editing.id ? 'Profile updated!' : 'Staff member added!')
      if (editing.id) {
        setStaff(s => s.map(x => x.id === result.id ? result : x))
      } else {
        setStaff(s => [result, ...s])
      }
      setModal(false)
    } catch (err) {
      toast.error('Failed to save.'); console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStaff(id)
      setStaff(s => s.filter(x => x.id !== id))
      toast.success('Staff member removed.')
    } catch { toast.error('Delete failed.') }
  }

  const columns = [
    {
      key: 'photo_url',
      label: '',
      render: (m: StaffMember) => m.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.photo_url} alt={m.name} className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-slate-100" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center font-black text-teal-700 text-xs">
          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Staff Member',
      sortable: true,
      render: (m: StaffMember) => (
        <div>
          <p className="font-semibold text-slate-900">{m.name}</p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{m.role}</p>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminTable
        title="Staff Directory"
        data={staff}
        columns={columns}
        searchKeys={['name', 'role']}
        emptyMessage="No staff members yet."
        onEdit={openEdit}
        onDelete={handleDelete}
        addButton={
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add Member
          </button>
        }
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div>
                <h2 className="font-bold text-slate-900">{editing.id ? 'Edit Profile' : 'New Staff Member'}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Personnel Information</p>
              </div>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Photo */}
              <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 ring-1 ring-slate-100">
                {(editing.photo_url || photoFile) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoFile ? URL.createObjectURL(photoFile) : editing.photo_url!}
                    alt="preview"
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                    <Plus className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <label className="btn-outline-green cursor-pointer text-xs">
                    {photoFile ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] ?? null)} />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1.5">Square image recommended</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Amina Suleiman" />
                </div>
                <div>
                  <label className="form-label">Role / Title *</label>
                  <input className="form-input" value={editing.role ?? ''} onChange={e => setEditing(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Lead Teacher" />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Short Bio</label>
                  <textarea className="form-input resize-none" rows={3} value={editing.bio ?? ''} onChange={e => setEditing(p => ({ ...p, bio: e.target.value }))} placeholder="Brief professional background…" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex justify-end gap-2">
              <button onClick={() => setModal(false)} className="btn-outline-green">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {editing.id ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
