import type { Metadata } from 'next'
import { Nunito, Open_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import SchoolJsonLd from '@/components/SchoolJsonLd'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hamizak.com.ng'),
  title: {
    default: 'Hamizak Montessori Academy | Abuja, Nigeria',
    template: '%s | Hamizak Montessori Academy',
  },
  description:
    'Hamizak Montessori Academy — Discipline, Integrity & Excellence. Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja. Call 08032253811.',
  keywords: [
    'Hamizak Montessori Academy',
    'montessori school abuja',
    'nursery school abuja',
    'primary school abuja',
    'airport road school abuja',
    'sabon lugbe school',
    'best school in abuja',
    'HMA abuja',
    'private school nigeria',
    'early childhood education abuja',
    'creche abuja',
    'hamizak',
  ],
  authors: [{ name: 'Hamizak Montessori Academy' }],
  creator: 'Hamizak Montessori Academy',
  publisher: 'Hamizak Montessori Academy',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: '/images/hma-logo.jpg', apple: '/images/hma-logo.jpg' },
  openGraph: {
    title: 'Hamizak Montessori Academy | Abuja, Nigeria',
    description: 'Discipline, Integrity & Excellence — Where every child blooms. Nurturing independent learners from Creche to High School in Sabon Lugbe, Abuja.',
    type: 'website',
    url: 'https://hamizak.com.ng',
    siteName: 'Hamizak Montessori Academy',
    locale: 'en_NG',
    images: [{ url: '/images/school-building-main.jpg', width: 1200, height: 630, alt: 'Hamizak Montessori Academy Campus' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamizak Montessori Academy | Abuja, Nigeria',
    description: 'Discipline, Integrity & Excellence — Where every child blooms.',
    images: ['/images/school-building-main.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${openSans.variable}`}>
      <body className="font-body antialiased bg-white text-gray-900">
        <SchoolJsonLd />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-body)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#2D6A4F', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
