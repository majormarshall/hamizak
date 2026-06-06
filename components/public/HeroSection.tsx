'use client'

import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import type { SiteSettings } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

// School photo slides — swap in real URLs as you upload them to Supabase
const SLIDES = [
  {
    src: '/images/school-building-main.jpg',
    caption: "Our Campus",
    sub: "Sabon Lugbe, Abuja",
  },
  {
    src: '/images/school-building-main.jpg',
    caption: "Learning Environments",
    sub: "Thoughtfully designed spaces",
  },
  {
    src: '/images/school-building-main.jpg',
    caption: "Montessori in Action",
    sub: "Child-led discovery every day",
  },
]

interface Props { settings: SiteSettings | null }

export default function HeroSection({ settings }: Props) {
  const headline = settings?.hero_headline ?? "Nurturing Independent Learners for a Bright Future"
  const subtitle  = settings?.hero_subtitle  ?? "Welcome to Hamizak Montessori Academy — Where Every Child Blooms"

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Auto-play every 4 seconds
  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(id)
  }, [emblaApi])

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24 grid lg:grid-cols-5 gap-16 items-center">

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

        {/* ── Image Slider ── */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
            {/* Carousel viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {SLIDES.map((slide, i) => (
                  <div key={i} className="relative flex-[0_0_100%] aspect-[4/3]">
                    <Image
                      src={slide.src}
                      alt={slide.caption}
                      fill
                      className="object-cover"
                      priority={i === 0}
                    />
                    {/* Slide caption overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
                      <p className="text-white font-bold text-sm leading-tight">{slide.caption}</p>
                      <p className="text-white/60 text-[11px] font-medium mt-0.5">{slide.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-teal-600 border border-white/20 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-teal-600 border border-white/20 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-14 right-4 flex gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white transition-colors"
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Decorative badge */}
            <div className="absolute top-4 right-4 bg-teal-600/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-teal-400/30">
              HMA Campus
            </div>
          </div>

          {/* Tagline below slider */}
          <p className="text-white/40 text-xs text-center mt-4 font-medium tracking-wide">
            Where every child discovers their potential
          </p>
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
