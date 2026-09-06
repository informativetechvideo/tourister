import { createClient } from '@/lib/supabase/server'
import { SiteSettingsProvider } from '@/components/public/SiteSettingsProvider'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('key, value')

  const s: Record<string, string> = {}
  data?.forEach((row) => { s[row.key] = row.value })

  const initial = {
    company_name: s.company_name || 'Tourister',
    company_phone: s.company_phone || '+91 99999 99999',
    company_email: s.company_email || 'info@tourister.com',
  }

  return (
    <SiteSettingsProvider initial={initial}>
      {children}
    </SiteSettingsProvider>
  )
}
