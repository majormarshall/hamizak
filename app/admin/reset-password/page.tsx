'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Loader2, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
      setTimeout(() => { window.location.href = '/admin' }, 2500)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10">
          <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-green-500" />

          <div className="px-8 pt-8 pb-10">
            <div className="flex flex-col items-center mb-8">
              <div className="p-1.5 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 mb-4">
                <Image
                  src="/images/hma-logo.jpg"
                  alt="HMA"
                  width={72}
                  height={72}
                  className="rounded-xl object-contain"
                />
              </div>
              <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
                {done ? 'Password Updated!' : 'Set New Password'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Hamizak Montessori Academy</p>
            </div>

            {done ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-teal-500 mx-auto" />
                <p className="text-slate-600 text-sm">Your password has been updated. Redirecting to admin…</p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                 placeholder:text-slate-300 text-slate-900 bg-slate-50/50 transition-all"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                 placeholder:text-slate-300 text-slate-900 bg-slate-50/50 transition-all"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm
                             transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-teal-900/30
                             disabled:opacity-60 disabled:translate-y-0"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-white/20 text-[10px] mt-6 font-medium tracking-wider">
          AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  )
}
