import { getGalleryAlbums } from '@/lib/actions'
import Image from 'next/image'
import GalleryGrid from '@/components/public/GalleryGrid'

export const metadata = {
  title: 'School Gallery',
  description: 'View photos from Hamizak Montessori Academy — our campus, classrooms, events, sports, and student activities in Abuja, Nigeria.',
  keywords: ['hamizak school photos', 'montessori school gallery abuja', 'HMA campus photos'],
  openGraph: {
    title: 'Gallery | Hamizak Montessori Academy Abuja',
    description: 'A window into life at HMA — vibrant classrooms, events, and a joyful community of learners.',
    url: 'https://hamizak.com.ng/gallery',
  },
}

export default async function GalleryPage() {
  const albums = await getGalleryAlbums()
  return (
    <div>
      <section 
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 scale-110">
          <Image src="/images/music-violin.jpg" alt="" fill className="object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-teal-900/40" />

        <div className="relative z-10">
          <div className="shrink-0 p-1 bg-white/10 rounded-2xl border border-white/20 shadow-2xl inline-block mb-6">
            <Image
              src="/images/hma-logo.jpg"
              alt="HMA"
              width={64}
              height={64}
              className="rounded-xl object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">Our Gallery</span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight">Life at HMA</h1>
          <p className="text-white/60 max-w-lg mx-auto font-medium text-lg">A window into our vibrant, joyful community of learners.</p>
        </div>
      </section>
      <GalleryGrid albums={albums} />
    </div>
  )
}
