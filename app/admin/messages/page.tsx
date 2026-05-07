import { getContactMessages } from '@/lib/actions'
import MessagesManager from '@/components/admin/MessagesManager'

export default async function AdminMessagesPage() {
  const msgs = await getContactMessages()

  return <MessagesManager initial={msgs} />
}
