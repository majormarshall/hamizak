import { getPrograms, getWhyChooseFeatures } from '@/lib/actions'
import Image from 'next/image'
import ProgramsSection from '@/components/public/ProgramsSection'
import WhyChooseSection from '@/components/public/WhyChooseSection'
import Link from 'next/link'

export const metadata = {
  title: 'Our Programs — Creche, Nursery & Primary School',
  description: 'Explore Hamizak Montessori Academy\'s programs — Toddler Community (18mo-3yrs), Children\'s House Nursery (3-6yrs), and Elementary Primary School (6-12yrs). Authentic Montessori education in Abuja, Nigeria.',
  keywords: ['montessori programs abuja', 'creche abuja', 'nursery school abuja', 'primary school abuja', 'elementary school abuja', 'toddler programs nigeria', 'montessori curriculum FCT'],
  alternates: { canonical: 'https://hamizak.com.ng/programs' },
  openGraph: {
    title: 'Montessori Programs | Hamizak Montessori Academy Abuja',
    description: 'From Creche to Elementary — our age-specific Montessori programs guide every child through discovery and independent learning.',
    url: 'https://hamizak.com.ng/programs',
    images: [{ url: '/images/robotics-class.jpg', width: 1200, height: 630, alt: 'Montessori Programs at HMA Abuja' }],
  },
}

export default async function ProgramsPage() {
  const [programs, features] = await Promise.all([getPrograms(), getWhyChooseFeatures()])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section 
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 scale-110">
          <Image src="/images/robotics-class.jpg" alt="" fill className="object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-teal-900/40" />

        <div className="relative z-10">
          <div className="shrink-0 p-1 bg-white/10 rounded-2xl border border-white/20 shadow-2xl inline-block mb-8">
            <Image
              src="/images/hma-logo.jpg"
              alt="HMA"
              width={72}
              height={72}
              className="rounded-xl object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">Our Curriculum</span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            Montessori at Every Stage
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Carefully designed programs that meet children exactly where they are
            and guide them toward their fullest potential through discovery and play.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link href="/admission" className="btn-primary !px-8 !py-4 shadow-xl shadow-teal-900/20">Apply for Admission</Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl border-2 border-white/10 text-white font-bold hover:bg-white/5 transition-all">Book a Campus Tour</Link>
          </div>
        </div>
      </section>

      <ProgramsSection programs={programs} />
      <WhyChooseSection features={features} />

      {/* CTA Banner */}
      <section className="bg-slate-50 py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="section-title">
            Ready to Begin Your Child&apos;s Journey?
          </h2>
          <p className="section-subtitle mx-auto text-center mb-10">
            Spaces are limited — apply today to secure your child&apos;s place for the upcoming academic session.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admission" className="btn-primary !px-10 !py-4 shadow-xl shadow-teal-900/20">Start Application</Link>
            <Link href="/contact"   className="px-10 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-white transition-all">Ask a Question</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
