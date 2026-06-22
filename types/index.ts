// ─── Site Settings ──────────────────────────────────────────────
export interface SiteSettings {
  id: string
  school_name: string
  address: string
  phone1: string
  phone2: string
  email: string
  whatsapp: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  tiktok_url: string
  google_maps_embed: string
  logo_url: string
  favicon_url: string
  primary_color: string
  secondary_color: string
  accent_color: string
  footer_copyright: string
  meta_title: string
  meta_description: string
  maintenance_mode: boolean
  announcement_enabled: boolean
  announcement_text: string
  announcement_color: string
  hero_headline: string
  hero_subtitle: string
  hero_image_url: string
  hero_cta_primary: string
  hero_cta_secondary: string
  applications_open: boolean
  updated_at: string
}

// ─── Program ────────────────────────────────────────────────────
export interface Program {
  id: string
  title: string
  age_range: string
  description: string
  image_url: string
  icon: string
  features: string[]
  display_order: number
  is_active: boolean
  created_at: string
}

// ─── Staff Member ────────────────────────────────────────────────
export interface StaffMember {
  id: string
  name: string
  role: string
  bio: string
  photo_url: string
  display_order: number
  is_active: boolean
  created_at: string
}

// ─── Testimonial ─────────────────────────────────────────────────
export interface Testimonial {
  id: string
  parent_name: string
  child_program: string
  rating: number
  testimonial_text: string
  photo_url: string | null
  is_approved: boolean
  display_order: number
  created_at: string
}

// ─── Gallery ─────────────────────────────────────────────────────
export interface GalleryAlbum {
  id: string
  title: string
  description: string
  cover_image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  images?: GalleryImage[]
}

export interface GalleryImage {
  id: string
  album_id: string
  url: string
  caption: string
  display_order: number
  created_at: string
}

// ─── Event / Post ─────────────────────────────────────────────────
export interface EventPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image_url: string | null
  category: 'news' | 'event' | 'announcement'
  event_date: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

// ─── Contact Message ─────────────────────────────────────────────
export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

// ─── Admission Application ───────────────────────────────────────
export type ApplicationStatus = 'new' | 'reviewed' | 'contacted' | 'enrolled' | 'declined'

export interface AdmissionApplication {
  id: string
  child_name: string
  child_age: string
  child_dob: string
  program_interest: string
  parent_name: string
  parent_email: string
  parent_phone: string
  address: string
  how_heard: string
  additional_notes: string
  status: ApplicationStatus
  admission_number?: string | null
  created_at: string
}

// ─── Newsletter Subscriber ───────────────────────────────────────
export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

// ─── Core Value ──────────────────────────────────────────────────
export interface CoreValue {
  id: string
  icon: string
  title: string
  description: string
  display_order: number
}

// ─── Why Choose Us Feature ───────────────────────────────────────
export interface WhyChooseFeature {
  id: string
  icon: string
  title: string
  description: string
  display_order: number
}

// ─── Admission Step ──────────────────────────────────────────────
export interface AdmissionStep {
  id: string
  step_number: number
  title: string
  description: string
}

// ─── Menu Item ───────────────────────────────────────────────────
export interface MenuItem {
  id: string
  label: string
  href: string
  display_order: number
  is_published: boolean
  open_in_new_tab: boolean
}
