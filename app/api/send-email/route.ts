import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, parentName, childName, programInterest, admissionNumber } = body

    if (!to || !parentName || !childName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Gmail SMTP transporter — set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your regular password)
      },
    })

    const admissionRef = admissionNumber || 'Pending Assignment'

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admission Acceptance — Hamizak Montessori Academy</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#059669);padding:40px 48px;text-align:center;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Hamizak Montessori Academy</p>
              <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;line-height:1.2;">
                🎉 Congratulations!
              </h1>
              <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Your child has been accepted!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <p style="color:#64748b;font-size:15px;margin:0 0 24px;line-height:1.7;">
                Dear <strong style="color:#0f172a;">${parentName}</strong>,
              </p>
              <p style="color:#64748b;font-size:15px;margin:0 0 24px;line-height:1.7;">
                We are delighted to inform you that your child, <strong style="color:#0f172a;">${childName}</strong>, has been 
                <strong style="color:#0d9488;">officially accepted</strong> into the 
                <strong style="color:#0f172a;">${programInterest || 'Hamizak Montessori'}</strong> programme at 
                Hamizak Montessori Academy.
              </p>

              <!-- Admission Number Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #a7f3d0;border-radius:16px;margin:28px 0;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="color:#059669;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Admission Number</p>
                    <p style="color:#0d9488;font-size:28px;font-weight:900;margin:0;letter-spacing:2px;">${admissionRef}</p>
                    <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">Keep this number for all future correspondence</p>
                  </td>
                </tr>
              </table>

              <p style="color:#64748b;font-size:15px;margin:0 0 16px;line-height:1.7;">
                Our admin team will be in touch shortly with the next steps, including:
              </p>
              <ul style="color:#64748b;font-size:15px;margin:0 0 28px;padding-left:20px;line-height:2;">
                <li>Resumption date and orientation schedule</li>
                <li>List of required school items</li>
                <li>Fee payment information</li>
                <li>Other enrollment documentation</li>
              </ul>

              <p style="color:#64748b;font-size:15px;margin:0 0 8px;line-height:1.7;">
                If you have any questions, please do not hesitate to contact us:
              </p>
              <p style="color:#0d9488;font-size:15px;font-weight:700;margin:0 0 28px;">
                📞 08032253811 / 08062418351<br/>
                📍 Sabon Lugbe, Abuja
              </p>

              <p style="color:#64748b;font-size:15px;margin:0;line-height:1.7;">
                Warm regards,<br/>
                <strong style="color:#0f172a;">The Admissions Team</strong><br/>
                <span style="color:#94a3b8;font-size:13px;">Hamizak Montessori Academy</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 48px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.8;">
                Discipline · Integrity · Excellence<br/>
                Hamizak Montessori Academy — Abuja's Premier Montessori School
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    await transporter.sendMail({
      from: `"Hamizak Montessori Academy" <${process.env.GMAIL_USER}>`,
      to,
      subject: `🎉 Admission Accepted — ${childName} | Hamizak Montessori Academy`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
