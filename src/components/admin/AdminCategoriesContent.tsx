'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Pencil, Trash2, Check, X, Plus, Loader2, FolderOpen, ToggleLeft, ToggleRight, ChevronUp, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const supabase = createClient()

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.sort_order || 0), 0)
    const { error } = await supabase.from('categories').insert({
      name: newName.trim(),
      slug: slugify(newName.trim()),
      description: newDesc.trim() || null,
      is_active: true,
      sort_order: maxOrder + 1,
    })
    if (!error) {
      setNewName('')
      setNewDesc('')
      fetchCategories()
    }
    setCreating(false)
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    setSavingId(id)
    const { error } = await supabase.from('categories').update({
      name: editName.trim(),
      slug: slugify(editName.trim()),
      description: editDesc.trim() || null,
    }).eq('id', id)
    if (!error) {
      setEditId(null)
      fetchCategories()
    }
    setSavingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    setDeletingId(id)
    await supabase.from('categories').delete().eq('id', id)
    setDeletingId(null)
    fetchCategories()
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id)
    await supabase.from('categories').update({ is_active: !currentActive }).eq('id', id)
    setTogglingId(null)
    fetchCategories()
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = categories.findIndex(c => c.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === categories.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const current = categories[idx]
    const swap = categories[swapIdx]

    setReorderingId(id)

    const currentOrder = current.sort_order || 0
    const swapOrder = swap.sort_order || 0

    await Promise.all([
      supabase.from('categories').update({ sort_order: swapOrder }).eq('id', current.id),
      supabase.from('categories').update({ sort_order: currentOrder }).eq('id', swap.id),
    ])

    setReorderingId(null)
    fetchCategories()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-500 text-sm mt-1">{categories.length} total categories — drag to reorder display on website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Add Category</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Category Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g., Domestic"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description..."
                />
              </div>
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {creating ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* Category List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {categories.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <FolderOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No categories yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((cat, index) => (
                  <div key={cat.id} className="px-4 py-3 flex items-center justify-between gap-4">
                    {editId === cat.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Category name"
                        />
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Description"
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            disabled={savingId === cat.id}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          >
                            {savingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => handleReorder(cat.id, 'up')}
                              disabled={index === 0 || reorderingId === cat.id}
                              className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReorder(cat.id, 'down')}
                              disabled={index === categories.length - 1 || reorderingId === cat.id}
                              className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900">{cat.name}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                cat.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {cat.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{cat.description || 'No description'} · {cat.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleToggleActive(cat.id, cat.is_active)}
                            disabled={togglingId === cat.id}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            title={cat.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {togglingId === cat.id ? <Loader2 className="h-5 w-5 animate-spin" /> : cat.is_active ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditDesc(cat.description || '') }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deletingId === cat.id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
