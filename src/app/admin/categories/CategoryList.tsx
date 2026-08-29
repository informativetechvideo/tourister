'use client'

import { deleteCategory, updateCategory } from '@/app/actions/categories'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '@/types/database'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDesc(cat.description || '')
  }

  const handleSave = async (id: string) => {
    const formData = new FormData()
    formData.set('name', editName)
    formData.set('description', editDesc)
    await updateCategory(id, formData)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {categories.map((cat) => (
          <div key={cat.id} className="px-4 py-3 flex items-center justify-between gap-4">
            {editingId === cat.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={() => handleSave(cat.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-slate-900">{cat.name}</p>
                  <p className="text-xs text-slate-400">{cat.description || 'No description'} · {cat.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(cat)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No categories yet
          </div>
        )}
      </div>
    </div>
  )
}
