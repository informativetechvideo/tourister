'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { PackageForm } from '@/components/admin/PackageForm'
import { Loader2 } from 'lucide-react'
import type { Package } from '@/types/database'

export function EditPackageForm({ id }: { id: string }) {
  const router = useRouter()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('packages').select('*').eq('id', id).single(),
      supabase.from('categories').select('id, name').eq('is_active', true).order('sort_order', { ascending: true }).order('name', { ascending: true }),
    ]).then(([pkgRes, catRes]) => {
      if (pkgRes.data) setPkg(pkgRes.data as Package)
      if (catRes.data) setCategories(catRes.data)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (formData: FormData) => {
    const supabase = createClient()

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
    router.push('/admin/packages')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!pkg) {
    return <div className="py-20 text-center text-slate-500">Package not found</div>
  }

  return <PackageForm pkg={pkg} categories={categories} onSubmit={handleSubmit} />
}
