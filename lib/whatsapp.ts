/**
 * lib/whatsapp.ts
 * Pure helpers for WhatsApp number formatting, messages, and deep links.
 * 100% safe to import in both Client and Server components.
 */

/** Clean phone number into international WhatsApp format (e.g. 2349151556664) */
export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone) return '2349151556664'
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return '234' + digits.slice(1)
  return digits || '2349151556664'
}

/** Format a message body for WhatsApp */
export function formatWhatsAppContactMessage({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}): string {
  const parts = [
    `*🔔 NEW INQUIRY - HAMIZAK MONTESSORI ACADEMY*`,
    ``,
    `*From:* ${name}`,
    `*Email:* ${email}`,
    phone ? `*Phone:* ${phone}` : null,
    subject ? `*Subject:* ${subject}` : null,
    ``,
    `*Message:*`,
    message,
    ``,
    `_Sent via hamizak.com.ng_`,
  ].filter(Boolean)

  return parts.join('\n')
}

/** Generate a wa.me direct link */
export function generateWhatsAppLink(phone: string, text: string): string {
  const clean = cleanWhatsAppNumber(phone)
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}
