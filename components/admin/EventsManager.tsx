'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { upsertEvent, deleteEvent } from '@/lib/actions'
import { slugify, formatDate } from '@/lib/utils'
import AdminTable from '@/components/admin/AdminTable'
import type { EventPost } from '@/types'

interface Props { initial: EventPost[] }

const EMPTY: Partial<EventPost> = {
  title: '', slug: '', content: '', excerpt: '', category: 'news', is_published: false
}

export default function EventsManager({ initial }: Props) {
  const [items, setItems]   = useState<EventPost[]>(initial)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<Partial<EventPost>>(EMPTY)
  const [saving, setSaving] = useState(false)

  function openNew()              { setEditing(EMPTY); setModal(true) }
  function openEdit(e: EventPost) { setEditing({ ...e }); setModal(true) }

  async function handleSave() {
    if (!editing.title) return toast.error('Title is required.')
    setSaving(true)
    try {
      const data = {
        ...editing,
        slug: editing.slug || slugify(editing.title!),
        published_at: editing.is_published && !editing.published_at ? new Date().toISOString() : editing.published_at,
      }
      await upsertEvent(data)
      toast.success(editing.id ? 'Post updated!' : 'Post created!')
      setModal(false)
    } catch {
      toast.error('Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEvent(id)
      setItems(e => e.filter(x => x.id !== id))
      toast.success('Post deleted.')
    } catch {
      toast.error('Delete failed.')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (e: EventPost) => <span className="font-medium text-gray-900">{e.title}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (e: EventPost) => (
        <span className={`badge ${e.category === 'event' ? 'badge-reviewed' : e.category === 'announcement' ? 'badge-pending' : 'badge-draft'}`}>
          {e.category}
        </span>
      ),
    },
    {
      key: 'event_date',
      label: 'Event Date',
      render: (e: EventPost) => e.event_date ? <span>{formatDate(e.event_date)}</span> : <span className="text-gray-400">—</span>,
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (e: EventPost) => (
        <span className={`badge ${e.is_published ? 'badge-published' : 'badge-draft'}`}>
          {e.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (e: EventPost) => formatDate(e.created_at),
    },
  ]

  return (
    <>
      <AdminTable
        title="Events & News Posts"
        data={items}
        columns={columns}
        searchKeys={['title', 'category']}
        emptyMessage="No posts yet. Create your first event or news post!"
        onEdit={openEdit}
        onDelete={handleDelete}
        addButton={
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Post
          </button>
        }
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {editing.id ? 'Edit Post' : 'New Post'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={editing.title ?? ''} onChange={e => setEditing(p => ({
                  ...p, title: e.target.value,
                  slug: p.id ? p.slug : slugify(e.target.value)
                }))} placeholder="Post title…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={editing.category ?? 'news'} onChange={e => setEditing(p => ({ ...p, category: e.target.value as EventPost['category'] }))}>
                    <option value="news">News</option>
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Event Date (if applicable)</label>
                  <input type="date" className="form-input" value={editing.event_date ?? ''} onChange={e => setEditing(p => ({ ...p, event_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Excerpt / Summary</label>
                <textarea className="form-input resize-none" rows={2} value={editing.excerpt ?? ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} placeholder="Short description shown in listings…" />
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea className="form-input resize-none" rows={8} value={editing.content ?? ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))} placeholder="Full post content… (Rich text editor in production)" />
                <p className="text-xs text-gray-400 mt-1">💡 In production this uses TipTap rich text editor</p>
              </div>
              <div>
                <label className="form-label">URL Slug</label>
                <input className="form-input font-mono text-xs" value={editing.slug ?? ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">Publish immediately</span>
                <button
                  type="button"
                  onClick={() => setEditing(p => ({ ...p, is_published: !p.is_published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.is_published ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.is_published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline-green">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
