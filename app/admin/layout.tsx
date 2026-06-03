import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

const SUPER_ADMINS = ['kalibest10@gmail.com', 'hussainyusuf393@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Auth check failed:', error)
  }

  if (!user) redirect('/login')

  // ── Authorization: check if this user is an approved admin ──────────────
  // This runs in Node.js runtime so no edge timeout risk
  const email = user.email ?? ''
  if (!SUPER_ADMINS.includes(email)) {
    const adminSupabase = createAdminClient()
    const { data: isAdmin } = await adminSupabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (!isAdmin) redirect('/login?error=unauthorized')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
