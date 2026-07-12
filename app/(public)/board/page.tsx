import Image from 'next/image'
import { getBoardMembers } from '@/lib/actions'
import type { BoardMember } from '@/lib/actions'

// Revalidate every 60 s so edits appear quickly without a deploy
export const revalidate = 60

export const metadata = {
  title: 'Meet the Board of Directors — Hamizak Montessori Academy',
  description:
    'Meet the distinguished Board of Directors of Hamizak Montessori Academy, led by Chief (Dr.) Maryam Jummai Bello Yasin — visionary leaders committed to excellence in education.',
  keywords: [
    'hamizak board of directors',
    'dr maryam jummai bello yasin',
    'hamizak montessori leadership',
    'hamizak abuja board',
  ],
  alternates: { canonical: 'https://hamizak.com.ng/board' },
  openGraph: {
    title: 'Board of Directors — Hamizak Montessori Academy',
    description:
      'Distinguished leaders guiding Hamizak Montessori Academy with excellence, integrity, and vision.',
    url: 'https://hamizak.com.ng/board',
    images: [
      {
        url: '/images/hma-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Hamizak Montessori Academy Board of Directors',
      },
    ],
  },
}

/* ─────────────────────────────────────────────
   Local fallback image paths (used when no Supabase URL set)
───────────────────────────────────────────── */
const LOCAL_FALLBACKS: Record<string, string> = {
  'dr-maryam':      '/images/board/dr-maryam.jpg',
  'alh-bello':      '/images/board/alh-bello.jpg',
  'hajia-habeebah': '/images/board/hajia-habeebah.jpg',
  'amina-ladidi':   '/images/board/amina-ladidi.jpg',
  'zainab-okunola': '/images/board/zainab-okunola.jpg',
}

