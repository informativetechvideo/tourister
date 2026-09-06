'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function ToggleActiveButton({ id, isActive, onToggle }: { id: string; isActive: boolean; onToggle?: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('packages').update({ is_active: !isActive, updated_at: new Date().toISOString() }).eq('id', id)
    setLoading(false)
    if (onToggle) onToggle()
  }

  if (loading) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-400"><Loader2 className="h-3 w-3 animate-spin" /></span>
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}
