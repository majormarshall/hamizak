'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Plus, Trash2, Upload, X, FolderOpen, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { upsertAlbum, addGalleryImages, deleteGalleryImage } from '@/lib/actions'
import { uploadImage } from '@/lib/utils'
import type { GalleryAlbum, GalleryImage } from '@/types'

interface Props { initial: GalleryAlbum[] }

export default function GalleryManager({ initial }: Props) {
  const [albums, setAlbums]         = useState<GalleryAlbum[]>(initial)
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(albums[0] ?? null)
  const [newAlbumModal, setNewAlbumModal] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const [uploading, setUploading]   = useState(false)
  const [creatingAlbum, setCreatingAlbum] = useState(false)

  const images = activeAlbum?.images ?? []

  const onDrop = useCallback(async (files: File[]) => {
    if (!activeAlbum) return toast.error('Please select or create an album first.')
    setUploading(true)
    try {
      const uploaded: Partial<GalleryImage>[] = []
      for (const file of files) {
        const url = await uploadImage(file, 'media', `gallery/${activeAlbum.id}`)
        uploaded.push({ album_id: activeAlbum.id, url, caption: '', display_order: images.length + uploaded.length })
      }
      await addGalleryImages(uploaded)
      toast.success(`${uploaded.length} photo${uploaded.length > 1 ? 's' : ''} uploaded!`)
      // Update local state
      setAlbums(prev => prev.map(a =>
        a.id === activeAlbum.id
          ? { ...a, images: [...(a.images ?? []), ...uploaded as GalleryImage[]] }
          : a
      ))
      setActiveAlbum(prev => prev ? { ...prev, images: [...(prev.images ?? []), ...uploaded as GalleryImage[]] } : prev)
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }, [activeAlbum, images.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  async function createAlbum() {
    if (!newAlbumTitle.trim()) return
    setCreatingAlbum(true)
    try {
      await upsertAlbum({ title: newAlbumTitle, display_order: albums.length, is_active: true })
      toast.success('Album created!')
      setNewAlbumTitle('')
      setNewAlbumModal(false)
    } catch {
      toast.error('Failed to create album.')
    } finally {
      setCreatingAlbum(false)
    }
  }

  async function handleDeleteImage(id: string) {
    if (!confirm('Delete this photo?')) return
    try {
      await deleteGalleryImage(id)
      setAlbums(prev => prev.map(a =>
        a.id === activeAlbum?.id ? { ...a, images: (a.images ?? []).filter(i => i.id !== id) } : a
      ))
      setActiveAlbum(prev => prev ? { ...prev, images: (prev.images ?? []).filter(i => i.id !== id) } : prev)
      toast.success('Photo deleted.')
    } catch {
      toast.error('Delete failed.')
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Album sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="admin-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-heading font-bold text-sm text-gray-900">Albums</p>
            <button
              onClick={() => setNewAlbumModal(true)}
              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {albums.length === 0 && (
              <p className="text-xs text-gray-400 p-3 text-center">No albums yet.</p>
            )}
            {albums.map(album => (
              <button
                key={album.id}
                onClick={() => setActiveAlbum(album)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition ${
                  activeAlbum?.id === album.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FolderOpen className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{album.title}</span>
                <span className={`text-xs ${activeAlbum?.id === album.id ? 'text-green-200' : 'text-gray-400'}`}>
                  {album.images?.length ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1">
        {activeAlbum ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-gray-900">{activeAlbum.title}</h2>
                <p className="text-gray-500 text-sm">{images.length} photo{images.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer mb-6 transition-all ${
                isDragActive
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                  <p className="text-green-600 font-medium">Uploading photos…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    {isDragActive ? 'Drop photos here!' : 'Drag & drop photos, or click to browse'}
                  </p>
                  <p className="text-gray-400 text-xs">JPG, PNG, WebP — max 5MB each</p>
                </div>
              )}
            </div>

            {/* Photos grid */}
            {images.length === 0 ? (
              <div className="admin-card text-center py-14 text-gray-400">
                <p className="text-4xl mb-3">🖼</p>
                <p>No photos yet. Upload some above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {images.map(img => (
                  <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="opacity-0 group-hover:opacity-100 transition p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1.5 text-center truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="admin-card text-center py-20 text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Create an album to get started</p>
            <button onClick={() => setNewAlbumModal(true)} className="btn-primary mt-4 text-sm">
              Create First Album
            </button>
          </div>
        )}
      </div>

      {/* New album modal */}
      {newAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-gray-900">New Album</h3>
              <button onClick={() => setNewAlbumModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="form-label">Album Title</label>
            <input
              className="form-input mb-4"
              value={newAlbumTitle}
              onChange={e => setNewAlbumTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createAlbum()}
              placeholder="e.g. Sports Day 2025"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setNewAlbumModal(false)} className="btn-outline-green text-sm">Cancel</button>
              <button onClick={createAlbum} disabled={creatingAlbum} className="btn-primary text-sm flex items-center gap-2">
                {creatingAlbum && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
