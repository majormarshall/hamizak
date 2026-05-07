import { getStaff } from '@/lib/actions'
import TeamManager from '@/components/admin/TeamManager'

export default async function AdminTeamPage() {
  const staff = await getStaff(false)
  return <TeamManager initial={staff} />
}
