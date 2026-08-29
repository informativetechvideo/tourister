import { notFound } from 'next/navigation'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { PackageCard } from '@/components/public/PackageCard'
import { getCategoryBySlug } from '@/app/actions/categories'
import { getPackages } from '@/app/actions/packages'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const cat = await getCategoryBySlug(slug)
    return { title: `${cat.name} Packages - Tourister`, description: cat.description }
  } catch {
    return { title: 'Category Not Found - Tourister' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  let category
  try {
    category = await getCategoryBySlug(slug)
  } catch {
    notFound()
  }

  const { packages } = await getPackages({ category_id: category.id }).catch(() => ({ packages: [], count: 0 }))

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        {category.image_url && (
          <img src={category.image_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/packages" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Packages
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-slate-300 max-w-2xl">{category.description}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No packages found in this category</p>
            <Link href="/packages" className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2 inline-block">
              Browse All Packages
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
