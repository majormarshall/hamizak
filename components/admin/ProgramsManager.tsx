'use client'

import { useState } from 'react'
import { Plus, X, Loader2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { upsertProgram, deleteProgram } from '@/lib/actions'
import { uploadImage } from '@/lib/utils'
import AdminTable from '@/components/admin/AdminTable'
import type { Program } from '@/types'

interface Props { initial: Program[] }

const EMPTY: Partial<Program> = {
  title: '', age_range: '', description: '', icon: '📚', features: [], display_order: 0, is_active: true
}

export default function ProgramsManager({ initial }: Props) {
  const [programs, setPrograms] = useState<Program[]>(initial)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Partial<Program>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [featInput, setFeatInput] = useState('')
  const [imgFile, setImgFile]   = useState<File | null>(null)

  function openNew()          { setEditing(EMPTY); setFeatInput(''); setModal(true) }
  function openEdit(p: Program) { setEditing({ ...p }); setFeatInput(''); setModal(true) }

  function addFeature() {
    if (!featInput.trim()) return
    setEditing(e => ({ ...e, features: [...(e.features ?? []), featInput.trim()] }))
    setFeatInput('')
  }

  function removeFeature(i: number) {
    setEditing(e => ({ ...e, features: (e.features ?? []).filter((_, idx) => idx !== i) }))
  }

  async function handleSave() {
    if (!editing.title || !editing.age_range) return toast.error('Title and age range are required.')
    setSaving(true)
    try {
      let data = { ...editing }
      if (imgFile) {
        data.image_url = await uploadImage(imgFile, 'media', 'programs')
      }
      await upsertProgram(data)
      toast.success(editing.id ? 'Program updated!' : 'Program created!')
      // Refresh list
      const res = await fetch('/api/programs').then(r => r.json()).catch(() => null)
      if (res) setPrograms(res)
      setModal(false)
    } catch (err) {
      toast.error('Failed to save program.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProgram(id)
      setPrograms(p => p.filter(x => x.id !== id))
      toast.success('Program deleted.')
    } catch {
      toast.error('Delete failed.')
    }
  }

  const columns = [
    {
      key: 'icon',
      label: '',
      render: (p: Program) => <span className="text-2xl">{p.icon}</span>,
    },
    {
      key: 'title',
      label: 'Program',
      sortable: true,
      render: (p: Program) => (
        <div>
          <p className="font-semibold text-gray-900">{p.title}</p>
          <p className="text-xs text-gray-400">{p.age_range}</p>
        </div>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (p: Program) => (
        <span className="text-xs text-gray-500">{p.features?.length ?? 0} items</span>
      ),
    },
    {
      key: 'display_order',
      label: 'Order',
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (p: Program) => (
        <span className={`badge ${p.is_active ? 'badge-published' : 'badge-draft'}`}>
          {p.is_active ? 'Active' : 'Hidden'}
        </span>
      ),
    },
  ]

  return (
    <>
      <AdminTable
        title="All Programs"
        data={programs}
        columns={columns}
        searchKeys={['title', 'age_range']}
        emptyMessage="No programs yet. Add your first program!"
        onEdit={openEdit}
        onDelete={handleDelete}
        addButton={
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Program
          </button>
        }
      />

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {editing.id ? 'Edit Program' : 'New Program'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Program Title *</label>
                  <input className="form-input" value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Children's House" />
                </div>
                <div>
                  <label className="form-label">Age Range *</label>
                  <input className="form-input" value={editing.age_range ?? ''} onChange={e => setEditing(p => ({ ...p, age_range: e.target.value }))} placeholder="3 – 6 years" />
                </div>
                <div>
                  <label className="form-label">Icon (emoji)</label>
                  <input className="form-input text-2xl" value={editing.icon ?? '📚'} onChange={e => setEditing(p => ({ ...p, icon: e.target.value }))} placeholder="📚" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Description</label>
                  <textarea className="form-input resize-none" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the program…" />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="form-label">Features / Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="form-input flex-1"
                    value={featInput}
                    onChange={e => setFeatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="e.g. Practical life activities"
                  />
                  <button onClick={addFeature} className="btn-outline-green px-3 py-2 text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editing.features ?? []).map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                      {f}
                      <button onClick={() => removeFeature(i)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="form-label">Program Image</label>
                <div className="flex items-center gap-3">
                  {(editing.image_url || imgFile) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgFile ? URL.createObjectURL(imgFile) : editing.image_url!}
                      alt="preview"
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <label className="btn-outline-green text-sm cursor-pointer">
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-input" value={editing.display_order ?? 0} onChange={e => setEditing(p => ({ ...p, display_order: parseInt(e.target.value) }))} />
                </div>
                <div className="flex items-center justify-between pt-5">
                  <span className="text-sm text-gray-700">Active / Visible</span>
                  <button
                    type="button"
                    onClick={() => setEditing(p => ({ ...p, is_active: !p.is_active }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${editing.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline-green">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Create Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
