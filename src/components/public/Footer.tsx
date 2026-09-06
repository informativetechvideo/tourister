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

export function Footer() {
  const { company_name, company_phone, company_email, theme_color, logo_url, social_links } = useSiteSettings()

  const activeLinks = social_links.filter(l => l.url)

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {logo_url ? (
                <img src={logo_url} alt={company_name} className="h-12 w-auto object-contain" />
              ) : (
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme_color }}>
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-slate-900">{company_name}</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Creating unforgettable travel experiences with handpicked destinations and personalized service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Home</Link></li>
              <li><Link href="/packages" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">All Packages</Link></li>
              <li><Link href="/enquiry" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Send Enquiry</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4" style={{ color: theme_color }} />
                {company_phone}
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" style={{ color: theme_color }} />
                {company_email}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Follow Us</h4>
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
              <p className="text-sm text-slate-400">No social links configured</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {company_name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
