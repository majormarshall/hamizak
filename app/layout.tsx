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
    default: 'Hamizak Montessori Academy | Best Montessori School in Abuja, Nigeria',
    template: '%s | Hamizak Montessori Academy',
  },
  description:
    'Hamizak Montessori Academy — Discipline, Integrity & Excellence. Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja. Call 08032253811.',
  keywords: [
    'Hamizak Montessori Academy',
    'montessori school abuja',
    'best school in abuja nigeria',
    'nursery school abuja',
    'primary school abuja',
    'airport road school abuja',
    'sabon lugbe school',
    'HMA abuja',
    'private school nigeria',
    'early childhood education abuja',
    'creche abuja',
    'hamizak',
    'school near airport road abuja',
    'top montessori school FCT',
  ],
  authors: [{ name: 'Hamizak Montessori Academy' }],
  creator: 'Hamizak Montessori Academy',
  publisher: 'Hamizak Montessori Academy',
  category: 'education',
  classification: 'Private Montessori School',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [{ url: '/images/hma-logo.jpg', sizes: '32x32' }, { url: '/images/hma-logo.jpg', sizes: '192x192' }],
    apple: '/images/hma-logo.jpg',
    shortcut: '/images/hma-logo.jpg',
  },
  alternates: {
    canonical: 'https://hamizak.com.ng',
  },
  openGraph: {
    title: 'Hamizak Montessori Academy | Abuja, Nigeria',
    description: 'Discipline, Integrity & Excellence — Where every child blooms. Nurturing independent learners from Creche to High School in Sabon Lugbe, Abuja.',
    type: 'website',
    url: 'https://hamizak.com.ng',
    siteName: 'Hamizak Montessori Academy',
    locale: 'en_NG',
    images: [
      { url: '/images/school-building-main.jpg', width: 1200, height: 630, alt: 'Hamizak Montessori Academy Campus — Sabon Lugbe, Abuja' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamizak Montessori Academy | Abuja, Nigeria',
    description: 'Discipline, Integrity & Excellence — Where every child blooms.',
    images: ['/images/school-building-main.jpg'],
  },
  // Google Search Console verification — replace with your actual verification code
  // verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE', other: { 'msvalidate.01': 'YOUR_BING_CODE' } },
  other: {
    'geo.region': 'NG-FC',
    'geo.placename': 'Abuja',
    'geo.position': '8.9997;7.3886',
    'ICBM': '8.9997, 7.3886',
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

        {/* Powered by Dev Spirit Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.78rem',
          color: '#9ca3af',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-body)',
        }}>
          <span style={{ opacity: 0.8 }}>Powered by</span>{' '}
          <strong style={{
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}>Dev Spirit</strong>
        </footer>
      </body>
    </html>
  )
}
