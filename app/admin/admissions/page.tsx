import { getApplications } from '@/lib/actions'
import AdmissionsManager from '@/components/admin/AdmissionsManager'

export default async function AdminAdmissionsPage() {
  const apps = await getApplications()

  return <AdmissionsManager initial={apps} />
}
