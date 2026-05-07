'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryAlbum, GalleryImage } from '@/types'

interface Props { albums: GalleryAlbum[] }

export default function GalleryGrid({ albums }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeAlbum, setActiveAlbum] = useState<string | 'all'>('all')

  const allImages: GalleryImage[] = albums.flatMap(a => a.images ?? [])
  const filtered = activeAlbum === 'all'
    ? allImages
    : albums.find(a => a.id === activeAlbum)?.images ?? []

  const slides = filtered.map(img => ({ src: img.url, alt: img.caption }))

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section className="py-20 bg-white" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="section-label">Gallery</span>
          <h2 className="section-title">Life at Hamizak</h2>
          <p className="section-subtitle mx-auto text-center">
            A glimpse into our vibrant, joyful learning community.
          </p>
        </div>

        {/* Album filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveAlbum('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeAlbum === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            All Photos ({allImages.length})
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeAlbum === album.id
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {album.title} ({album.images?.length ?? 0})
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🖼</p>
            <p>No photos in this album yet.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                className="break-inside-avoid cursor-pointer group rounded-xl overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.05 }}
                onClick={() => openLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent
                                  p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{img.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </section>
  )
}
