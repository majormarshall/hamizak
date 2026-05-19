'use client'

import { useState } from 'react'
import { Plus, X, Loader2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { upsertTestimonial, deleteTestimonial } from '@/lib/actions'
import AdminTable from '@/components/admin/AdminTable'
import type { Testimonial } from '@/types'

interface Props { initial: Testimonial[] }

const EMPTY: Partial<Testimonial> = {
  parent_name: '', child_program: '', rating: 5, testimonial_text: '', is_approved: false, display_order: 0
}

export default function TestimonialsManager({ initial }: Props) {
  const [items, setItems]   = useState<Testimonial[]>(initial)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<Partial<Testimonial>>(EMPTY)
  const [saving, setSaving] = useState(false)

  function openNew()               { setEditing(EMPTY); setModal(true) }
  function openEdit(t: Testimonial){ setEditing({ ...t }); setModal(true) }

  async function handleSave() {
    if (!editing.parent_name || !editing.testimonial_text) return toast.error('Name and testimonial text are required.')
    setSaving(true)
    try {
      await upsertTestimonial(editing)
      toast.success(editing.id ? 'Testimonial updated!' : 'Testimonial added!')
      setModal(false)
    } catch {
      toast.error('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTestimonial(id)
      setItems(t => t.filter(x => x.id !== id))
      toast.success('Testimonial deleted.')
    } catch {
      toast.error('Delete failed.')
    }
  }

  const columns = [
    {
      key: 'parent_name',
      label: 'Parent',
      sortable: true,
      render: (t: Testimonial) => <span className="font-medium text-gray-900">{t.parent_name}</span>,
    },
    { key: 'child_program', label: 'Program' },
    {
      key: 'rating',
      label: 'Rating',
      render: (t: Testimonial) => (
        <span className="text-yellow-400">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
      ),
    },
    {
      key: 'testimonial_text',
      label: 'Preview',
      render: (t: Testimonial) => (
        <span className="text-xs text-gray-500 block max-w-xs truncate italic">&ldquo;{t.testimonial_text}&rdquo;</span>
      ),
    },
    {
      key: 'is_approved',
      label: 'Status',
      render: (t: Testimonial) => (
        <span className={`badge ${t.is_approved ? 'badge-approved' : 'badge-pending'}`}>
          {t.is_approved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
  ]

  return (
    <>
      <AdminTable
        title="All Testimonials"
        data={items}
        columns={columns}
        searchKeys={['parent_name', 'child_program']}
        emptyMessage="No testimonials yet."
        onEdit={openEdit}
        onDelete={handleDelete}
        addButton={
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        }
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {editing.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="form-label">Parent / Guardian Name *</label>
                <input className="form-input" value={editing.parent_name ?? ''} onChange={e => setEditing(p => ({ ...p, parent_name: e.target.value }))} placeholder="Aisha Mohammed" />
              </div>
              <div>
                <label className="form-label">Child&apos;s Program</label>
                <input className="form-input" value={editing.child_program ?? ''} onChange={e => setEditing(p => ({ ...p, child_program: e.target.value }))} placeholder="Children's House" />
              </div>
              <div>
                <label className="form-label">Star Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditing(p => ({ ...p, rating: n }))}
                      className={`text-2xl transition ${n <= (editing.rating ?? 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Testimonial Text *</label>
                <textarea className="form-input resize-none" rows={4} value={editing.testimonial_text ?? ''} onChange={e => setEditing(p => ({ ...p, testimonial_text: e.target.value }))} placeholder="Parent's testimonial…" />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">Approved / Visible on site</span>
                <button
                  type="button"
                  onClick={() => setEditing(p => ({ ...p, is_approved: !p.is_approved }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.is_approved ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.is_approved ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline-green">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
