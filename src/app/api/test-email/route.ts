import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get SMTP settings from DB
    const { data: settings } = await supabase.from('settings').select('key, value')
    const s: Record<string, string> = {}
    settings?.forEach((row) => { s[row.key] = row.value })

    if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) {
      return NextResponse.json({ success: false, error: 'SMTP not configured. Please fill in SMTP settings first.' })
    }

    if (!s.notification_email) {
      return NextResponse.json({ success: false, error: 'Notification email not set.' })
    }

    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
      host: s.smtp_host,
      port: Number(s.smtp_port) || 587,
      secure: Number(s.smtp_port) === 465,
      auth: {
        user: s.smtp_user,
        pass: s.smtp_pass,
      },
    })

    await transporter.sendMail({
      from: `"${s.smtp_from_name || 'Tourister'}" <${s.smtp_user}>`,
      to: s.notification_email,
      subject: 'Test Email — Tourister Notifications',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 18px;">Email Notifications Working!</h1>
          </div>
          <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <p style="color: #334155; font-size: 14px;">This is a test email from your Tourister admin panel.</p>
            <p style="color: #334155; font-size: 14px;">When someone submits an enquiry on your website, you will receive an email like this with all the details.</p>
            <div style="margin-top: 16px; padding: 12px; background: #dcfce7; border-radius: 8px; text-align: center;">
              <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0;">SMTP Configuration is working correctly</p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Test email error:', err)
    return NextResponse.json({ success: false, error: err.message || 'Failed to send email' })
  }
}
