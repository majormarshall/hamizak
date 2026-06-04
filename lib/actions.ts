'use server'

import { createClient, createAdminClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  SiteSettings, Program, StaffMember, Testimonial,
  GalleryAlbum, GalleryImage, EventPost, ContactMessage,
  AdmissionApplication, NewsletterSubscriber, CoreValue,
  WhyChooseFeature, AdmissionStep, ApplicationStatus
} from '@/types'

// ─── Site Settings ───────────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').single()
  return data
}

export async function updateSiteSettings(updates: Partial<SiteSettings>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('site_settings').update(updates).eq('id', 1)
  if (error) throw error
  revalidatePath('/', 'layout')
}

// ─── Programs ────────────────────────────────────────────────────
export async function getPrograms(activeOnly = true): Promise<Program[]> {
  const supabase = await createClient()
  let q = supabase.from('programs').select('*').order('display_order')
  if (activeOnly) q = q.eq('is_active', true)
  const { data } = await q
  return data ?? []
}

export async function upsertProgram(program: Partial<Program>) {
  const supabase = createAdminClient()
  const q = program.id
    ? supabase.from('programs').update(program).eq('id', program.id).select().single()
    : supabase.from('programs').insert(program).select().single()
  
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  return data as Program
}

export async function deleteProgram(id: string) {
  const supabase = createAdminClient()
  await supabase.from('programs').delete().eq('id', id)
  revalidatePath('/programs')
  revalidatePath('/admin/programs')
}

// ─── Staff Members ───────────────────────────────────────────────
export async function getStaff(activeOnly = true): Promise<StaffMember[]> {
  const supabase = await createClient()
  let q = supabase.from('staff_members').select('*').order('created_at', { ascending: false })
  if (activeOnly) q = q.eq('is_active', true)
  const { data } = await q
  return data ?? []
}

export async function upsertStaff(member: Partial<StaffMember>) {
  const supabase = createAdminClient()
  const q = member.id
    ? supabase.from('staff_members').update(member).eq('id', member.id).select().single()
    : supabase.from('staff_members').insert(member).select().single()
  
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/about')
  revalidatePath('/admin/team')
  return data as StaffMember
}

export async function deleteStaff(id: string) {
  const supabase = createAdminClient()
  await supabase.from('staff_members').delete().eq('id', id)
  revalidatePath('/about')
  revalidatePath('/admin/team')
}

// ─── Testimonials ─────────────────────────────────────────────────
export async function getTestimonials(approvedOnly = true): Promise<Testimonial[]> {
  const supabase = await createClient()
  let q = supabase.from('testimonials').select('*').order('display_order')
  if (approvedOnly) q = q.eq('is_approved', true)
  const { data } = await q
  return data ?? []
}

export async function upsertTestimonial(t: Partial<Testimonial>) {
  const supabase = createAdminClient()
  const q = t.id
    ? supabase.from('testimonials').update(t).eq('id', t.id).select().single()
    : supabase.from('testimonials').insert(t).select().single()
  
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return data as Testimonial
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/')
}

// ─── Gallery ─────────────────────────────────────────────────────
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery_albums')
    .select('*, images:gallery_images(*)')
    .eq('is_active', true)
    .order('display_order')
  return data ?? []
}

export async function upsertAlbum(album: Partial<GalleryAlbum>) {
  const supabase = createAdminClient()
  const q = album.id
    ? supabase.from('gallery_albums').update(album).eq('id', album.id).select().single()
    : supabase.from('gallery_albums').insert(album).select().single()
  
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  return data as GalleryAlbum
}

export async function addGalleryImages(images: Partial<GalleryImage>[]) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('gallery_images').insert(images)
  if (error) throw error
  revalidatePath('/gallery')
}

export async function deleteGalleryImage(id: string) {
  const supabase = createAdminClient()
  await supabase.from('gallery_images').delete().eq('id', id)
  revalidatePath('/gallery')
}

// ─── Events & News ───────────────────────────────────────────────
export async function getEvents(publishedOnly = true): Promise<EventPost[]> {
  const supabase = await createClient()
  let q = supabase.from('events_posts').select('*').order('created_at', { ascending: false })
  if (publishedOnly) q = q.eq('is_published', true)
  const { data } = await q
  return data ?? []
}

export async function getEventBySlug(slug: string): Promise<EventPost | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('events_posts').select('*').eq('slug', slug).single()
  return data
}

export async function upsertEvent(post: Partial<EventPost>) {
  const supabase = createAdminClient()
  const q = post.id
    ? supabase.from('events_posts').update(post).eq('id', post.id).select().single()
    : supabase.from('events_posts').insert(post).select().single()
  
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/news')
  revalidatePath('/admin/events')
  return data as EventPost
}

export async function deleteEvent(id: string) {
  const supabase = createAdminClient()
  await supabase.from('events_posts').delete().eq('id', id)
  revalidatePath('/news')
}

// ─── Contact Messages ────────────────────────────────────────────
export async function submitContactMessage(data: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert({ ...data, is_read: false })
  if (error) throw error
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function markMessageRead(id: string) {
  const supabase = createAdminClient()
  await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
  revalidatePath('/admin/messages')
}

export async function deleteMessage(id: string) {
  const supabase = createAdminClient()
  await supabase.from('contact_messages').delete().eq('id', id)
  revalidatePath('/admin/messages')
}

// ─── Admission Applications ──────────────────────────────────────
export async function submitApplication(
  data: Omit<AdmissionApplication, 'id' | 'status' | 'created_at'>
) {
  const supabase = await createClient()
  const { error } = await supabase.from('admission_applications').insert({ ...data, status: 'new' })
  if (error) throw error
}

export async function getApplications(): Promise<AdmissionApplication[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('admission_applications')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const supabase = createAdminClient()
  await supabase.from('admission_applications').update({ status }).eq('id', id)
  revalidatePath('/admin/admissions')
}

export async function deleteApplication(id: string) {
  const supabase = createAdminClient()
  await supabase.from('admission_applications').delete().eq('id', id)
  revalidatePath('/admin/admissions')
}

// ─── Newsletter ──────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email' })
  if (error) throw error
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function deleteSubscriber(id: string) {
  const supabase = createAdminClient()
  await supabase.from('newsletter_subscribers').delete().eq('id', id)
  revalidatePath('/admin/subscribers')
}

// ─── Core Values ─────────────────────────────────────────────────
export async function getCoreValues(): Promise<CoreValue[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('core_values').select('*').order('display_order')
  return data ?? []
}

// ─── Why Choose Us ───────────────────────────────────────────────
export async function getWhyChooseFeatures(): Promise<WhyChooseFeature[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('why_choose_us_features').select('*').order('display_order')
  return data ?? []
}

// ─── Admission Steps ─────────────────────────────────────────────
export async function getAdmissionSteps(): Promise<AdmissionStep[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('admission_steps').select('*').order('step_number')
  return data ?? []
}

// ─── Admin Management ────────────────────────────────────────────
export async function getAdmins(): Promise<{ email: string; role: string }[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function addAdmin(email: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('admins').insert({ email: email.toLowerCase().trim() })
  if (error) throw error
  revalidatePath('/admin/settings')
}

export async function removeAdmin(email: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('admins').delete().eq('email', email)
  if (error) throw error
  revalidatePath('/admin/settings')
}
