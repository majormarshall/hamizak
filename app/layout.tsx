import type { Metadata } from 'next'
import { Nunito, Open_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
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
  metadataBase: new URL('https://hamizak.com'), // Replace with actual domain if known
  title: 'Hamizak Montessori Academy | Abuja, Nigeria',
  description:
    'Hamizak Montessori Academy — Discipline, Integrity & Excellence. Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja. Call 08032253811.',
  keywords: ['montessori', 'school', 'abuja', 'nursery', 'primary', 'HMA', 'hamizak', 'nigeria', 'sabon lugbe'],
  icons: { icon: '/images/hma-logo.jpg', apple: '/images/hma-logo.jpg' },
  openGraph: {
    title: 'Hamizak Montessori Academy | Abuja',
    description: 'Discipline, Integrity & Excellence — Where every child blooms',
    type: 'website',
    images: [{ url: '/images/school-building-main.jpg', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${openSans.variable}`}>
      <body className="font-body antialiased bg-white text-gray-900">
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
