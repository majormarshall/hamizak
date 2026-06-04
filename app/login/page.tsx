'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

type Mode = 'login' | 'forgot' | 'sent'

export default function AdminLoginPage() {
  const [mode, setMode]         = useState<Mode>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const supabase = createClient()

  // ── Sign in ──────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      window.location.href = '/admin'
    }
  }

  // ── Send password reset email ─────────────────────────────────────────────
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setMode('sent')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      {/* Decorative blur blobs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-green-500" />

          <div className="px-8 pt-8 pb-10">
            {/* Logo & branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-1.5 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 mb-4">
                <Image
                  src="/images/hma-logo.jpg"
                  alt="Hamizak Montessori Academy"
                  width={72}
                  height={72}
                  className="rounded-xl object-contain"
                />
              </div>

              {mode === 'login' && (
                <>
                  <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Admin Login</h1>
                  <p className="text-slate-500 text-sm mt-1">Hamizak Montessori Academy</p>
                </>
              )}
              {mode === 'forgot' && (
                <>
                  <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Reset Password</h1>
                  <p className="text-slate-500 text-sm mt-1 text-center">Enter your email to receive a reset link</p>
                </>
              )}
              {mode === 'sent' && (
                <>
                  <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Check your email</h1>
                  <p className="text-slate-500 text-sm mt-1 text-center">A password reset link has been sent</p>
                </>
              )}

              <p className="text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                Discipline · Integrity · Excellence
              </p>
            </div>

            {/* ── LOGIN FORM ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                 placeholder:text-slate-300 text-slate-900 bg-slate-50/50 transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@hamizak.edu.ng"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                 placeholder:text-slate-300 text-slate-900 bg-slate-50/50 transition-all"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setPassword('') }}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
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
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* ── FORGOT PASSWORD FORM ── */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                 placeholder:text-slate-300 text-slate-900 bg-slate-50/50 transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
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
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                             border border-slate-200 text-slate-600 text-sm font-semibold
                             hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </form>
            )}

            {/* ── EMAIL SENT CONFIRMATION ── */}
            {mode === 'sent' && (
              <div className="text-center space-y-5">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-teal-500" />
                </div>
                <div className="bg-teal-50 rounded-2xl px-6 py-4">
                  <p className="text-teal-800 text-sm font-medium">
                    We sent a reset link to <span className="font-black">{email}</span>.
                    Check your inbox and click the link to set a new password.
                  </p>
                </div>
                <button
                  onClick={() => { setMode('login'); setEmail('') }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                             border border-slate-200 text-slate-600 text-sm font-semibold
                             hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
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
