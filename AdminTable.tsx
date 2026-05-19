'use client'

import { useState } from 'react'
import { Search, Trash2, Edit2, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key:    keyof T | string
  label:  string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

interface Props<T extends { id: string }> {
  data:         T[]
  columns:      Column<T>[]
  onEdit?:      (row: T) => void
  onDelete?:    (id: string) => void
  searchKeys?:  (keyof T)[]
  emptyMessage?: string
  addButton?:   React.ReactNode
  title:        string
  actions?:     (row: T) => React.ReactNode
}

export default function AdminTable<T extends { id: string }>({
  data, columns, onEdit, onDelete, searchKeys, emptyMessage, addButton, title, actions
}: Props<T>) {
  const [query, setQuery]       = useState('')
  const [sortKey, setSortKey]   = useState<string>('')
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = data.filter(row => {
    if (!query || !searchKeys) return true
    return searchKeys.some(k => String(row[k]).toLowerCase().includes(query.toLowerCase()))
  })

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '')
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    : filtered

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  async function handleDelete(id: string) {
    if (!onDelete || !confirm('Are you sure you want to delete this?')) return
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {searchKeys && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none
                           focus:ring-2 focus:ring-teal-400 focus:border-transparent w-40 bg-white
                           placeholder:text-slate-400 transition-all"
                placeholder="Search…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          )}
          {addButton}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-slate-600 select-none transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc'
                        ? <ChevronUp className="w-3 h-3 text-teal-500" />
                        : <ChevronDown className="w-3 h-3 text-teal-500" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || actions) && (
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-slate-400 text-sm">
                  {emptyMessage ?? 'No records found.'}
                </td>
              </tr>
            ) : sorted.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-5 py-3.5 text-slate-700">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                  </td>
                ))}
                {(onEdit || onDelete || actions) && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {actions ? actions(row) : (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(row.id)}
                              disabled={deleting === row.id}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 text-[10px] text-slate-400 font-medium">
          Showing {sorted.length} of {data.length} records
        </div>
      )}
    </div>
  )
}
