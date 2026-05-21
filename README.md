z# 🌳 Hamizak Montessori Academy — Official Website

A complete, production-ready school website with full Admin CMS built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

---

## 🏫 About The School

**Hamizak Montessori Academy (HMA)** — Abuja, Nigeria
> Plot A.H.E 26111, Sabon Lugbe, AMAC Estate, Airport Road, Abuja
📞 08032253811 | 08062418351
🏫 Creche · Nursery · Primary · High School

---

## 📸 Real School Photos Included

All 20 real photos are in `public/images/` and used across the site:

| Filename | Content |
|----------|---------|
| `school-building-main.jpg` | Main school building + HMA buses |
| `school-building-colorful.jpg` | Colourful secondary building + sports court |
| `staff-teacher.jpg` | Staff portrait |
| `swimming-pool.jpg` | On-site pool with students |
| `robotics-class.jpg` | LEGO robotics STEM class |
| `science-lab-microscope.jpg` | Students at microscopes |
| `vr-learning.jpg` | VR headsets in classroom |
| `stem-robotics.jpg` | Teacher + student-built robot car |
| `toddler-play.jpg` | Toddler class with blocks |
| `ict-classroom.jpg` | Interactive whiteboard ICT lesson |
| `barbering-class.jpg` | Vocational barbering class |
| `sports-court.jpg` | Football pitch + table tennis court |
| `science-lab-chemistry.jpg` | Chemistry experiment in lab coats |
| `playground.jpg` | Indoor playhouse + teacher |
| `montessori-materials.jpg` | Montessori fabric materials |
| `library.jpg` | School library |
| `tailoring-class.jpg` | Students on sewing machines |
| `music-violin.jpg` | Violin class in music room |
| `salon-class.jpg` | Cosmetology/salon vocational class |
| `computer-lab.jpg` | Computer lab with teacher |

---

## ✨ Website Features

### Public Pages
| Page | Features |
|------|----------|
| Homepage | Hero (real school photo), programs, facilities, team, testimonials, admission preview, contact |
| Programs | Toddler Community, Children's House, Elementary — with real photos |
| About | Mission, vision, core values, staff profiles |
| Admission | 4-step application form saved to database |
| Gallery | Masonry grid, lightbox, album filtering |
| Contact | Form, map, phone, address |

### Admin Dashboard (`/admin`)
| Section | Features |
|---------|----------|
| Login | Email/password + Magic Link |
| Overview | Stats dashboard + recent activity |
| Programs | Full CRUD + image upload + reorder |
| Admissions | View/filter/status update/export CSV |
| Messages | Read/delete contact form submissions |
| Gallery | Drag-and-drop upload + album manager |
| Team | Staff CRUD + photo upload |
| Testimonials | Add/approve/manage reviews |
| Events & News | Create/publish posts with rich content |
| Subscribers | View/export email list |
| Settings | Hero image, text, colors, social links, toggles, SEO |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Animations | Framer Motion |
| Upload | React Dropzone |
| Gallery | yet-another-react-lightbox |
| Toast | react-hot-toast |
| Icons | Lucide React |
| Fonts | Nunito + Open Sans |

---

## 🚀 Setup in 5 Steps

### 1 — Install
```bash
npm install
```

### 2 — Create Supabase Project
Go to [supabase.com](https://supabase.com) → New Project
Copy your **Project URL**, **anon key**, and **service_role key** from Settings → API.

### 3 — Environment Variables
```bash
cp .env.local.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4 — Database Migration
1. Supabase Dashboard → **SQL Editor**
2. Paste the full contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

This creates all 13 tables, RLS policies, and seeds programs, staff, core values, admission steps, and features with real data.

### 5 — Storage Buckets
Supabase Dashboard → **Storage** → Create two public buckets:

| Bucket | Public |
|--------|--------|
| `media` | ✅ Yes |
| `documents` | ✅ Yes |

Then run in SQL Editor:
```sql
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "Auth upload media" on storage.objects
  for insert with check (bucket_id = 'media' AND auth.role() = 'authenticated');
create policy "Auth delete media" on storage.objects
  for delete using (bucket_id = 'media' AND auth.role() = 'authenticated');
```

### Create Admin User
Supabase → **Authentication → Users → Add User**
- Email: `admin@hamizakmontessori.edu.ng`
- Password: your choice

### Run
```bash
npm run dev
```

| URL | |
|-----|-|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin dashboard |

---

## 📁 Key Files

```
public/images/          ← All 20 real school photos
app/public-site/        ← Public pages
app/admin/              ← Admin dashboard pages
components/public/      ← Public UI components
components/admin/       ← Admin UI components
lib/actions.ts          ← All Supabase CRUD server actions
lib/supabase/           ← Browser + server clients
types/index.ts          ← TypeScript models
middleware.ts           ← Admin route protection
supabase/migrations/    ← Full SQL schema + seed data
tailwind.config.js      ← Brand colors + utilities
.env.local.example      ← Environment variable template
```

---

## 🎨 Brand Colors

| Color | Hex | Use |
|-------|-----|-----|
| Deep Green | `#2D6A4F` | Nav, hero, primary buttons |
| Warm Yellow | `#F4A261` | CTA / Apply Now buttons |
| Soft Blue | `#457B9D` | Info, badges |
| Light Green | `#52B788` | Hover states |
| Pale Green | `#D8F3DC` | Card backgrounds |

---

## 🔒 Security

- All `/admin` routes protected by Next.js middleware
- Row Level Security (RLS) on every database table
- Public users: read-only on published content, insert-only on forms
- Admin CRUD uses service role key (server-side only)
- File uploads: image/* MIME only, 5MB max

---

## 🌍 Deploy to Vercel

```bash
npm run build   # test locally first
```

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add all 3 env variables
4. Deploy ✅

---

*Built for Hamizak Montessori Academy — Abuja, Nigeria 🇳🇬*
