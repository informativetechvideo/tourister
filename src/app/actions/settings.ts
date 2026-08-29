'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) return null
  return data?.value || null
}

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')

  if (error || !data) return {}
  const settings: Record<string, string> = {}
  for (const row of data) {
    settings[row.key] = row.value
  }
  return settings
}

export async function updateSetting(key: string, value: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}

export async function updateSettings(settings: Record<string, string>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/settings')
}
