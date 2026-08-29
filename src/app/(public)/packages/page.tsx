import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { PackagesList } from '@/components/public/PackagesList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tour Packages - Tourister',
  description: 'Browse our curated collection of domestic and international tour packages.',
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.q === 'string' ? params.q : undefined

  let initialPackages: Array<Record<string, unknown>> = []
  let initialCategories: Array<{ id: string; name: string }> = []

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const catResult = await supabase.from('categories').select('id, name').eq('is_active', true).order('name')
    if (!catResult.error && catResult.data) initialCategories = catResult.data

    let query = supabase.from('packages').select('*, categories(*)').eq('is_active', true).order('created_at', { ascending: false })
    if (search) query = query.or(`name.ilike.%${search}%,destination.ilike.%${search}%`)

    const pkgResult = await query
    if (!pkgResult.error && pkgResult.data) initialPackages = pkgResult.data as Array<Record<string, unknown>>
  } catch {}

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tour Packages</h1>
          <p className="text-slate-300">Explore our curated collection of handpicked travel experiences</p>
        </div>
      </div>
      <PackagesList initialPackages={initialPackages} initialCategories={initialCategories} />
      <Footer />
    </>
  )
}
