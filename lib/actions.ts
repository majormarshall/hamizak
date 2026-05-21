'use server'

import { createClient, createAdminClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  SiteSettings, Program, StaffMember, Testimonial,
  GalleryAlbum, GalleryImage, EventPost, ContactMessage,
  AdmissionApplication, NewsletterSubscriber, CoreValue,
  WhyChooseFeature, AdmissionStep, ApplicationStatus
} from '@/types'

// ─── Storage Actions ─────────────────────────────────────────────
export async function uploadImageServer(formData: FormData, bucket: string, folder: string) {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Convert Next.js File to Buffer for Supabase
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    console.error('Supabase upload error:', error)
    throw error
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return data.publicUrl
}

export async function deleteImageServer(url: string, bucket: string) {
  const supabase = createAdminClient()
  const path = url.split(`/${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}

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

export async function sendAdmissionEmail(
  parentEmail: string,
  parentName: string,
  childName: string,
  status: 'enrolled' | 'declined',
  admissionNumber?: string
) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const subject = status === 'enrolled'
    ? `Admission Successful - ${childName} | Hamizak Montessori Academy`
    : `Admission Status Update - ${childName} | Hamizak Montessori Academy`

  const html = status === 'enrolled'
    ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
        <h2 style="color: #0d9488; margin-top: 0;">Admission Successful!</h2>
        <p>Dear ${parentName},</p>
        <p>We are delighted to inform you that the admission application for <strong>${childName}</strong> has been <strong>approved</strong>.</p>
        ${admissionNumber ? `<p style="font-size: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; display: inline-block;">
          Assigned Admission Number: <strong>${admissionNumber}</strong>
        </p>` : ''}
        <p>Our admissions team will contact you shortly with details regarding next steps, parent orientation, and schedule/fees.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
          Best regards,<br/><strong>Hamizak Montessori Academy</strong>
        </p>
       </div>`
    : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
        <h2 style="color: #e11d48; margin-top: 0;">Admission Application Update</h2>
        <p>Dear ${parentName},</p>
        <p>Thank you for your interest in Hamizak Montessori Academy. We have reviewed your application for <strong>${childName}</strong>.</p>
        <p>At this time, we regret to inform you that we are unable to offer admission for this cycle. We appreciate the opportunity to learn about your family and wish your child the best in their academic future.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
          Best regards,<br/><strong>Hamizak Montessori Academy</strong>
        </p>
       </div>`

  if (!apiKey) {
    console.warn(`[EMAIL SIMULATION] To: ${parentEmail} | Subject: ${subject}\nBody: ${html}`)
    return { simulated: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `Hamizak Montessori Academy <${fromEmail}>`,
        to: parentEmail,
        subject: subject,
        html: html
      })
    })
    const data = await res.json()
    return { success: res.ok, data }
  } catch (err) {
    console.error('Error sending email via Resend:', err)
    throw err
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const supabase = createAdminClient()
  
  // 1. Fetch current application details to send email
  const { data: app, error: fetchError } = await supabase
    .from('admission_applications')
    .select('*')
    .eq('id', id)
    .single()
    
  if (fetchError || !app) {
    throw new Error(fetchError?.message || 'Application not found')
  }

  // 2. Update status
  const { error: updateError } = await supabase
    .from('admission_applications')
    .update({ status })
    .eq('id', id)
    
  if (updateError) throw updateError

  // 3. Send email if status is enrolled or declined
  if (status === 'enrolled' || status === 'declined') {
    const notes = app.additional_notes || ''
    const match = notes.match(/\[ADMISSION_NO:\s*([^\]]+)\]/)
    const admissionNumber = match ? match[1] : undefined
    
    try {
      await sendAdmissionEmail(
        app.parent_email,
        app.parent_name,
        app.child_name,
        status,
        admissionNumber
      )
    } catch (e) {
      console.error('Failed to send admission email:', e)
    }
  }

  revalidatePath('/admin/admissions')
}

export async function updateApplication(id: string, updates: Partial<AdmissionApplication>) {
  const supabase = createAdminClient()

  // 1. Fetch current application details to compare status and get email info
  const { data: currentApp, error: fetchError } = await supabase
    .from('admission_applications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !currentApp) {
    throw new Error(fetchError?.message || 'Application not found')
  }

  // 2. Perform the update
  const { data, error } = await supabase
    .from('admission_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // 3. Send email if status is changed to enrolled or declined
  if (updates.status && updates.status !== currentApp.status && (updates.status === 'enrolled' || updates.status === 'declined')) {
    const notes = updates.additional_notes || currentApp.additional_notes || ''
    const match = notes.match(/\[ADMISSION_NO:\s*([^\]]+)\]/)
    const admissionNumber = match ? match[1] : undefined
    
    try {
      await sendAdmissionEmail(
        currentApp.parent_email,
        currentApp.parent_name,
        currentApp.child_name,
        updates.status,
        admissionNumber
      )
    } catch (e) {
      console.error('Failed to send admission email:', e)
    }
  }

  revalidatePath('/admin/admissions')
  return data
}

export async function deleteApplication(id: string) {
  const supabase = createAdminClient()
  await supabase.from('admission_applications').delete().eq('id', id)
  revalidatePath('/admin/admissions')
}

export async function clearAllApplications() {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admission_applications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
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
