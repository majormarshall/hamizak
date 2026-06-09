import ContactSection from '@/components/public/ContactSection'
import { getSiteSettings } from '@/lib/actions'
import Image from 'next/image'

export const metadata = {
  title: 'Contact Us',
  description: 'Contact Hamizak Montessori Academy in Sabon Lugbe, Airport Road, Abuja. Call 08032253811 or send us a message. Schedule a campus tour today.',
  keywords: ['contact hamizak', 'montessori school abuja contact', 'sabon lugbe school phone number', 'hamizak montessori phone'],
  openGraph: {
    title: 'Contact Hamizak Montessori Academy | Abuja',
    description: 'Get in touch with us at Sabon Lugbe, Airport Road, Abuja. Call 08032253811 to schedule a visit.',
    url: 'https://hamizak.com.ng/contact',
  },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return (
    <div>
      <section 
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 scale-110">
          <Image src="/images/school-building-main.jpg" alt="" fill className="object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-teal-900/40" />

        <div className="relative z-10">
          <div className="shrink-0 p-1 bg-white/10 rounded-2xl border border-white/20 shadow-2xl inline-block mb-6">
            <Image
              src="/images/hma-logo.jpg"
              alt="HMA"
              width={72}
              height={72}
              className="rounded-xl object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">Get in Touch</span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight">Contact Us</h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-medium">
            We&apos;d love to hear from you. Reach out with any questions or to schedule a school visit.
          </p>
        </div>
      </section>
      <ContactSection settings={settings} />
    </div>
  )
}
