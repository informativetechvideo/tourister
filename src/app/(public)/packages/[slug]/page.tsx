import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { PackageCard } from '@/components/public/PackageCard'
import { EnquiryButton } from './EnquiryButton'
import { getPackageBySlug, getPackages } from '@/app/actions/packages'
import { formatPrice } from '@/lib/utils'
import { Clock, MapPin, Star, Check, X as XIcon, Calendar, Users, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const pkg = await getPackageBySlug(slug)
    return { title: `${pkg.name} - Tourister`, description: pkg.short_description }
  } catch {
    return { title: 'Package Not Found - Tourister' }
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params

  let pkg
  try {
    pkg = await getPackageBySlug(slug)
  } catch {
    notFound()
  }

  const relatedPackages = await getPackages({
    category_id: pkg.category_id || undefined,
    limit: 3,
  }).catch(() => ({ packages: [] }))

  const relatedFiltered = relatedPackages.packages.filter(p => p.id !== pkg.id).slice(0, 3)

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/packages" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> All Packages
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{pkg.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 sm:h-96 bg-slate-100">
        {pkg.images && pkg.images.length > 0 ? (
          <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <MapPin className="h-20 w-20 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            {pkg.featured && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{pkg.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.destination}{pkg.country ? `, ${pkg.country}` : ''}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration_days} Days / {pkg.duration_nights || pkg.duration_days - 1} Nights</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {pkg.full_description && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">About This Package</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{pkg.full_description}</p>
              </section>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(pkg.highlights as string[]).map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {(pkg.itinerary as { day: number; title: string; description: string }[]).map((day: { day: number; title: string; description: string }, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {day.day}
                        </div>
                        {i < pkg.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-medium text-slate-900">{day.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Inclusions</h2>
                  <div className="space-y-2">
                    {(pkg.inclusions as string[]).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Exclusions</h2>
                  <div className="space-y-2">
                    {(pkg.exclusions as string[]).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <XIcon className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Price */}
              <div className="text-center pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Starting from</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-slate-900">{formatPrice(pkg.discount_price || pkg.price)}</span>
                  {pkg.discount_price && (
                    <span className="text-lg text-slate-400 line-through">{formatPrice(pkg.price)}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">per person</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-600">{pkg.duration_days} Days / {pkg.duration_nights || pkg.duration_days - 1} Nights</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-600">{pkg.destination}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-600">2-6 Travelers</span>
                </div>
                {pkg.categories && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-600">{pkg.categories.name}</span>
                  </div>
                )}
              </div>

              {/* Enquiry Button */}
              <EnquiryButton packageName={pkg.name} packageId={pkg.id} />

              <p className="text-xs text-slate-400 text-center">
                Get a free customized quote within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        {relatedFiltered.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFiltered.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  )
}
