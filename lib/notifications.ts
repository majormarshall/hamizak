/**
 * lib/notifications.ts
 * Multi-channel server-side notification service for contact messages and admission applications.
 */

export { cleanWhatsAppNumber, formatWhatsAppContactMessage, generateWhatsAppLink } from './whatsapp'
import { cleanWhatsAppNumber, formatWhatsAppContactMessage, generateWhatsAppLink } from './whatsapp'

/**
 * Dispatch automated notifications to school admin for a new contact message
 */
export async function notifyAdminNewMessage(params: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  const { name, email, phone, subject, message } = params

  const targetWhatsApp = cleanWhatsAppNumber(
    process.env.WHATSAPP_NOTIFICATION_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2349151556664'
  )
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL

  const formattedText = formatWhatsAppContactMessage(params)

  // 1. CallMeBot WhatsApp Automated Notification (if API key is configured)
  if (callMeBotApiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${targetWhatsApp}&text=${encodeURIComponent(formattedText)}&apikey=${callMeBotApiKey}`
      const res = await fetch(url)
      if (!res.ok) {
        console.warn('CallMeBot notification status:', res.status)
      } else {
        console.log('✅ WhatsApp notification sent via CallMeBot')
      }
    } catch (err) {
      console.error('Failed to send CallMeBot WhatsApp alert:', err)
    }
  }

  // 2. Custom Webhook Notification (if configured, e.g. Zapier, Make, Green-API, UltraMsg)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'contact_message',
          name,
          email,
          phone: phone || '',
          subject: subject || '',
          message,
          formattedText,
          timestamp: new Date().toISOString(),
        }),
      })
      console.log('✅ Webhook notification dispatched')
    } catch (err) {
      console.error('Failed to dispatch webhook notification:', err)
    }
  }

  // 3. Admin Instant Email Alert via Gmail SMTP (Dynamic import keeps client bundles clean)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      const waReplyLink = phone
        ? generateWhatsAppLink(phone, `Hello ${name}, thank you for contacting Hamizak Montessori Academy regarding "${subject || 'your enquiry'}".`)
        : null

      await transporter.sendMail({
        from: `Hamizak Website Alerts <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `🔔 New Website Message: ${name} — ${subject || 'Enquiry'}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 24px 32px; color: white;">
              <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.75);">Hamizak Montessori Academy</p>
              <h2 style="margin: 8px 0 0; font-size: 20px; font-weight: 800;">🔔 New Contact Message Received</h2>
            </div>
            <div style="padding: 32px; color: #334155; line-height: 1.6;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 100px; font-weight: 600;">Name:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0d9488;"><a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Phone / WA:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${phone}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Subject:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${subject || '(No subject)'}</td>
                </tr>
              </table>

              <div style="background: #f8fafc; border-left: 4px solid #0d9488; padding: 16px 20px; border-radius: 8px; margin-bottom: 28px;">
                <p style="margin: 0 0 6px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Message Content</p>
                <p style="margin: 0; font-size: 14px; color: #1e293b; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Enquiry at Hamizak Montessori Academy')}" 
                   style="display: inline-block; background: #0d9488; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">
                  ✉️ Reply via Email
                </a>
                ${waReplyLink ? `
                <a href="${waReplyLink}" target="_blank"
                   style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-left: 8px;">
                  💬 Reply on WhatsApp
                </a>` : ''}
              </div>
            </div>
            <div style="padding: 16px 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">
              Hamizak Montessori Academy • Sabon Lugbe, Airport Road, Abuja
            </div>
          </div>
        `,
      })
      console.log('✅ Admin notification email sent successfully')
    } catch (err) {
      console.error('Failed to send admin notification email:', err)
    }
  }
}

/**
 * Dispatch automated notifications to school admin for a new admission application
 */
export async function notifyAdminNewApplication(params: {
  parent_name: string
  parent_email: string
  parent_phone: string
  child_name: string
  program_interest: string
}) {
  const { parent_name, parent_email, parent_phone, child_name, program_interest } = params
  const targetWhatsApp = cleanWhatsAppNumber(
    process.env.WHATSAPP_NOTIFICATION_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2349151556664'
  )
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL

  const formattedText = [
    `*🎓 NEW ADMISSION APPLICATION - HAMIZAK*`,
    ``,
    `*Child Name:* ${child_name}`,
    `*Program:* ${program_interest}`,
    `*Parent Name:* ${parent_name}`,
    `*Phone:* ${parent_phone}`,
    `*Email:* ${parent_email}`,
    ``,
    `_Check admin portal: hamizak.com.ng/admin/admissions_`,
  ].join('\n')

  // 1. CallMeBot WhatsApp
  if (callMeBotApiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${targetWhatsApp}&text=${encodeURIComponent(formattedText)}&apikey=${callMeBotApiKey}`
      await fetch(url)
    } catch (err) {
      console.error('Failed to send CallMeBot application alert:', err)
    }
  }

  // 2. Custom Webhook
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'admission_application',
          ...params,
          formattedText,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error('Failed to dispatch webhook for application:', err)
    }
  }

  // 3. Admin Instant Email Alert via Gmail SMTP (Dynamic import)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      const waReplyLink = parent_phone
        ? generateWhatsAppLink(parent_phone, `Hello ${parent_name}, thank you for submitting an admission application for ${child_name} at Hamizak Montessori Academy.`)
        : null

      await transporter.sendMail({
        from: `Hamizak Admissions Alerts <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: parent_email,
        subject: `🎓 New Admission Application: ${child_name} (${parent_name})`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 24px 32px; color: white;">
              <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.75);">Hamizak Montessori Academy</p>
              <h2 style="margin: 8px 0 0; font-size: 20px; font-weight: 800;">🎓 New Admission Application Received</h2>
            </div>
            <div style="padding: 32px; color: #334155; line-height: 1.6;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px; font-weight: 600;">Child's Name:</td>
                  <td style="padding: 8px 0; font-size: 15px; font-weight: 800; color: #0d9488;">${child_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Program:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${program_interest}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Parent/Guardian:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${parent_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Parent Phone:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${parent_phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Parent Email:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0d9488;"><a href="mailto:${parent_email}" style="color: #0d9488; text-decoration: none;">${parent_email}</a></td>
                </tr>
              </table>

              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="https://hamizak.com.ng/admin/admissions" 
                   style="display: inline-block; background: #0d9488; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">
                  📋 View in Admin Portal
                </a>
                ${waReplyLink ? `
                <a href="${waReplyLink}" target="_blank"
                   style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-left: 8px;">
                  💬 Chat with Parent on WhatsApp
                </a>` : ''}
              </div>
            </div>
          </div>
        `,
      })
    } catch (err) {
      console.error('Failed to send admin admission email:', err)
    }
  }
}
