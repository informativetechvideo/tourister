import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: categories } = await supabase.from('categories').select('id, name')

  const catMap = new Map((categories || []).map(c => [c.id, c.name]))

  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })

  if (!packages || packages.length === 0) {
    return NextResponse.json({ error: 'No packages found' }, { status: 404 })
  }

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

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="packages-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
