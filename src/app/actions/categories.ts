'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getAllCategoriesAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  const { error } = await supabase.from('categories').insert({
    name,
    slug: slugify(name),
    description: formData.get('description') as string || null,
    image_url: formData.get('image_url') as string || null,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  const { error } = await supabase.from('categories').update({
    name,
    slug: slugify(name),
    description: formData.get('description') as string || null,
    image_url: formData.get('image_url') as string || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}
