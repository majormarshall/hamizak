-- ============================================================
-- Hamizak Montessori Academy — Supabase Schema
-- Regenerated from types/index.ts & lib/actions.ts
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. SITE SETTINGS  (single-row table, id = 1)
-- ============================================================
create table if not exists site_settings (
  id                    integer primary key default 1,
  school_name           text not null default 'Hamizak Montessori Academy',
  address               text not null default '',
  phone1                text not null default '',
  phone2                text not null default '',
  email                 text not null default '',
  whatsapp              text not null default '',
  facebook_url          text not null default '',
  instagram_url         text not null default '',
  twitter_url           text not null default '',
  youtube_url           text not null default '',
  google_maps_embed     text not null default '',
  logo_url              text not null default '',
  favicon_url           text not null default '',
  primary_color         text not null default '#0d9488',
  secondary_color       text not null default '#134e4a',
  accent_color          text not null default '#f59e0b',
  footer_copyright      text not null default '',
  meta_title            text not null default '',
  meta_description      text not null default '',
  maintenance_mode      boolean not null default false,
  announcement_enabled  boolean not null default false,
  announcement_text     text not null default '',
  announcement_color    text not null default '#f59e0b',
  hero_headline         text not null default '',
  hero_subtitle         text not null default '',
  hero_image_url        text not null default '',
  hero_cta_primary      text not null default 'Apply Now',
  hero_cta_secondary    text not null default 'Learn More',
  applications_open     boolean not null default true,
  updated_at            timestamptz not null default now(),
  -- Enforce single row
  constraint site_settings_singleton check (id = 1)
);

-- Seed the single row so updates never fail
insert into site_settings (id) values (1) on conflict do nothing;


-- ============================================================
-- 2. PROGRAMS
-- ============================================================
create table if not exists programs (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  age_range     text not null default '',
  description   text not null default '',
  image_url     text not null default '',
  icon          text not null default '',
  features      text[] not null default '{}',
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);


-- ============================================================
-- 3. STAFF MEMBERS
-- ============================================================
create table if not exists staff_members (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  role          text not null default '',
  bio           text not null default '',
  photo_url     text not null default '',
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);


-- ============================================================
-- 4. TESTIMONIALS
-- ============================================================
create table if not exists testimonials (
  id               uuid primary key default uuid_generate_v4(),
  parent_name      text not null,
  child_program    text not null default '',
  rating           integer not null default 5 check (rating between 1 and 5),
  testimonial_text text not null default '',
  photo_url        text,
  is_approved      boolean not null default false,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now()
);


-- ============================================================
-- 5. GALLERY ALBUMS
-- ============================================================
create table if not exists gallery_albums (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null default '',
  cover_image_url text,
  display_order   integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ── Gallery Images (child of album) ─────────────────────────────────────────
create table if not exists gallery_images (
  id            uuid primary key default uuid_generate_v4(),
  album_id      uuid not null references gallery_albums (id) on delete cascade,
  url           text not null,
  caption       text not null default '',
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);


-- ============================================================
-- 6. EVENTS / NEWS POSTS
-- ============================================================
create table if not exists events_posts (
  id                  uuid primary key default uuid_generate_v4(),
  title               text not null,
  slug                text not null unique,
  content             text not null default '',
  excerpt             text not null default '',
  featured_image_url  text,
  category            text not null default 'news' check (category in ('news', 'event', 'announcement')),
  event_date          date,
  is_published        boolean not null default false,
  published_at        timestamptz,
  created_at          timestamptz not null default now()
);


-- ============================================================
-- 7. CONTACT MESSAGES
-- ============================================================
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);


-- ============================================================
-- 8. ADMISSION APPLICATIONS
-- ============================================================
create table if not exists admission_applications (
  id               uuid primary key default uuid_generate_v4(),
  child_name       text not null,
  child_age        text not null default '',
  child_dob        text not null default '',
  program_interest text not null default '',
  parent_name      text not null,
  parent_email     text not null,
  parent_phone     text not null default '',
  address          text not null default '',
  how_heard        text not null default '',
  additional_notes text not null default '',
  status           text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'enrolled', 'declined')),
  created_at       timestamptz not null default now()
);


-- ============================================================
-- 9. NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz not null default now()
);


-- ============================================================
-- 10. CORE VALUES
-- ============================================================
create table if not exists core_values (
  id            uuid primary key default uuid_generate_v4(),
  icon          text not null default '',
  title         text not null,
  description   text not null default '',
  display_order integer not null default 0
);


-- ============================================================
-- 11. WHY CHOOSE US FEATURES
-- ============================================================
create table if not exists why_choose_us_features (
  id            uuid primary key default uuid_generate_v4(),
  icon          text not null default '',
  title         text not null,
  description   text not null default '',
  display_order integer not null default 0
);


-- ============================================================
-- 12. ADMISSION STEPS
-- ============================================================
create table if not exists admission_steps (
  id          uuid primary key default uuid_generate_v4(),
  step_number integer not null unique,
  title       text not null,
  description text not null default ''
);


-- ============================================================
-- 13. ADMINS  (email whitelist checked in middleware)
-- ============================================================
create table if not exists admins (
  email      text primary key,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
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
alter table admins                 enable row level security;

-- ── Public READ policies (anon can read published/active content) ─────────────

create policy "public_read_site_settings"
  on site_settings for select using (true);

create policy "public_read_active_programs"
  on programs for select using (is_active = true);

create policy "public_read_active_staff"
  on staff_members for select using (is_active = true);

create policy "public_read_approved_testimonials"
  on testimonials for select using (is_approved = true);

create policy "public_read_active_albums"
  on gallery_albums for select using (is_active = true);

create policy "public_read_gallery_images"
  on gallery_images for select using (true);

create policy "public_read_published_events"
  on events_posts for select using (is_published = true);

create policy "public_read_core_values"
  on core_values for select using (true);

create policy "public_read_why_choose"
  on why_choose_us_features for select using (true);

create policy "public_read_admission_steps"
  on admission_steps for select using (true);

-- ── Public WRITE policies (anon can submit forms) ────────────────────────────

create policy "public_submit_contact"
  on contact_messages for insert with check (true);

create policy "public_submit_application"
  on admission_applications for insert with check (true);

create policy "public_subscribe_newsletter"
  on newsletter_subscribers for insert with check (true);

-- ── Service role has full access (used by admin actions via createAdminClient) ──
-- The service role key bypasses RLS entirely — no extra policies needed.
