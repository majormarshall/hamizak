import { getSiteSettings, getAdmins } from '@/lib/actions'
import SettingsForm from '@/components/admin/SettingsForm'
import { createClient } from '@/lib/supabase/server'

export default async function AdminSettingsPage() {
  const [settings, admins] = await Promise.all([
    getSiteSettings(),
    getAdmins()
  ])
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <SettingsForm settings={settings} admins={admins} currentUserEmail={user?.email || null} />
}
