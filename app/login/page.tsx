'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Mail, Lock, Loader2, ArrowLeft, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'

type Mode = 'login' | 'forgot' | 'forgot-sent'

export default function AdminLoginPage() {
  const [mode, setMode]         = useState<Mode>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const supabase = createClient()

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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/login&type=recovery`,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setMode('forgot-sent')
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
        {/* Card */}
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
              <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
                {mode === 'login' ? 'Admin Login' : mode === 'forgot' ? 'Reset Password' : 'Check Your Email'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Hamizak Montessori Academy</p>
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
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl
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
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-slate-500 text-sm text-center -mt-4 mb-2">
                  Enter your admin email and we&apos;ll send a password reset link.
                </p>

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
                  className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </form>
            )}

            {/* ── EMAIL SENT CONFIRMATION ── */}
            {mode === 'forgot-sent' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                    <KeyRound className="w-8 h-8 text-teal-600" />
                  </div>
                </div>
                <p className="text-slate-700 text-sm font-medium">
                  A password reset link has been sent to:
                </p>
                <p className="text-teal-600 font-bold text-sm break-all">{email}</p>
                <p className="text-slate-400 text-xs">
                  Check your inbox (and spam folder). The link expires in 1 hour.
                </p>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setEmail(''); setPassword('') }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl
                             border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
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
