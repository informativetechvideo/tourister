'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitEnquiry(formData: {
  package_id?: string
  package_name?: string
  name: string
  email: string
  phone: string
  travel_date?: string
  adults?: number
  children?: number
  rooms?: number
  budget?: string
  message?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('enquiries').insert({
    package_id: formData.package_id || null,
    package_name: formData.package_name || null,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    travel_date: formData.travel_date || null,
    adults: formData.adults || 2,
    children: formData.children || 0,
    rooms: formData.rooms || 1,
    budget: formData.budget || null,
    message: formData.message || null,
    status: 'new',
  })

  if (error) throw new Error(error.message)

  // Send notification email
  try {
    const { data: settings } = await supabase.from('settings').select('key, value')
    const settingsMap: Record<string, string> = {}
    settings?.forEach(s => { settingsMap[s.key] = s.value })

    if (settingsMap.notification_enabled === 'true' && settingsMap.notification_email) {
      await sendNotificationEmail(settingsMap.notification_email, {
        ...formData,
        created_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      })
    }
  } catch (err) {
    console.error('Failed to send notification email:', err)
  }

  return { success: true }
}

async function sendNotificationEmail(to: string, enquiry: {
  name: string
  email: string
  phone: string
  travel_date?: string
  adults?: number
  children?: number
  rooms?: number
  budget?: string
  message?: string
  package_name?: string
  created_at: string
}) {
  const nodemailer = require('nodemailer')

  // Use configured SMTP or fallback to console log
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpHost) {
    // No SMTP configured — log the enquiry to console
    console.log('\n========================================')
    console.log('NEW ENQUIRY NOTIFICATION')
    console.log('========================================')
    console.log(`To: ${to}`)
    console.log(`Name: ${enquiry.name}`)
    console.log(`Email: ${enquiry.email}`)
    console.log(`Phone: ${enquiry.phone}`)
    console.log(`Package: ${enquiry.package_name || 'General'}`)
    console.log(`Travel Date: ${enquiry.travel_date || 'Not specified'}`)
    console.log(`Travelers: ${enquiry.adults || 2} Adults, ${enquiry.children || 0} Children, ${enquiry.rooms || 1} Rooms`)
    console.log(`Budget: ${enquiry.budget || 'Not specified'}`)
    console.log(`Message: ${enquiry.message || 'No message'}`)
    console.log(`Submitted: ${enquiry.created_at}`)
    console.log('========================================\n')
    return
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort) || 587,
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">New Enquiry Received</h1>
        <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Tourister</p>
      </div>
      <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px;">Name</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${enquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Phone</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="tel:${enquiry.phone}">${enquiry.phone}</a></td>
          </tr>
          ${enquiry.package_name ? `<tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Package</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${enquiry.package_name}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Travel Date</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${enquiry.travel_date || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Travelers</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${enquiry.adults || 2} Adults, ${enquiry.children || 0} Children, ${enquiry.rooms || 1} Rooms</td>
          </tr>
          ${enquiry.budget ? `<tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Budget</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${enquiry.budget}</td>
          </tr>` : ''}
          ${enquiry.message ? `<tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Message</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${enquiry.message.replace(/\n/g, '<br>')}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/enquiries" style="display: inline-block; background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Dashboard</a>
        </div>
      </div>
      <div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
        Submitted on ${enquiry.created_at}
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Tourister" <${smtpUser || 'noreply@tourister.com'}>`,
    to,
    subject: `New Enquiry from ${enquiry.name}${enquiry.package_name ? ` — ${enquiry.package_name}` : ''}`,
    html,
    replyTo: enquiry.email,
  })
}

export async function getEnquiries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/enquiries')
}

export async function deleteEnquiry(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('enquiries').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/enquiries')
}
