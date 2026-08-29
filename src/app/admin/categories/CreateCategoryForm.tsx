'use client'

import { useState } from 'react'
import { createCategory } from '@/app/actions/categories'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loader2 } from 'lucide-react'

export function CreateCategoryForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('description', description)
      await createCategory(formData)
      setName('')
      setDescription('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="e.g., Domestic"
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Brief description..."
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Add Category
      </Button>
    </form>
  )
}
