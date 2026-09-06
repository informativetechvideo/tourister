'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export function DeletePackageButton({ id, onDelete }: { id: string; onDelete?: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('packages').delete().eq('id', id)
    setLoading(false)
    if (onDelete) onDelete()
  }

  if (loading) {
    return <span className="p-1.5"><Loader2 className="h-4 w-4 animate-spin text-slate-400" /></span>
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
