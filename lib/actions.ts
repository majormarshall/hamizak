'use server'

import { createClient, createAdminClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyAdminNewMessage, notifyAdminNewApplication } from './notifications'
import type {
  SiteSettings, Program, StaffMember, Testimonial,
  GalleryAlbum, GalleryImage, EventPost, ContactMessage,
  AdmissionApplication, NewsletterSubscriber, CoreValue,
  WhyChooseFeature, AdmissionStep, ApplicationStatus
} from '@/types'

// â”€â”€â”€ Site Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Programs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Staff Members â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Testimonials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Gallery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery_albums')
    .select('*, images:gallery_images(*)')
    .eq('is_active', true)
    .order('display_order')

  if (data) {
    data.forEach(album => {
      if (Array.isArray(album.images)) {
        album.images.sort((a: GalleryImage, b: GalleryImage) => (a.display_order ?? 0) - (b.display_order ?? 0))
      }
    })
  }
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
  const { data, error } = await supabase.from('gallery_images').insert(images).select()
  if (error) throw error
  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  return data as GalleryImage[]
}

export async function deleteGalleryImage(id: string) {
  const supabase = createAdminClient()
  await supabase.from('gallery_images').delete().eq('id', id)
  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}

// â”€â”€â”€ Events & News â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getEvents(publishedOnly = false): Promise<EventPost[]> {
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
  revalidatePath('/')
  revalidatePath('/admin/events')
  return data as EventPost
}

export async function deleteEvent(id: string) {
  const supabase = createAdminClient()
  await supabase.from('events_posts').delete().eq('id', id)
  revalidatePath('/news')
  revalidatePath('/')
}

// â”€â”€â”€ Contact Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function replyToMessage(id: string, to: string, subject: string, body: string) {
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `Hamizak Montessori Academy <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.7; color: #334155;">
        ${body.replace(/\n/g, '<br/>')}
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          Best regards,<br/>
          <strong>Hamizak Montessori Academy</strong>
        </p>
      </div>
    `,
  })

  const supabase = createAdminClient()
  await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
  revalidatePath('/admin/messages')
}
export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'> & { phone?: string }
) {
  const supabase = await createClient()
  let finalMessage = data.message
  if (data.phone && data.phone.trim()) {
    finalMessage = `[Phone / WhatsApp: ${data.phone.trim()}]\n\n${data.message}`
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: finalMessage,
    is_read: false,
  })
  if (error) {
    console.error('database insertion error in submitContactMessage:', error)
    throw error
  }

  // Asynchronously dispatch WhatsApp and Email notifications to school administration
  notifyAdminNewMessage({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  }).catch(err => console.error('Notification dispatch error:', err))
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

// â”€â”€â”€ Admission Applications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function submitApplication(
  data: Omit<AdmissionApplication, 'id' | 'status' | 'created_at'>
) {
  const supabase = await createClient()
  const { error } = await supabase.from('admission_applications').insert({ ...data, status: 'new' })
  if (error) {
    console.error('database insertion error in submitApplication:', error)
    throw error
  }

  // Asynchronously dispatch WhatsApp and Email alerts to school admissions team
  notifyAdminNewApplication({
    parent_name: data.parent_name,
    parent_email: data.parent_email,
    parent_phone: data.parent_phone,
    child_name: data.child_name,
    program_interest: data.program_interest,
  }).catch(err => console.error('Admission notification dispatch error:', err))
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

export async function generateAdmissionNumber(id: string): Promise<string> {
  const supabase = createAdminClient()
  const year = new Date().getFullYear()
  // Count existing applications that already have a number this year
  const { count } = await supabase
    .from('admission_applications')
    .select('*', { count: 'exact', head: true })
    .not('admission_number', 'is', null)
  const seq = String((count ?? 0) + 1).padStart(3, '0')
  const admissionNumber = `HMA/${year}/${seq}`
  const { error } = await supabase
    .from('admission_applications')
    .update({ admission_number: admissionNumber })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/admissions')
  return admissionNumber
}

export async function updateAdmissionNumber(id: string, admissionNumber: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admission_applications')
    .update({ admission_number: admissionNumber.trim() })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/admissions')
}

export async function deleteAllApplications() {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admission_applications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows
  if (error) throw error
  revalidatePath('/admin/admissions')
}

export async function deleteApplication(id: string) {
  const supabase = createAdminClient()
  await supabase.from('admission_applications').delete().eq('id', id)
  revalidatePath('/admin/admissions')
}

// â”€â”€â”€ Newsletter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Core Values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getCoreValues(): Promise<CoreValue[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('core_values').select('*').order('display_order')
  return data ?? []
}

// â”€â”€â”€ Why Choose Us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getWhyChooseFeatures(): Promise<WhyChooseFeature[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('why_choose_us_features').select('*').order('display_order')
  return data ?? []
}

// â”€â”€â”€ Admission Steps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getAdmissionSteps(): Promise<AdmissionStep[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('admission_steps').select('*').order('step_number')
  return data ?? []
}

// â”€â”€â”€ Admin Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Board Members (full CRUD) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface BoardMember {
  id: string
  slug: string
  name: string
  board_title: string
  subtitle: string
  bio: string
  is_chair: boolean
  display_order: number
  extra_titles: string[]
  quote: string
  image_url: string
  updated_at: string
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('display_order')
    if (error || !data) return []
    return data as BoardMember[]
  } catch {
    return []
  }
}

export async function upsertBoardMember(member: Partial<BoardMember>) {
  const supabase = createAdminClient()
  const payload = { ...member, updated_at: new Date().toISOString() }
  const q = member.id
    ? supabase.from('board_members').update(payload).eq('id', member.id).select().single()
    : supabase.from('board_members').insert(payload).select().single()
  const { data, error } = await q
  if (error) throw error
  revalidatePath('/board')
  revalidatePath('/admin/board')
  return data as BoardMember
}

export async function deleteBoardMember(id: string) {
  const supabase = createAdminClient()
  await supabase.from('board_members').delete().eq('id', id)
  revalidatePath('/board')
  revalidatePath('/admin/board')
}

// â”€â”€â”€ Board Photos (legacy â€” keep for photo-only uploads) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getBoardPhotos(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('board_members')
      .select('slug, image_url')
    if (error || !data) return {}
    return Object.fromEntries(data.map((r: { slug: string; image_url: string }) => [r.slug, r.image_url]))
  } catch {
    return {}
  }
}


