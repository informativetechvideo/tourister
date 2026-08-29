'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, MapPin, Star, Users, Search, SlidersHorizontal, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Package } from '@/types/database'

interface PackagesListProps {
  initialPackages: Array<Record<string, unknown>>
  initialCategories: Array<{ id: string; name: string }>
}

export function PackagesList({ initialPackages, initialCategories }: PackagesListProps) {
  const [packages] = useState(initialPackages as unknown as Package[])
  const [categories] = useState(initialCategories)
  const [search, setSearch] = useState('')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const discountPercent = pkg.discount_price
              ? Math.round(((pkg.price - pkg.discount_price) / pkg.price) * 100)
              : 0
            return (
              <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group block">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {pkg.images && pkg.images.length > 0 ? (
                      <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                        <MapPin className="h-12 w-12 text-blue-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {pkg.featured && (
                        <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Clock className="h-3 w-3" />
                      {pkg.duration_days}D / {pkg.duration_nights || pkg.duration_days - 1}N
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {pkg.destination}{pkg.country ? `, ${pkg.country}` : ''}
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                      {pkg.name}
                    </h3>
                    {pkg.short_description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{pkg.short_description}</p>
                    )}
                    <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">{formatPrice(pkg.discount_price || pkg.price)}</span>
                          {pkg.discount_price && <span className="text-sm text-slate-400 line-through">{formatPrice(pkg.price)}</span>}
                        </div>
                        <p className="text-xs text-slate-400">per person</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No packages found</p>
          <p className="text-slate-400 text-sm mt-1">Create some packages in the admin panel to see them here</p>
        </div>
      )}
    </div>
  )
}
