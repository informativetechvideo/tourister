'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatDate, formatPrice } from '@/lib/utils'
import { Plus, Pencil, Star, MapPin, Clock, Eye, Loader2, Download, Upload, X } from 'lucide-react'
import { ToggleActiveButton } from './ToggleActiveButton'
import { DeletePackageButton } from './DeletePackageButton'

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function jsonToArray(val: any): string {
  if (!val) return ''
  if (Array.isArray(val)) {
    return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join('; ')
  }
  return String(val)
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = false
      } else { current += char }
    } else {
      if (char === '"') inQuotes = true
      else if (char === ',') { result.push(current.trim()); current = '' }
      else current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseArrayField(val: string): any[] {
  if (!val) return []
  return val.split(';').map(v => v.trim()).filter(Boolean)
}

export function AdminPackagesList() {
  const [packages, setPackages] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    const supabase = createClient()
    const [pkgRes, catRes] = await Promise.all([
      supabase.from('packages').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name'),
    ])
    setPackages(pkgRes.data || [])
    setCategories(catRes.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      const catMap = new Map(categories.map(c => [c.id, c.name]))
      const headers = [
        'name', 'short_description', 'full_description', 'price', 'discount_price',
        'duration_days', 'duration_nights', 'destination', 'country', 'category',
        'highlights', 'inclusions', 'exclusions', 'images', 'featured', 'is_active'
      ]
      const rows = packages.map(pkg => [
        escapeCSV(pkg.name),
        escapeCSV(pkg.short_description),
        escapeCSV(pkg.full_description),
        pkg.price,
        pkg.discount_price || '',
        pkg.duration_days,
        pkg.duration_nights || '',
        escapeCSV(pkg.destination),
        escapeCSV(pkg.country),
        escapeCSV(catMap.get(pkg.category_id) || ''),
        escapeCSV(jsonToArray(pkg.highlights)),
        escapeCSV(jsonToArray(pkg.inclusions)),
        escapeCSV(jsonToArray(pkg.exclusions)),
        escapeCSV(jsonToArray(pkg.images)),
        pkg.featured ? 'true' : 'false',
        pkg.is_active ? 'true' : 'false',
      ].join(','))

      const csv = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `packages-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export packages')
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportResult(null)
    setShowImportModal(true)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length < 2) {
        setImportResult({ success: 0, failed: 1, errors: ['CSV file is empty or has no data rows'] })
        setImporting(false)
        return
      }

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'))
      const catNameToId = new Map(categories.map(c => [c.name.toLowerCase(), c.id]))
      let success = 0
      let failed = 0
      const errors: string[] = []

      const supabase = createClient()

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i])
          const row: Record<string, string> = {}
          headers.forEach((h, idx) => { row[h] = values[idx] || '' })

          if (!row.name) { failed++; errors.push(`Row ${i + 1}: Missing name`); continue }

          const catName = (row.category || '').toLowerCase()
          let categoryId = catNameToId.get(catName) || null

          if (catName && !categoryId) {
            const slug = generateSlug(catName)
            const { data: newCat } = await supabase
              .from('categories')
              .insert({ name: catName.charAt(0).toUpperCase() + catName.slice(1), slug, is_active: true })
              .select('id')
              .single()
            if (newCat) { categoryId = newCat.id; catNameToId.set(catName, newCat.id) }
          }

          const pkgData = {
            name: row.name,
            slug: generateSlug(row.name),
            short_description: row.short_description || '',
            full_description: row.full_description || '',
            price: parseFloat(row.price) || 0,
            discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
            duration_days: parseInt(row.duration_days) || 1,
            duration_nights: row.duration_nights ? parseInt(row.duration_nights) : null,
            destination: row.destination || '',
            country: row.country || '',
            category_id: categoryId,
            highlights: parseArrayField(row.highlights),
            inclusions: parseArrayField(row.inclusions),
            exclusions: parseArrayField(row.exclusions),
            images: parseArrayField(row.images),
            featured: row.featured === 'true',
            is_active: row.is_active !== 'false',
          }

          const { error } = await supabase.from('packages').insert(pkgData)
          if (error) { failed++; errors.push(`Row ${i + 1} (${row.name}): ${error.message}`) }
          else success++
        } catch (err: any) {
          failed++
          errors.push(`Row ${i + 1}: ${err.message}`)
        }
      }

      setImportResult({ success, failed, errors })
      if (success > 0) fetchData()
    } catch (err) {
      setImportResult({ success: 0, failed: 1, errors: ['Failed to parse CSV file'] })
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Packages</h1>
          <p className="text-slate-500 text-sm mt-1">{packages.length} total packages</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting || packages.length === 0}>
            {exporting ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
            <span className="hidden sm:inline">Export CSV</span><span className="sm:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
            <span className="hidden sm:inline">Import CSV</span><span className="sm:hidden">Import</span>
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <Link href="/admin/packages/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">New Package</span><span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Import Result Modal */}
      {showImportModal && importResult && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Import Results</h3>
              <button onClick={() => { setShowImportModal(false); setImportResult(null) }} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                  <p className="text-xs text-green-600">Imported</p>
                </div>
                <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                  <p className="text-xs text-red-600">Failed</p>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                  <p className="text-xs font-medium text-slate-600 mb-1">Errors:</p>
                  {importResult.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600">{err}</p>
                  ))}
                </div>
              )}
              <Button onClick={() => { setShowImportModal(false); setImportResult(null) }} className="w-full">Close</Button>
            </div>
          </div>
        </div>
      )}

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
                  <ToggleActiveButton id={pkg.id} isActive={pkg.is_active} onToggle={fetchData} />
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
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/packages/${pkg.slug}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </Link>
                <Link href={`/admin/packages/${pkg.id}`} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeletePackageButton id={pkg.id} onDelete={fetchData} />
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
                    <ToggleActiveButton id={pkg.id} isActive={pkg.is_active} onToggle={fetchData} />
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
                      <DeletePackageButton id={pkg.id} onDelete={fetchData} />
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
          No packages yet. Create your first package or import from CSV!
        </div>
      )}
    </div>
  )
}
