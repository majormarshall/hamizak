import { getStaff, getCoreValues } from '@/lib/actions'
import Image from 'next/image'
import type { StaffMember, CoreValue } from '@/types'

export const metadata = { title: 'About Us | Hamizak Montessori Academy' }

export default async function AboutPage() {
  const [staff, values] = await Promise.all([getStaff(), getCoreValues()])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section 
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b2a22 0%, #041510 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 scale-110">
          <Image src="/images/school-building-colorful.jpg" alt="School" fill className="object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-teal-900/40" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="shrink-0 p-1 bg-white/10 rounded-2xl border border-white/20 shadow-2xl inline-block mb-8">
            <Image
              src="/images/hma-logo.jpg"
              alt="HMA Logo"
              width={80}
              height={80}
              className="rounded-xl object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase mb-4 block">About Us</span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            Our Story &amp; Mission
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-medium">
            Guided by the motto: <span className="text-teal-400 font-black tracking-widest uppercase text-sm">&ldquo;Discipline, Integrity &amp; Excellence&rdquo;</span>
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="w-14 h-14 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform duration-500">🎯</div>
            <h2 className="font-heading font-black text-3xl text-slate-900 mb-4 tracking-tight">Our Mission</h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              To provide an authentic Montessori education that nurtures each child&apos;s natural desire
              to learn, develop independence, and build a strong moral foundation — preparing them
              to thrive in an ever-changing world.
            </p>
          </div>
          <div className="bg-teal-950 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl shadow-teal-900/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform duration-500">🌟</div>
            <h2 className="font-heading font-black text-3xl text-white mb-4 tracking-tight">Our Vision</h2>
            <p className="text-white/60 font-medium leading-relaxed text-lg">
              To be Abuja&apos;s leading Montessori institution — a school where children from all
              backgrounds discover their unique potential, families feel welcomed as partners,
              and educators are empowered to inspire lifelong learners.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="mt-24 max-w-3xl">
          <span className="section-label">Our Philosophy</span>
          <h2 className="section-title">The Montessori Approach</h2>
          <div className="prose-content mt-8">
            <p>
              Dr. Maria Montessori discovered that children learn best when they are free to explore
              at their own pace within a carefully prepared environment. At Hamizak, we honour this
              philosophy by providing rich learning materials, multi-age classrooms, and trained
              guides who observe and support — rather than direct — each child&apos;s journey.
            </p>
            <p>
              We believe that education is a natural process that develops spontaneously in the human
              being. Our role is to remove obstacles, provide tools, and trust in the extraordinary
              capacity of every child.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.length > 0 && (
        <section className="py-24 bg-slate-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Our Culture</span>
              <h2 className="section-title">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((v: CoreValue) => (
                <div key={v.id} className="card p-8 text-center group">
                  <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 ring-1 ring-teal-100 group-hover:scale-110 transition-transform duration-500">
                    {v.icon}
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {staff.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">The Team</span>
              <h2 className="section-title">Meet Our Educators</h2>
              <p className="section-subtitle mx-auto text-center">
                Trained, certified, and deeply passionate about guiding every child&apos;s unique journey.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {staff.map((member: StaffMember) => (
                <div key={member.id} className="text-center group">
                  <div className="relative inline-block mb-6">
                    {member.photo_url ? (
                      <div className="w-32 h-32 rounded-[2rem] overflow-hidden mx-auto
                                      ring-4 ring-slate-50 group-hover:ring-teal-100 transition-all duration-500 shadow-xl shadow-slate-200/50">
                        <Image src={member.photo_url} alt={member.name} fill className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-[2rem] bg-teal-50 flex items-center justify-center
                                      mx-auto font-heading font-black text-3xl text-teal-700
                                      ring-4 ring-slate-50 group-hover:ring-teal-100 transition-all duration-500 shadow-xl shadow-slate-200/50">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="text-[10px] font-black">HMA</span>
                    </div>
                  </div>
                  <h3 className="font-heading font-black text-slate-900 text-lg tracking-tight mb-1">{member.name}</h3>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">{member.role}</p>
                  {member.bio && <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 px-4">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
