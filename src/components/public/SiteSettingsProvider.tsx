'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SocialLink {
  label: string
  url: string
  icon: string
}

interface SiteSettings {
  company_name: string
  company_phone: string
  company_email: string
  theme_color: string
  logo_url: string
  social_links: SocialLink[]
  categories: { name: string; slug: string }[]
}

const SettingsContext = createContext<SiteSettings>({
  company_name: 'Tourister',
  company_phone: '+91 99999 99999',
  company_email: 'info@tourister.com',
  theme_color: '#2563eb',
  logo_url: '',
  social_links: [],
  categories: [],
})

export function useSiteSettings() {
  return useContext(SettingsContext)
}

function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '217 91% 60%'
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function hexToRGB(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '37 99 235'
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
}

const defaultSocialLinks: SocialLink[] = [
  { label: 'Facebook', url: '', icon: 'facebook' },
  { label: 'Instagram', url: '', icon: 'instagram' },
  { label: 'Twitter', url: '', icon: 'twitter' },
  { label: 'YouTube', url: '', icon: 'youtube' },
]

export function SiteSettingsProvider({ children, initial }: { children: ReactNode; initial: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-color', settings.theme_color)
    root.style.setProperty('--theme-hsl', hexToHSL(settings.theme_color))
    root.style.setProperty('--theme-rgb', hexToRGB(settings.theme_color))
  }, [settings.theme_color])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const s: Record<string, string> = {}
        data.forEach((row) => { s[row.key] = row.value })
        let socialLinks = initial.social_links
        if (s.social_links) {
          try { socialLinks = JSON.parse(s.social_links) } catch {}
        }
        setSettings(prev => ({
          ...prev,
          company_name: s.company_name || prev.company_name,
          company_phone: s.company_phone || prev.company_phone,
          company_email: s.company_email || prev.company_email,
          theme_color: s.theme_color || prev.theme_color,
          logo_url: s.logo_url || prev.logo_url,
          social_links: socialLinks,
        }))
      }
    })
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}
