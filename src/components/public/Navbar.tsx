'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Phone } from 'lucide-react'
import { useSiteSettings } from './SiteSettingsProvider'

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '#ffffff'
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1e293b' : '#ffffff'
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { company_name, company_phone, theme_color, logo_url, header_bg_color, header_text_color } = useSiteSettings()

  const textColor = getContrastColor(header_bg_color)
  const isLightBg = getContrastColor(header_bg_color) === '#1e293b'

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: header_bg_color,
        borderColor: isLightBg ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logo_url ? (
              <img src={logo_url} alt={company_name} className="max-h-24 w-auto object-contain" />
            ) : (
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme_color }}>
                <MapPin className="h-5 w-5 text-white" />
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:opacity-70 transition-colors" style={{ color: header_text_color }}>
              Home
            </Link>
            <Link href="/packages" className="text-sm font-medium hover:opacity-70 transition-colors" style={{ color: header_text_color }}>
              Packages
            </Link>
            <Link href="/enquiry" className="text-sm font-medium hover:opacity-70 transition-colors" style={{ color: header_text_color }}>
              Enquiry
            </Link>
            <a href={`tel:${company_phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-colors" style={{ color: header_text_color }}>
              <Phone className="h-4 w-4" />
              {company_phone}
            </a>
            <Link
              href="/enquiry"
              className="text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: theme_color }}
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:opacity-70"
            style={{ color: header_text_color }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-2 animate-slide-in" style={{ borderColor: isLightBg ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium hover:opacity-70" style={{ color: header_text_color }} onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/packages" className="block px-3 py-2 rounded-lg text-sm font-medium hover:opacity-70" style={{ color: header_text_color }} onClick={() => setMobileOpen(false)}>
              Packages
            </Link>
            <Link href="/enquiry" className="block px-3 py-2 rounded-lg text-sm font-medium hover:opacity-70" style={{ color: header_text_color }} onClick={() => setMobileOpen(false)}>
              Enquiry
            </Link>
            <Link
              href="/enquiry"
              className="block mx-3 text-center text-white px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: theme_color }}
              onClick={() => setMobileOpen(false)}
            >
              Enquire Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
