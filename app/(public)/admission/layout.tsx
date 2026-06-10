import type { Metadata } from 'next'

// Admission page metadata lives here because the page itself is 'use client'
// and client components cannot export metadata in Next.js App Router.
export const metadata: Metadata = {
  title: 'Apply for Admission \u2014 Enrol Your Child at Hamizak Montessori',
  description:
    'Apply online for admission to Hamizak Montessori Academy in Abuja. Our simple 4-step form for Creche, Nursery, and Primary School enrolment. Accepting applications for the 2024/2025 academic session.',
  keywords: [
    'hamizak montessori admission',
    'apply montessori school abuja',
    'school enrolment abuja',
    'nursery admission abuja 2024',
    'primary school admission abuja',
    'creche enrolment abuja',
    'montessori application form nigeria',
  ],
  alternates: { canonical: 'https://hamizak.com.ng/admission' },
  openGraph: {
    title: 'Apply for Admission | Hamizak Montessori Academy Abuja',
    description:
      'Start your child\u2019s Montessori journey. Apply online in minutes \u2014 Creche, Nursery & Primary. Sabon Lugbe, Airport Road, Abuja.',
    url: 'https://hamizak.com.ng/admission',
    images: [
      {
        url: '/images/school-building-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Hamizak Montessori Academy Admission \u2014 Abuja',
      },
    ],
  },
}

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
