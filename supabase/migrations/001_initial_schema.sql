-- ============================================================
-- Hamizak Montessori Academy — Supabase Migration
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── site_settings (singleton) ──────────────────────────────────
create table if not exists site_settings (
  id                    int primary key default 1,
  school_name           text default 'Hamizak Montessori Academy',
  address               text default 'Plot A.H.E 26111, Sabon Lugbe, AMAC Estate, Airport Road, Abuja',
  phone1                text default '08032253811',
  phone2                text default '08062418351',
  email                 text default 'info@hamizakmontessori.edu.ng',
  whatsapp              text default '2348032253811',
  facebook_url          text default '',
  instagram_url         text default '',
  twitter_url           text default '',
  youtube_url           text default '',
  google_maps_embed     text default '',
  logo_url              text default '/images/hma-logo.jpg',
  favicon_url           text default '',
  primary_color         text default '#2D6A4F',
  secondary_color       text default '#F4A261',
  accent_color          text default '#457B9D',
  footer_copyright      text default '© 2025 Hamizak Montessori Academy. All rights reserved.',
  meta_title            text default 'Hamizak Montessori Academy | Abuja, Nigeria',
  meta_description      text default 'Hamizak Montessori Academy — Discipline, Integrity & Excellence. Nurturing independent learners from Creche to High School in Sabon Lugbe, Airport Road, Abuja.',
  maintenance_mode      boolean default false,
  announcement_enabled  boolean default false,
  announcement_text     text default '',
  announcement_color    text default '#2D6A4F',
  hero_headline         text default 'Nurturing Independent Learners for a Bright Future',
  hero_subtitle         text default 'Welcome to Hamizak Montessori Academy — Where Every Child Blooms',
  hero_image_url        text default '',
  hero_cta_primary      text default 'Enroll Now',
  hero_cta_secondary    text default 'Book a School Tour',
  applications_open     boolean default true,
  updated_at            timestamptz default now()
);

