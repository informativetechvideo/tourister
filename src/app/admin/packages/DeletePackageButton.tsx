'use client'

import { deletePackage } from '@/app/actions/packages'
import { Trash2 } from 'lucide-react'

export function DeletePackageButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package?')) return
    await deletePackage(id)
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