function photoSrc(member: BoardMember): string {
  return member.image_url || LOCAL_FALLBACKS[member.slug] || '/images/board/placeholder.jpg'
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function BoardPage() {
  const members = await getBoardMembers()
  const chair = members.find((m) => m.is_chair)
  const directors = members.filter((m) => !m.is_chair)

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section
        className="relative py-28 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-[10px] font-black text-teal-400 tracking-[0.25em] uppercase mb-5 bg-teal-400/10 px-4 py-1.5 rounded-full border border-teal-400/20">
            Hamizak Montessori Academy
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 leading-tight tracking-tight">
            Meet the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Board of Directors
            </span>
          </h1>
          <p className="text-white/60 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Distinguished leaders united by a shared commitment to excellence, integrity, and
            the transformative power of Montessori education.
          </p>
        </div>

        {/* wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 48L1440 48L1440 12C1200 48 960 0 720 12C480 24 240 0 0 12L0 48Z" fill="white" />
        </svg>
      </section>

      {/* ── CHAIR CITATION ── */}
      {chair && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section label */}
            <div className="text-center mb-16">
              <span className="inline-block text-[10px] font-black text-teal-600 tracking-[0.25em] uppercase mb-3 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
                Citation of Chief
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Chair of the Board
              </h2>
            </div>

            {/* Chair card */}
            <div className="relative bg-gradient-to-br from-teal-950 to-emerald-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Decorative rings */}
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-teal-500/10 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-teal-500/10 pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none" />

              {/* Gold top accent */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

              <div className="p-8 sm:p-12 lg:p-16">
                <div className="grid lg:grid-cols-[auto_1fr] gap-12 items-start">
                  {/* Photo column */}
                  <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8">
                    <div className="relative">
                      <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-[2rem] overflow-hidden ring-4 ring-amber-400/40 shadow-2xl shadow-black/40 relative">
                        <Image
                          src={photoSrc(chair)}
                          alt={chair.name}
                          fill
                          sizes="(max-width: 640px) 224px, 288px"
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      {/* Gold badge */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                        ★ Chair of the Board ★
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="font-heading font-black text-white text-xl sm:text-2xl leading-tight mb-1">
                        {chair.name}
                      </h3>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">
                        {chair.board_title}
                      </p>
                      {chair.subtitle && (
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                          {chair.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Honours & Titles */}
                    {chair.extra_titles && chair.extra_titles.length > 0 && (
                      <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                        <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3">
                          Honours &amp; Titles
                        </p>
                        {chair.extra_titles.map((t) => (
                          <div key={t} className="flex items-start gap-2.5">
                            <span className="text-amber-400 mt-0.5 shrink-0">✦</span>
                            <span className="text-white/70 text-xs font-medium leading-relaxed">{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bio column */}
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest whitespace-nowrap">
                        Full Citation
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-amber-400/40 to-transparent" />
                    </div>

                    <div className="space-y-5">
                      {chair.bio.split('\n\n').map((para, i) => (
                        <p
                          key={i}
                          className="text-white/75 leading-[1.9] font-medium text-[15px] sm:text-base"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Quote highlight */}
                    {chair.quote && (
                      <div className="mt-10 border-l-4 border-amber-400 pl-6 py-2">
                        <p className="text-white/90 italic text-lg font-medium leading-relaxed">
                          &ldquo;{chair.quote}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white px-4">
            Board of Directors Cont&apos;d
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </div>

      {/* ── DIRECTORS GRID ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-teal-600 tracking-[0.25em] uppercase mb-3 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
              Leadership Team
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Our Distinguished Directors
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl mx-auto">
              Each director brings deep expertise, passion, and a shared vision for transformative
              education.
            </p>
          </div>

          <div className="space-y-12">
            {directors.map((director, idx) => (
              <article
                key={director.id}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/60 overflow-hidden hover:shadow-2xl hover:shadow-teal-100/40 transition-all duration-500"
              >
                <div
                  className={`grid ${idx % 2 === 0 ? 'lg:grid-cols-[320px_1fr]' : 'lg:grid-cols-[1fr_320px]'} items-stretch`}
                >
                  {/* Photo panel — alternate left/right */}
                  <div
                    className={`relative bg-gradient-to-br from-teal-900 to-emerald-950 flex flex-col items-center justify-center py-12 px-8 gap-6 ${
                      idx % 2 !== 0 ? 'lg:order-last' : ''
                    }`}
                  >
                    {/* Decorative blob */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[1.75rem] overflow-hidden ring-4 ring-white/20 shadow-2xl group-hover:ring-amber-400/30 transition-all duration-500">
                        <Image
                          src={photoSrc(director)}
                          alt={director.name}
                          fill
                          sizes="(max-width: 640px) 176px, 208px"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <h3 className="font-heading font-black text-white text-lg sm:text-xl leading-tight mb-2">
                        {director.name}
                      </h3>
                      <span className="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {director.board_title}
                      </span>
                      {director.subtitle && (
                        <p className="text-white/50 text-[10px] uppercase tracking-widest mt-2">
                          {director.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio panel */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <span className="text-teal-600 font-black font-heading text-sm">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <p className="font-heading font-black text-slate-900 text-lg leading-tight">
                          {director.name}
                        </p>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          {director.board_title}
                          {director.subtitle ? ` · ${director.subtitle}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {director.bio.split('\n\n').map((para, i) => (
                        <p key={i} className="text-slate-500 text-sm sm:text-base leading-[1.85] font-medium">
                          {para}
                        </p>
                      ))}
                    </div>

                    {director.quote && (
                      <div className="mt-8 border-l-4 border-teal-400 pl-5 py-1">
                        <p className="text-slate-600 italic text-sm font-medium leading-relaxed">
                          &ldquo;{director.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {director.extra_titles && director.extra_titles.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {director.extra_titles.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-[2.5rem] p-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0b2a22 0%, #134e3a 50%, #041510 100%)' }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-400 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-400 blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.25em] mb-4">
                Join Our Community
              </p>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4 tracking-tight">
                Guided by Vision, Driven by Purpose
              </h2>
              <p className="text-white/60 font-medium mb-8 max-w-lg mx-auto">
                Our Board of Directors ensures that every decision at Hamizak Montessori Academy is
                rooted in excellence, integrity, and the best interest of our children.
              </p>
              <a
                href="/admission"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-teal-900/40 transition-all duration-300 hover:scale-105"
              >
                Apply for Admission
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
