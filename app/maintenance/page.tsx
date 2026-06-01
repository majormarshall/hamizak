import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/actions'

export const metadata: Metadata = {
  title: 'Under Maintenance | Hamizak Montessori Academy',
  description: 'We are currently performing scheduled maintenance. We will be back shortly.',
}

export default async function MaintenancePage() {
  const settings = await getSiteSettings()

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-3xl" />
      </div>

      {/* Animated gear SVG */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="mb-8 relative">
          <svg
            className="w-28 h-28 text-teal-400 animate-spin"
            style={{ animationDuration: '8s' }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Inner pulse ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-teal-500/20 rounded-full animate-ping" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-block bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-6">
          🚧 Scheduled Maintenance
        </span>

        {/* School logo */}
        {settings?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.logo_url}
            alt={settings.school_name ?? 'HMA'}
            className="w-16 h-16 rounded-2xl object-contain border border-white/10 bg-white/5 p-2 mb-6"
          />
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          We&apos;ll Be Back{' '}
          <span className="text-teal-400">Shortly</span>
        </h1>

        <p className="text-white/60 text-base leading-relaxed mb-8">
          {settings?.school_name ?? 'Hamizak Montessori Academy'} is currently undergoing
          scheduled maintenance to improve your experience. Please check back soon.
        </p>

        {/* Contact info */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8 w-full">
          {settings?.phone1 && (
            <a
              href={`tel:${settings.phone1}`}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold transition-colors"
            >
              📞 {settings.phone1}
            </a>
          )}
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold transition-colors"
            >
              ✉️ {settings.email}
            </a>
          )}
        </div>

        <p className="text-white/20 text-xs mt-8 font-medium tracking-widest uppercase">
          Discipline · Integrity · Excellence
        </p>
      </div>
    </main>
  )
}
