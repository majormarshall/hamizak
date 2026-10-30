import HeroSection from '@/components/public/HeroSection'
import ProgramsSection from '@/components/public/ProgramsSection'
import WhyChooseSection from '@/components/public/WhyChooseSection'
import CoreValuesSection from '@/components/public/CoreValuesSection'
import TeamSection from '@/components/public/TeamSection'
import EventsSection from '@/components/public/EventsSection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import AdmissionPreviewSection from '@/components/public/AdmissionPreviewSection'
import ContactSection from '@/components/public/ContactSection'

import {
  getSiteSettings,
  getPrograms,
  getStaff,
  getTestimonials,
  getCoreValues,
  getWhyChooseFeatures,
  getAdmissionSteps,
  getEvents,
  getGalleryAlbums,
} from '@/lib/actions'

export const revalidate = 60

export default async function HomePage() {
  const [settings, programs, staff, testimonials, values, features, steps, events, albums] = await Promise.all([
    getSiteSettings(),
    getPrograms(),
    getStaff(),
    getTestimonials(),
    getCoreValues(),
    getWhyChooseFeatures(),
    getAdmissionSteps(),
    getEvents(false),
    getGalleryAlbums(),
  ])

  return (
    <>
      <HeroSection settings={settings} albums={albums} />
      <ProgramsSection programs={programs} />
      <WhyChooseSection features={features} />
      <CoreValuesSection values={values} />
      <TeamSection staff={staff} />
      <EventsSection events={events} />
      <TestimonialsSection testimonials={testimonials} />
      <AdmissionPreviewSection steps={steps} />
      <ContactSection settings={settings} />
    </>
  )
}