-- Ensure singleton row
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ─── programs ───────────────────────────────────────────────────
create table if not exists programs (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  age_range     text not null,
  description   text,
  image_url     text,
  icon          text default '📚',
  features      text[] default '{}',
  display_order int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ─── staff_members ──────────────────────────────────────────────
create table if not exists staff_members (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  role          text not null,
  bio           text,
  photo_url     text,
  display_order int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ─── testimonials ───────────────────────────────────────────────
create table if not exists testimonials (
  id               uuid primary key default uuid_generate_v4(),
  parent_name      text not null,
  child_program    text not null,
  rating           int default 5 check (rating between 1 and 5),
  testimonial_text text not null,
  photo_url        text,
  is_approved      boolean default false,
  display_order    int default 0,
  created_at       timestamptz default now()
);

-- ─── gallery_albums ─────────────────────────────────────────────
create table if not exists gallery_albums (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  description      text,
  cover_image_url  text,
  display_order    int default 0,
  is_active        boolean default true,
  created_at       timestamptz default now()
);

-- ─── gallery_images ─────────────────────────────────────────────
create table if not exists gallery_images (
  id            uuid primary key default uuid_generate_v4(),
  album_id      uuid references gallery_albums(id) on delete cascade,
  url           text not null,
  caption       text default '',
  display_order int default 0,
  created_at    timestamptz default now()
);

-- ─── events_posts ───────────────────────────────────────────────
create table if not exists events_posts (
  id                  uuid primary key default uuid_generate_v4(),
  title               text not null,
  slug                text unique not null,
  content             text,
  excerpt             text,
  featured_image_url  text,
  category            text default 'news' check (category in ('news','event','announcement')),
  event_date          date,
  is_published        boolean default false,
  published_at        timestamptz,
  created_at          timestamptz default now()
);

-- ─── contact_messages ───────────────────────────────────────────
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- ─── admission_applications ─────────────────────────────────────
create table if not exists admission_applications (
  id               uuid primary key default uuid_generate_v4(),
  child_name       text not null,
  child_age        text,
  child_dob        text,
  program_interest text not null,
  parent_name      text not null,
  parent_email     text not null,
  parent_phone     text,
  address          text,
  how_heard        text,
  additional_notes text,
  status           text default 'new' check (status in ('new','reviewed','contacted','enrolled','declined')),
  created_at       timestamptz default now()
);

-- ─── newsletter_subscribers ─────────────────────────────────────
create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- ─── core_values ────────────────────────────────────────────────
create table if not exists core_values (
  id            uuid primary key default uuid_generate_v4(),
  icon          text default '⭐',
  title         text not null,
  description   text,
  display_order int default 0
);

-- ─── why_choose_us_features ─────────────────────────────────────
create table if not exists why_choose_us_features (
  id            uuid primary key default uuid_generate_v4(),
  icon          text default '✅',
  title         text not null,
  description   text,
  display_order int default 0
);

-- ─── admission_steps ─────────────────────────────────────────────
create table if not exists admission_steps (
  id          uuid primary key default uuid_generate_v4(),
  step_number int not null,
  title       text not null,
  description text
);

-- ─── Row Level Security ──────────────────────────────────────────
alter table site_settings          enable row level security;
alter table programs               enable row level security;
alter table staff_members          enable row level security;
alter table testimonials           enable row level security;
alter table gallery_albums         enable row level security;
alter table gallery_images         enable row level security;
alter table events_posts           enable row level security;
alter table contact_messages       enable row level security;
alter table admission_applications enable row level security;
alter table newsletter_subscribers enable row level security;
alter table core_values            enable row level security;
alter table why_choose_us_features enable row level security;
alter table admission_steps        enable row level security;

-- Public READ policies (for published/active content)
create policy "Public can read settings"       on site_settings          for select using (true);
create policy "Public can read programs"        on programs               for select using (is_active = true);
create policy "Public can read staff"           on staff_members          for select using (is_active = true);
create policy "Public can read testimonials"    on testimonials           for select using (is_approved = true);
create policy "Public can read albums"          on gallery_albums         for select using (is_active = true);
create policy "Public can read images"          on gallery_images         for select using (true);
create policy "Public can read posts"           on events_posts           for select using (is_published = true);
create policy "Public can read values"          on core_values            for select using (true);
create policy "Public can read features"        on why_choose_us_features for select using (true);
create policy "Public can read steps"           on admission_steps        for select using (true);

-- Public INSERT for forms
create policy "Public can submit messages"      on contact_messages       for insert with check (true);
create policy "Public can submit applications"  on admission_applications for insert with check (true);
create policy "Public can subscribe"            on newsletter_subscribers for insert with check (true);
create policy "Public can unsubscribe"          on newsletter_subscribers for delete using (true);

-- ─── Seed Data ──────────────────────────────────────────────────
insert into programs (title, age_range, description, image_url, icon, features, display_order) values
  ('Toddler Community', '18 months – 3 years',
   'Gentle introduction to independence, language, and sensory exploration in a warm, nurturing environment guided by trained educators.',
   '/images/toddler-play.jpg',
   '🌱', '{"Practical life activities","Sensory materials","Language development","Social grace and courtesy"}', 1),
  ('Children''s House', '3 – 6 years',
   'The classic Montessori experience — child-led learning with rich materials across all curriculum areas including Montessori materials.',
   '/images/montessori-materials.jpg',
   '🌿', '{"Math & numeracy","Reading & writing","Cultural studies","Art & music","VR-enhanced learning"}', 2),
  ('Elementary', '6 – 12 years',
   'Collaborative deep-dives into science, robotics, arts and mathematics. Students build real robots, learn in science labs and explore VR.',
   '/images/robotics-class.jpg',
   '🌳', '{"Robotics & STEM","Science lab experiments","VR learning experiences","Music & arts","Vocational skills"}', 3)
on conflict do nothing;

insert into staff_members (name, role, bio, display_order) values
  ('Mrs. Hamidah A.', 'Head Directress & Founder', 'AMI-trained Montessori educator with over 15 years of experience guiding young learners.', 1),
  ('Mr. Femi K.', 'Elementary Lead', 'Passionate about STEM and research-based learning in the Montessori framework.', 2),
  ('Ms. Zainab M.', 'Children''s House Guide', 'Certified guide specialising in language and mathematics materials.', 3),
  ('Mrs. Emeka O.', 'Toddler Community Guide', 'Expert in infant and toddler development, creating safe and joyful environments.', 4)
on conflict do nothing;

insert into testimonials (parent_name, child_program, rating, testimonial_text, is_approved, display_order) values
  ('Aisha Mohammed', 'Children''s House', 5, 'My son has blossomed beyond recognition. He is confident, curious, and genuinely loves coming to school every single day. Hamizak is exceptional!', true, 1),
  ('Bola Okonkwo', 'Elementary', 5, 'The teachers truly understand each child as an individual. My daughter went from shy to a confident presenter in one term. Incredible school and community.', true, 2),
  ('Samuel Nwachukwu', 'Toddler Community', 5, 'Best decision we made for our toddler. She is so happy here. The environment is safe, warm, beautifully organised, and the staff are phenomenal.', true, 3)
on conflict do nothing;

insert into core_values (icon, title, description, display_order) values
  ('💚', 'Respect', 'Every child is valued and treated as a unique, capable individual.', 1),
  ('🔍', 'Curiosity', 'We celebrate questioning, exploring, and discovering the world.', 2),
  ('🤝', 'Community', 'Learning together builds stronger, more empathetic children.', 3),
  ('🌿', 'Nature', 'Connection to the natural world grounds and inspires us all.', 4),
  ('⭐', 'Excellence', 'We set high, achievable standards and celebrate every milestone.', 5)
on conflict do nothing;

insert into why_choose_us_features (icon, title, description, display_order) values
  ('🤖', 'Robotics & STEM Lab', 'Students build and program real robots, developing critical thinking and engineering skills from an early age.', 1),
  ('🔬', 'Fully Equipped Science Lab', 'Hands-on chemistry and biology experiments in our professional laboratory with trained science educators.', 2),
  ('🥽', 'VR-Enhanced Learning', 'We integrate Virtual Reality technology to make learning immersive, engaging, and unforgettable.', 3),
  ('🎵', 'Music & Arts Programme', 'Students learn violin, guitar, and other instruments in our dedicated music room alongside fine arts.', 4),
  ('🏊', 'Swimming Pool & Sports', 'Our on-site swimming pool, football pitch, basketball court, and table tennis facilities keep students active.', 5),
  ('✂️', 'Vocational Skills Training', 'Practical training in tailoring, barbering, and cosmetology prepares students for real-world self-reliance.', 6)
on conflict do nothing;

insert into admission_steps (step_number, title, description) values
  (1, 'Download Prospectus', 'Get our full programme guide, curriculum overview, and fee schedule.'),
  (2, 'Submit Application', 'Complete our online application form with your child''s details.'),
  (3, 'Schedule a Tour', 'Visit us, experience the Hamizak environment, and meet our guides.'),
  (4, 'Enrolment & Orientation', 'Complete registration paperwork and attend our welcome orientation.')
on conflict do nothing;

-- ─── Storage Buckets (run these separately if needed) ────────────
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
