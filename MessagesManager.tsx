'use client'

import { useState } from 'react'
import { markMessageRead, deleteMessage } from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'

interface Props { initial: ContactMessage[] }

export default function MessagesManager({ initial }: Props) {
  const [msgs, setMsgs] = useState<ContactMessage[]>(initial)
  const unread = msgs.filter(m => !m.is_read).length

  async function handleMarkRead(id: string) {
    try {
      await markMessageRead(id)
      setMsgs(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
      toast.success('Message marked as read')
    } catch { toast.error('Action failed') }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMessage(id)
      setMsgs(prev => prev.filter(m => m.id !== id))
      toast.success('Message deleted')
    } catch { toast.error('Delete failed') }
  }

  const columns = [
    {
      key: 'name',
      label: 'From',
      render: (m: ContactMessage) => (
        <div className="flex items-center gap-3">
          {!m.is_read && (
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
          )}
          <div>
            <p className={`leading-tight ${!m.is_read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{m.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (m: ContactMessage) => <span className="text-slate-700">{m.subject || '(No subject)'}</span>,
    },
    {
      key: 'message',
      label: 'Preview',
      render: (m: ContactMessage) => (
        <span className="text-slate-400 truncate block max-w-xs">{m.message}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (m: ContactMessage) => <span className="text-slate-500 tabular-nums">{formatDate(m.created_at)}</span>,
    },
    {
      key: 'is_read',
      label: 'Status',
      render: (m: ContactMessage) => (
        <span className={`badge ${m.is_read ? 'badge-draft' : 'badge-new'}`}>
          {m.is_read ? 'Read' : 'Unread'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="admin-section-label">Enquiries</p>
        <h1 className="text-xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-sm text-slate-500 mt-1">{unread} unread message{unread !== 1 ? 's' : ''}</p>
      </div>

      <AdminTable
        title="All Messages"
        data={msgs}
        columns={columns}
        searchKeys={['name', 'email', 'subject']}
        emptyMessage="No messages yet. Contact form submissions will appear here."
        onDelete={handleDelete}
        actions={(m) => (
          <div className="flex gap-2">
            {!m.is_read && (
              <button
                onClick={() => handleMarkRead(m.id)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold transition-colors"
              >
                Mark Read
              </button>
            )}
          </div>
        )}
      />
    </div>
  )
}
