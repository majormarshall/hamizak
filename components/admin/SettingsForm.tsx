'use client'

import { useState } from 'react'
import { Save, Upload, Loader2, Users, Trash2, Plus, ShieldCheck, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateSiteSettings, addAdmin, removeAdmin } from '@/lib/actions'
import { uploadImage } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const SUPER_ADMIN_EMAILS = ['alaminoseni22@gmail.com', 'hussainyusuf393@gmail.com']

interface Props {
  settings: SiteSettings | null
  admins: { email: string; role: string }[]
  currentUserEmail: string | null
}

export default function SettingsForm({ settings, admins, currentUserEmail }: Props) {
  const [data, setData] = useState<Partial<SiteSettings>>(settings ?? {})
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [maintenanceSaving, setMaintenanceSaving] = useState(false)

  // Admin Management State
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [adminActionLoading, setAdminActionLoading] = useState(false)

  const isSuperAdmin = !!currentUserEmail && SUPER_ADMIN_EMAILS.includes(currentUserEmail)

  function set(key: keyof SiteSettings, value: unknown) {
    setData(d => ({ ...d, [key]: value }))
  }

  async function handleMaintenanceToggle() {
    const newValue = !data.maintenance_mode
    setData(d => ({ ...d, maintenance_mode: newValue }))
    setMaintenanceSaving(true)
    try {
      await updateSiteSettings({ maintenance_mode: newValue })
      toast.success(
        newValue ? '🚧 Maintenance mode is now ON' : '✅ Maintenance mode is now OFF',
        { duration: 3000 }
      )
    } catch (err) {
      // Revert on failure
      setData(d => ({ ...d, maintenance_mode: !newValue }))
      toast.error('Failed to update maintenance mode')
      console.error(err)
    } finally {
      setMaintenanceSaving(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      let updates = { ...data }
      if (logoFile) {
        const url = await uploadImage(logoFile, 'media', 'logos')
        updates = { ...updates, logo_url: url }
      }
      await updateSiteSettings(updates)
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!newAdminEmail) return
    setAdminActionLoading(true)
    try {
      await addAdmin(newAdminEmail)
      setNewAdminEmail('')
      toast.success('Admin added successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to add admin')
    } finally {
      setAdminActionLoading(false)
    }
  }

  async function handleRemoveAdmin(email: string) {
    if (SUPER_ADMIN_EMAILS.includes(email)) {
      toast.error('Cannot remove a Super Admin')
      return
    }
    if (!confirm(`Are you sure you want to remove ${email}?`)) return
    
    setAdminActionLoading(true)
    try {
      await removeAdmin(email)
      toast.success('Admin removed')
    } catch (err) {
      toast.error('Failed to remove admin')
    } finally {
      setAdminActionLoading(false)
    }
  }

  const Section = ({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
      <h3 className="font-bold text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100">{title}</h3>
      <div className={fullWidth ? 'space-y-4' : 'grid sm:grid-cols-2 gap-4'}>{children}</div>
    </div>
  )

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string; field: keyof SiteSettings; type?: string; placeholder?: string
  }) => (
    <div>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        value={String(data[field] ?? '')}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  const Toggle = ({ label, field }: { label: string; field: keyof SiteSettings }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => set(field, !data[field])}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${data[field] ? 'bg-teal-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${data[field] ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="admin-section-label">System</p>
          <h1 className="text-xl font-bold text-slate-900">Site Settings</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="School Information">
            <Field label="School Name"   field="school_name" />
            <Field label="Email Address" field="email" type="email" />
            <Field label="Phone 1"       field="phone1" />
            <Field label="Phone 2"       field="phone2" />
            <Field label="WhatsApp"      field="whatsapp" placeholder="2348032253811" />
            <div className="sm:col-span-2">
              <Field label="Address"     field="address" />
            </div>
          </Section>

          <Section title="Hero Section">
            <div className="sm:col-span-2">
              <Field label="Headline"   field="hero_headline" />
            </div>
            <div className="sm:col-span-2">
              <Field label="Subtitle"   field="hero_subtitle" />
            </div>
            <Field label="Primary CTA Button"   field="hero_cta_primary" placeholder="Enroll Now" />
            <Field label="Secondary CTA Button" field="hero_cta_secondary" placeholder="Book a Tour" />
          </Section>

          <Section title="Announcement Banner">
            <div className="sm:col-span-2">
              <Field label="Announcement Text" field="announcement_text" placeholder="New admission cycle open…" />
            </div>
            <Field label="Banner Color" field="announcement_color" type="color" />
            <div className="pt-2">
              <Toggle label="Show Announcement Banner" field="announcement_enabled" />
            </div>
          </Section>

          <Section title="Social Media">
            <Field label="Facebook URL"  field="facebook_url" />
            <Field label="Instagram URL" field="instagram_url" />
            <Field label="Twitter / X URL" field="twitter_url" />
            <Field label="YouTube URL"   field="youtube_url" />
          </Section>
        </div>

        <div className="space-y-6">
          {/* Admin Management Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Authorized Personnel</h3>
              </div>
              {isSuperAdmin && (
                <div className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[9px] font-black uppercase tracking-wider rounded-full ring-1 ring-teal-100">
                  Super User
                </div>
              )}
            </div>

            <div className="space-y-4">
              <form onSubmit={handleAddAdmin} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Add admin email…"
                  className="form-input text-sm"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={adminActionLoading}
                  className="bg-teal-600 text-white px-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors shrink-0"
                >
                  {adminActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {admins.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 italic">No additional admins</p>
                )}
                {admins.map(admin => (
                  <div key={admin.email} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center text-[10px] font-black text-teal-700 shrink-0">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">{admin.email}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">{admin.role}</p>
                      </div>
                    </div>
                    {!SUPER_ADMIN_EMAILS.includes(admin.email) && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.email)}
                        disabled={adminActionLoading}
                        className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <div className="flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-teal-700 font-medium leading-snug">
                    Only users on this list can access the admin dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100">Logo &amp; Branding</h3>
            <div className="flex flex-col items-center gap-4">
              {data.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logo_url} alt="Logo" className="w-24 h-24 object-contain rounded-2xl border border-slate-100 p-2 bg-slate-50" />
              )}
              <label className="btn-outline-green flex items-center justify-center gap-2 cursor-pointer w-full">
                <Upload className="w-3.5 h-3.5" />
                Upload Logo
                <input type="file" accept="image/*" className="hidden"
                       onChange={e => { const f = e.target.files?.[0]; if (f) setLogoFile(f) }} />
              </label>
              {logoFile && <span className="text-xs text-teal-600 font-semibold">New logo ready to save</span>}
            </div>
          </div>

          <div className={`rounded-2xl border shadow-sm p-6 transition-colors duration-300 ${
            data.maintenance_mode
              ? 'bg-red-50 border-red-200'
              : 'bg-white border-slate-100'
          }`}>
            <h3 className="font-bold text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100">Site Toggles</h3>
            <div className="divide-y divide-slate-100 space-y-1">
              <Toggle label="Online Applications Open" field="applications_open" />

              {/* ── Maintenance Mode — instant save ── */}
              <div className="pt-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">Maintenance Mode</span>
                    {data.maintenance_mode && (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleMaintenanceToggle}
                    disabled={maintenanceSaving}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 disabled:opacity-70 ${
                      data.maintenance_mode ? 'bg-red-500' : 'bg-slate-200'
                    }`}
                  >
                    {maintenanceSaving ? (
                      <Loader2 className="absolute top-1 left-1 w-4 h-4 text-white animate-spin" />
                    ) : (
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        data.maintenance_mode ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    )}
                  </button>
                </div>
                {data.maintenance_mode && (
                  <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    The public site is showing a maintenance page right now.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
