'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SiteSettings {
  company_name: string
  company_phone: string
  company_email: string
  categories: { name: string; slug: string }[]
}

const SettingsContext = createContext<SiteSettings>({
  company_name: 'Tourister',
  company_phone: '+91 99999 99999',
  company_email: 'info@tourister.com',
  categories: [],
})

export function useSiteSettings() {
  return useContext(SettingsContext)
}

export function SiteSettingsProvider({ children, initial }: { children: ReactNode; initial: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const s: Record<string, string> = {}
        data.forEach((row) => { s[row.key] = row.value })
        setSettings(prev => ({
          ...prev,
          company_name: s.company_name || prev.company_name,
          company_phone: s.company_phone || prev.company_phone,
          company_email: s.company_email || prev.company_email,
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
