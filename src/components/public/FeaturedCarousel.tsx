'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, ArrowRight } from 'lucide-react'

interface Package {
  id: string
  name: string
  slug: string
  short_description: string | null
  price: number
  discount_price: number | null
  duration_days: number
  duration_nights: number | null
  destination: string
  images: string[]
  featured: boolean
  categories?: { name: string }
}

export function FeaturedCarousel({ packages }: { packages: Package[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 380
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (!packages.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Curated For You</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Featured Packages</h2>
            <p className="text-slate-500 mt-2">Handpicked journeys for unforgettable experiences</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll('left')} className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <button onClick={() => scroll('right')} className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-4 sm:px-6 lg:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {packages.map((pkg) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group flex-shrink-0 w-[340px] snap-start bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-52 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: pkg.images?.[0] ? `url(${pkg.images[0]})` : undefined }}
              />
              {!pkg.images?.[0] && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-white/40" />
                </div>
              )}
              {pkg.discount_price && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {Math.round(((pkg.price - pkg.discount_price) / pkg.price) * 100)}% OFF
                </div>
              )}
              {pkg.featured && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> Featured
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {pkg.destination}
              </div>
            </div>

            <div className="p-5">
              {pkg.categories?.name && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {pkg.categories.name}
                </span>
              )}
              <h3 className="font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                {pkg.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{pkg.short_description}</p>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {pkg.duration_days}D{pkg.duration_nights ? `/${pkg.duration_nights}N` : ''}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 4.8
                </span>
              </div>

              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  {pkg.discount_price && (
                    <span className="text-sm text-slate-400 line-through block">₹{pkg.price.toLocaleString()}</span>
                  )}
                  <span className="text-xl font-bold text-slate-900">
                    ₹{(pkg.discount_price || pkg.price).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/person</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  View <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center">
        <Link href="/packages" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All Packages <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
