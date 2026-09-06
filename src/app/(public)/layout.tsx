import { createClient } from '@/lib/supabase/server'
import { SiteSettingsProvider } from '@/components/public/SiteSettingsProvider'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const [settingsRes, categoriesRes] = await Promise.all([
    supabase.from('settings').select('key, value'),
    supabase.from('categories').select('name, slug').eq('is_active', true).order('sort_order', { ascending: true }).order('name', { ascending: true }),
  ])

  const s: Record<string, string> = {}
  settingsRes.data?.forEach((row) => { s[row.key] = row.value })

  const initial = {
    company_name: s.company_name || 'Tourister',
    company_phone: s.company_phone || '+91 99999 99999',
    company_email: s.company_email || 'info@tourister.com',
    categories: categoriesRes.data || [],
  }

  return (
    <SiteSettingsProvider initial={initial}>
      {children}
    </SiteSettingsProvider>
  )
}
