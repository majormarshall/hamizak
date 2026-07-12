// Server component — fetches current Supabase photo URLs on every load
import { getBoardPhotos } from '@/lib/actions'
import BoardPhotoManager from './BoardPhotoManager'

export const dynamic = 'force-dynamic'

export default async function AdminBoardPage() {
  // Map of { slug → supabase_url } for all members that have been uploaded
  const supabasePhotos = await getBoardPhotos()
  return <BoardPhotoManager supabasePhotos={supabasePhotos} />
}
