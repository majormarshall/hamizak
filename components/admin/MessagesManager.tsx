'use client'

import { useState } from 'react'
import { markMessageRead, deleteMessage, replyToMessage } from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'
import { Mail, X, Send, CheckCheck } from 'lucide-react'

interface Props { initial: ContactMessage[] }

export default function MessagesManager({ initial }: Props) {
  const [msgs, setMsgs] = useState<ContactMessage[]>(initial)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending] = useState(false)

  const unread = msgs.filter(m => !m.is_read).length

  // Open the message detail / reply modal
  function openMessage(m: ContactMessage) {
    setSelected(m)
    setReplySubject(`Re: ${m.subject || '(No subject)'}`)
    setReplyBody('')
    setReplyOpen(false)

    // Auto-mark as read when opened
    if (!m.is_read) handleMarkRead(m.id)
  }

  function closeModal() {
    setSelected(null)
    setReplyOpen(false)
  }

  async function handleMarkRead(id: string) {
    try {
      await markMessageRead(id)
      setMsgs(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
    } catch { /* silent */ }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMessage(id)
      setMsgs(prev => prev.filter(m => m.id !== id))
      if (selected?.id === id) closeModal()
      toast.success('Message deleted')
    } catch { toast.error('Delete failed') }
  }

  async function handleSendReply() {
    if (!selected || !replyBody.trim()) {
      toast.error('Reply body cannot be empty')
      return
    }
    setSending(true)
    try {
      await replyToMessage(selected.id, selected.email, replySubject, replyBody)
      setMsgs(prev => prev.map(m => m.id === selected.id ? { ...m, is_read: true } : m))
      toast.success(`Reply sent to ${selected.email}`)
      setReplyOpen(false)
      setReplyBody('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reply'
      toast.error(msg)
    } finally {
      setSending(false)
    }
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
            <button
              onClick={() => openMessage(m)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              View & Reply
            </button>
            {!m.is_read && (
              <button
                onClick={() => handleMarkRead(m.id).then(() =>
                  toast.success('Marked as read')
                )}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark Read
              </button>
            )}
          </div>
        )}
      />

      {/* ── Message Detail + Reply Modal ─────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {selected.subject || '(No subject)'}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium">{selected.name}</span>
                  <span className="text-slate-300">·</span>
                  <a href={`mailto:${selected.email}`} className="text-xs text-teal-600 hover:underline">
                    {selected.email}
                  </a>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{formatDate(selected.created_at)}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original Message */}
            <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border-b border-slate-100">
              {selected.message}
            </div>

            {/* Reply Section */}
            {replyOpen ? (
              <div className="px-6 py-4 space-y-3 border-t border-slate-100 bg-slate-50/40">
                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={e => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none
                               focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    placeholder={`Dear ${selected.name},\n\nThank you for reaching out...`}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none
                               focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    Sending to <strong className="text-slate-600">{selected.email}</strong>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplyOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={sending || !replyBody.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600
                                 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sending ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Reply Toggle */
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Replying to <strong className="text-slate-600">{selected.email}</strong>
                </p>
                <button
                  onClick={() => setReplyOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white
                             bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
