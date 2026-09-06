'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Phone } from 'lucide-react'
import { useSiteSettings } from './SiteSettingsProvider'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { company_name, company_phone, theme_color, logo_url } = useSiteSettings()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logo_url ? (
              <img src={logo_url} alt={company_name} className="h-12 md:h-14 w-auto object-contain" />
            ) : (
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme_color }}>
                <MapPin className="h-5 w-5 text-white" />
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/packages" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Packages
            </Link>
            <Link href="/enquiry" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Enquiry
            </Link>
            <a href={`tel:${company_phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
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
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-2 animate-slide-in">
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/packages" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
              Packages
            </Link>
            <Link href="/enquiry" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
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
