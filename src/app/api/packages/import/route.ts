import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
  }
  result.push(current.trim())
  return result
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseArrayField(val: string): any[] {
  if (!val) return []
  return val.split(';').map(v => v.trim()).filter(Boolean)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const text = await file.text()
  const lines = text.split('\n').filter(l => l.trim())

  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 })
  }

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'))

  const { data: categories } = await supabase.from('categories').select('id, name')
  const catNameToId = new Map((categories || []).map(c => [c.name.toLowerCase(), c.id]))

  const results = { success: 0, failed: 0, errors: [] as string[] }

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h] = values[idx] || '' })

      if (!row.name) {
        results.failed++
        results.errors.push(`Row ${i + 1}: Missing name`)
        continue
      }

      const catName = (row.category || '').toLowerCase()
      let categoryId = catNameToId.get(catName) || null

      if (catName && !categoryId) {
        const slug = generateSlug(catName)
        const { data: newCat } = await supabase
          .from('categories')
          .insert({ name: catName.charAt(0).toUpperCase() + catName.slice(1), slug, is_active: true })
          .select('id')
          .single()
        if (newCat) {
          categoryId = newCat.id
          catNameToId.set(catName, newCat.id)
        }
      }

      const slug = generateSlug(row.name)

      const pkgData = {
        name: row.name,
        slug,
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
        created_by: user.id,
      }

      const { error } = await supabase.from('packages').insert(pkgData)
      if (error) {
        results.failed++
        results.errors.push(`Row ${i + 1} (${row.name}): ${error.message}`)
      } else {
        results.success++
      }
    } catch (err: any) {
      results.failed++
      results.errors.push(`Row ${i + 1}: ${err.message}`)
    }
  }

  return NextResponse.json(results)
}
