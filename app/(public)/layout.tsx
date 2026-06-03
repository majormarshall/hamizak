import { redirect } from 'next/navigation'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import AnnouncementBanner from '@/components/public/AnnouncementBanner'
import { getSiteSettings } from '@/lib/actions'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  // Maintenance mode check — runs in Node.js (no edge timeout risk)
  if (settings?.maintenance_mode) redirect('/maintenance')

  return (
    <>
      {settings?.announcement_enabled && (
        <AnnouncementBanner
          text={settings.announcement_text}
          color={settings.announcement_color}
        />
      )}
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings?.whatsapp || '2348032253811'} />
    </>
  )
}
