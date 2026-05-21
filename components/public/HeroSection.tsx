'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { SiteSettings } from '@/types'

const schoolImages = [
  { src: '/images/school-building-main.jpg', label: 'Main Campus Facade' },
  { src: '/images/school-building-colorful.jpg', label: 'Vibrant Campus Environment' },
  { src: '/images/playground.jpg', label: 'Modern Kids Playground' },
  { src: '/images/library.jpg', label: 'Well-Stocked School Library' },
  { src: '/images/swimming-pool.jpg', label: 'State-of-the-Art Swimming Pool' },
  { src: '/images/computer-lab.jpg', label: 'Advanced ICT Computer Lab' },
  { src: '/images/montessori-materials.jpg', label: 'Montessori Practical Learning' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

interface Props { settings: SiteSettings | null }

export default function HeroSection({ settings }: Props) {
  const headline = settings?.hero_headline ?? "Nurturing Independent Learners for a Bright Future"
  const subtitle  = settings?.hero_subtitle  ?? "Welcome to Hamizak Montessori Academy — Where Every Child Blooms"

  const [[page, direction], setPage] = useState([0, 0])
  const currentIndex = ((page % schoolImages.length) + schoolImages.length) % schoolImages.length

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 4500)
    return () => clearInterval(timer)
  }, [page])

  const handleNext = () => paginate(1)
  const handlePrev = () => paginate(-1)

  return (
    <section 
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >

      {/* Background image */}
      <Image
        src={settings?.hero_image_url || '/images/school-building-main.jpg'}
        alt="Hamizak Montessori Academy"
        fill
        className="object-cover opacity-20 scale-105"
        priority
      />

      {/* Decorative glass elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-20 bottom-1/4 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl" />
        <div className="absolute left-1/4 -bottom-10 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">

        {/* Text content */}
        <motion.div
          className="lg:col-span-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge row */}
          <motion.div variants={fadeUp} className="flex items-center gap-5 mb-8">
            <div className="shrink-0 p-1.5 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
              <Image
                src="/images/hma-logo.jpg"
                alt="HMA Logo"
                width={64}
                height={64}
                className="rounded-xl object-contain"
              />
            </div>
            <div>
              <span className="inline-block bg-teal-500/20 border border-teal-500/30 text-teal-300
                         text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                Abuja&apos;s Premier Montessori School
              </span>
              <p className="text-white/40 text-[9px] mt-1.5 tracking-[0.2em] uppercase font-black">
                Discipline · Integrity · Excellence
              </p>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
          >
            {headline.includes('Independent') ? (
              <>
                Nurturing{' '}
                <span className="text-teal-400">Independent</span>
                <br />Learners for a Future
              </>
            ) : headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl font-medium"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
            <Link href="/admission" className="btn-primary !px-8 !py-4 text-base shadow-xl shadow-teal-900/40 inline-flex items-center gap-3 group">
              {settings?.hero_cta_primary ?? 'Enroll Now'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl border-2 border-white/10 text-white font-bold hover:bg-white/5 transition-all inline-flex items-center gap-2">
              {settings?.hero_cta_secondary ?? 'Book a School Tour'}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-6 border-t border-white/5 pt-10">
            {[settings?.phone1 ?? '08032253811', settings?.phone2 ?? '08062418351'].map((p) => (
              <a
                key={p}
                href={`tel:${p}`}
                className="flex items-center gap-2.5 text-white/60 hover:text-white text-sm font-semibold transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                {p}
              </a>
            ))}
            <div className="flex items-center gap-2.5 text-white/60 text-sm font-semibold group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              Sabon Lugbe, Abuja
            </div>
          </motion.div>
        </motion.div>

        {/* School Showcase Slideshow */}
        <motion.div
          className="lg:col-span-2 w-full max-w-lg lg:max-w-none mx-auto shrink-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] shadow-2xl">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={schoolImages[currentIndex].src}
                    alt={schoolImages[currentIndex].label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 hover:bg-teal-500/80 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 hover:bg-teal-500/80 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Floating Caption / Label */}
              <div className="absolute bottom-4 left-6 right-6 z-10">
                <span className="inline-block bg-teal-500/80 backdrop-blur-sm text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  School Facility
                </span>
                <h4 className="text-white text-base font-bold leading-tight">
                  {schoolImages[currentIndex].label}
                </h4>
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {schoolImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const diff = index - currentIndex
                    if (diff !== 0) {
                      paginate(diff)
                    }
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-6 bg-teal-400' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 lg:h-20">
          <path d="M0 80C240 26.6667 480 0 720 0C960 0 1200 26.6667 1440 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
