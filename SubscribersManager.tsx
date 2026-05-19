'use client'

import { useState } from 'react'
import { deleteSubscriber } from '@/lib/actions'
import { formatDate } from '@/lib/utils'
import type { NewsletterSubscriber } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import toast from 'react-hot-toast'

interface Props { initial: NewsletterSubscriber[] }

export default function SubscribersManager({ initial }: Props) {
  const [subs, setSubs] = useState<NewsletterSubscriber[]>(initial)

  const columns = [
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
      render: (s: NewsletterSubscriber) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center text-[10px] font-black text-teal-700">
            {s.email.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-slate-900">{s.email}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Subscribed',
      sortable: true,
      render: (s: NewsletterSubscriber) => <span className="text-slate-500 tabular-nums">{formatDate(s.created_at)}</span>,
    },
  ]

  async function handleDelete(id: string) {
    try {
      await deleteSubscriber(id)
      setSubs(s => s.filter(x => x.id !== id))
      toast.success('Subscriber removed')
    } catch { toast.error('Failed to remove subscriber') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="admin-section-label">Enquiries</p>
          <h1 className="text-xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-sm text-slate-500 mt-1">{subs.length} subscriber{subs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn-outline-green">Export CSV</button>
      </div>

      <AdminTable
        title="Subscribers"
        data={subs}
        columns={columns}
        searchKeys={['email']}
        emptyMessage="No subscribers yet."
        onDelete={handleDelete}
      />
    </div>
  )
}
