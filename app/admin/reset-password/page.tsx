'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Loader2, CheckCircle2, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)
  const [userEmail, setUserEmail]   = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email)
      }
    })
  }, [supabase])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
      toast.success('Your password has been changed successfully!')
      setPassword('')
      setConfirm('')
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <p className="admin-section-label">Account Security</p>
        <h1 className="text-xl font-bold text-slate-900">Change Password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the login password for your administrator account.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        {userEmail && (
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl mb-6">
            <div className="h-8 w-8 rounded-lg bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center text-xs font-black text-teal-700 shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Account</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{userEmail}</p>
            </div>
          </div>
        )}

        {done ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto text-teal-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Password Changed Successfully!</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                Your new password is now active. You can use it the next time you sign in.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDone(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Change Again
              </button>
              <Link
                href="/admin"
                className="btn-primary inline-flex items-center gap-2 text-xs font-semibold py-2 px-4"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter min. 6 characters"
                  className="form-input pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  className="form-input pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-semibold text-amber-900">Security Note:</p>
              <p className="text-[11px] leading-relaxed text-amber-700">
                Choose a strong, unique password. Do not share your credentials with unauthorized individuals.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password…
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
