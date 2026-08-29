'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadImage(file: File, folder: string = 'packages') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('package-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('package-images')
    .getPublicUrl(data.path)

  return publicUrl
}
