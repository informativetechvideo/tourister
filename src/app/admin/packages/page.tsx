import Link from 'next/link'
import { getAllPackagesAdmin } from '@/app/actions/packages'
import { Button } from '@/components/ui/Button'
import { formatDate, formatPrice } from '@/lib/utils'
import { Plus, Pencil, Star, MapPin, Clock, Eye } from 'lucide-react'
import { ToggleActiveButton } from './ToggleActiveButton'
import { DeletePackageButton } from './DeletePackageButton'

export const dynamic = 'force-dynamic'

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin().catch(() => [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Packages</h1>
          <p className="text-slate-500 text-sm mt-1">{packages.length} total packages</p>
        </div>
        <Link href="/admin/packages/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">New Package</span><span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      {/* Mobile: Card Layout */}
      <div className="lg:hidden space-y-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex gap-3">
              <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                {pkg.images?.[0] ? (
                  <img src={pkg.images[0]} alt={pkg.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate flex items-center gap-1">
                    {pkg.name}
                    {pkg.featured && <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />}
                  </p>
                  <ToggleActiveButton id={pkg.id} isActive={pkg.is_active} />
                </div>
                {pkg.categories && (
                  <p className="text-xs text-blue-600 mt-0.5">{pkg.categories.name}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" /> {pkg.destination}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-3 w-3" /> {pkg.duration_days}D/{pkg.duration_nights || pkg.duration_days - 1}N
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <div>
                <span className="text-base font-bold text-slate-900">{formatPrice(pkg.discount_price || pkg.price)}</span>
                {pkg.discount_price && (
                  <span className="text-xs text-slate-400 line-through ml-1">{formatPrice(pkg.price)}</span>
                )}
                <span className="text-xs text-slate-400 ml-1">/person</span>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/packages/${pkg.slug}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </Link>
                <Link href={`/admin/packages/${pkg.id}`} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeletePackageButton id={pkg.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Package</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Destination</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {pkg.images?.[0] ? (
                          <img src={pkg.images[0]} alt={pkg.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-200" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                          {pkg.name}
                          {pkg.featured && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        </p>
                        {pkg.categories && (
                          <p className="text-xs text-slate-400">{pkg.categories.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{pkg.destination}</td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-sm font-medium text-slate-900">{formatPrice(pkg.discount_price || pkg.price)}</span>
                      {pkg.discount_price && (
                        <span className="text-xs text-slate-400 line-through ml-1">{formatPrice(pkg.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{pkg.duration_days}D / {pkg.duration_nights || pkg.duration_days - 1}N</td>
                  <td className="px-4 py-3">
                    <ToggleActiveButton id={pkg.id} isActive={pkg.is_active} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(pkg.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/packages/${pkg.slug}`} target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/packages/${pkg.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePackageButton id={pkg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {packages.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-400">
          No packages yet. Create your first package!
        </div>
      )}
    </div>
  )
}
