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

  let socialLinks = [
    { label: 'Facebook', url: '', icon: 'facebook' },
    { label: 'Instagram', url: '', icon: 'instagram' },
    { label: 'Twitter', url: '', icon: 'twitter' },
    { label: 'YouTube', url: '', icon: 'youtube' },
  ]
  if (s.social_links) {
    try { socialLinks = JSON.parse(s.social_links) } catch {}
  }

  const initial = {
    company_name: s.company_name || 'Tourister',
    company_phone: s.company_phone || '+91 99999 99999',
    company_email: s.company_email || 'info@tourister.com',
    theme_color: s.theme_color || '#2563eb',
    logo_url: s.logo_url || '',
    social_links: socialLinks,
    categories: categoriesRes.data || [],
  }

  return (
    <SiteSettingsProvider initial={initial}>
      {children}
    </SiteSettingsProvider>
  )
}
