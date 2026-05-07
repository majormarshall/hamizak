import { getSubscribers } from '@/lib/actions'
import SubscribersManager from '@/components/admin/SubscribersManager'

export default async function AdminSubscribersPage() {
  const subs = await getSubscribers()

  return <SubscribersManager initial={subs} />
}
