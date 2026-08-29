'use client'

import { togglePackageActive } from '@/app/actions/packages'
import { Eye, EyeOff } from 'lucide-react'

export function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const handleToggle = async () => {
    await togglePackageActive(id, !isActive)
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
