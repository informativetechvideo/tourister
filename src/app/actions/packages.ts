'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function searchSuggestions(query: string) {
  if (!query || query.length < 2) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, name, slug, destination, images, price, discount_price, duration_days, duration_nights')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,destination.ilike.%${query}%,short_description.ilike.%${query}%`)
    .limit(6)

  if (error) return []
  return data || []
}

export async function getPackages(filters?: {
  category_id?: string
  destination?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  let query = supabase
    .from('packages')
    .select('*, categories(*)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }
  if (filters?.destination) {
    query = query.ilike('destination', `%${filters.destination}%`)
  }
  if (filters?.featured) {
    query = query.eq('featured', true)
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,destination.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`)
  }
  if (filters?.limit) {
    query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)
  return { packages: data, count }
}

export async function getPackageBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getPackageById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, categories(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getAllPackagesAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createPackage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const highlights = formData.get('highlights') as string
  const inclusions = formData.get('inclusions') as string
  const exclusions = formData.get('exclusions') as string
  const itineraryRaw = formData.get('itinerary') as string
  const images = formData.get('images') as string

  const { error } = await supabase.from('packages').insert({
    name,
    slug: slugify(name),
    short_description: formData.get('short_description') as string,
    full_description: formData.get('full_description') as string,
    price: Number(formData.get('price')),
    discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : null,
    duration_days: Number(formData.get('duration_days')),
    duration_nights: formData.get('duration_nights') ? Number(formData.get('duration_nights')) : null,
    destination: formData.get('destination') as string,
    country: formData.get('country') as string || null,
    category_id: formData.get('category_id') as string || null,
    highlights: highlights ? JSON.parse(highlights) : [],
    inclusions: inclusions ? JSON.parse(inclusions) : [],
    exclusions: exclusions ? JSON.parse(exclusions) : [],
    itinerary: itineraryRaw ? JSON.parse(itineraryRaw) : [],
    images: images ? JSON.parse(images) : [],
    featured: formData.get('featured') === 'true',
    is_active: true,
    created_by: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/packages')
  revalidatePath('/packages')
}

export async function updatePackage(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const highlights = formData.get('highlights') as string
  const inclusions = formData.get('inclusions') as string
  const exclusions = formData.get('exclusions') as string
  const itineraryRaw = formData.get('itinerary') as string
  const images = formData.get('images') as string

  const { error } = await supabase.from('packages').update({
    name,
    slug: slugify(name),
    short_description: formData.get('short_description') as string,
    full_description: formData.get('full_description') as string,
    price: Number(formData.get('price')),
    discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : null,
    duration_days: Number(formData.get('duration_days')),
    duration_nights: formData.get('duration_nights') ? Number(formData.get('duration_nights')) : null,
    destination: formData.get('destination') as string,
    country: formData.get('country') as string || null,
    category_id: formData.get('category_id') as string || null,
    highlights: highlights ? JSON.parse(highlights) : [],
    inclusions: inclusions ? JSON.parse(inclusions) : [],
    exclusions: exclusions ? JSON.parse(exclusions) : [],
    itinerary: itineraryRaw ? JSON.parse(itineraryRaw) : [],
    images: images ? JSON.parse(images) : [],
    featured: formData.get('featured') === 'true',
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/packages')
  revalidatePath('/packages')
  revalidatePath(`/packages/${slugify(name)}`)
}

export async function togglePackageActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('packages')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/packages')
  revalidatePath('/packages')
}

export async function deletePackage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/packages')
  revalidatePath('/packages')
}
