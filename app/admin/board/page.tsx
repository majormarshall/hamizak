// Server component — fetches all board members on every load
import { getBoardMembers } from '@/lib/actions'
import BoardManager from './BoardManager'

export const dynamic = 'force-dynamic'

export default async function AdminBoardPage() {
  const members = await getBoardMembers()
  return <BoardManager initialMembers={members} />
}
