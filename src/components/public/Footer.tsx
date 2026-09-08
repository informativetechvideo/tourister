'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Globe, Heart, Send, MessageCircle, Share2, Rss } from 'lucide-react'
import { useSiteSettings } from './SiteSettingsProvider'

const socialIcons: Record<string, typeof Globe> = {
  facebook: Globe,
  instagram: Heart,
  twitter: MessageCircle,
  youtube: Rss,
  globe: Globe,
  heart: Heart,
  send: Send,
  share: Share2,
}

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '#64748b'
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#64748b' : '#cbd5e1'
}

function getHeadingColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '#1e293b'
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1e293b' : '#f1f5f9'
}

export function Footer() {
  const { company_name, company_phone, company_email, theme_color, logo_url, footer_bg_color, footer_text_color, social_links } = useSiteSettings()

  const activeLinks = social_links.filter(l => l.url)
  const headingColor = getHeadingColor(footer_bg_color)
  const bodyColor = footer_text_color || getContrastColor(footer_bg_color)
  const isDarkBg = getContrastColor(footer_bg_color) === '#cbd5e1'

  return (
    <footer style={{ backgroundColor: footer_bg_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              {logo_url ? (
                <img src={logo_url} alt={company_name} className="h-12 w-auto object-contain" />
              ) : (
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme_color }}>
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              )}
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: bodyColor }}>
              Creating unforgettable travel experiences with handpicked destinations and personalized service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: headingColor }}>Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:opacity-70 transition-colors" style={{ color: bodyColor }}>Home</Link></li>
              <li><Link href="/packages" className="text-sm hover:opacity-70 transition-colors" style={{ color: bodyColor }}>All Packages</Link></li>
              <li><Link href="/enquiry" className="text-sm hover:opacity-70 transition-colors" style={{ color: bodyColor }}>Send Enquiry</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: headingColor }}>Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm" style={{ color: bodyColor }}>
                <Phone className="h-4 w-4" style={{ color: theme_color }} />
                {company_phone}
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: bodyColor }}>
                <Mail className="h-4 w-4" style={{ color: theme_color }} />
                {company_email}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: headingColor }}>Follow Us</h4>
            {activeLinks.length > 0 ? (
              <div className="flex gap-3">
                {activeLinks.map((link, i) => {
                  const Icon = socialIcons[link.icon] || Globe
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-80"
                      style={{ backgroundColor: theme_color }}
                      title={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: bodyColor }}>No social links configured</p>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 text-center text-sm" style={{ borderTop: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, color: bodyColor }}>
          &copy; {new Date().getFullYear()} {company_name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
