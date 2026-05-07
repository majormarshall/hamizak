import { getGalleryAlbums } from '@/lib/actions'
import GalleryManager from '@/components/admin/GalleryManager'

export default async function AdminGalleryPage() {
  const albums = await getGalleryAlbums()
  return (
    <div className="space-y-6">
      <div>
        <p className="admin-section-label">Content</p>
        <h1 className="text-xl font-bold text-slate-900">Gallery</h1>
        <p className="text-sm text-slate-500 mt-1">Create albums and upload photos. Drag and drop supported.</p>
      </div>
      <GalleryManager initial={albums} />
    </div>
  )
}
