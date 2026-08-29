'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploader } from './ImageUploader'
import { Plus, Trash2 } from 'lucide-react'
import type { Package, ItineraryDay } from '@/types/database'

interface PackageFormProps {
  pkg?: Package
  categories: { id: string; name: string }[]
  onSubmit: (formData: FormData) => Promise<void>
}

export function PackageForm({ pkg, categories, onSubmit }: PackageFormProps) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(pkg?.images || [])
  const [highlights, setHighlights] = useState<string[]>(pkg?.highlights || [''])
  const [inclusions, setInclusions] = useState<string[]>(pkg?.inclusions || [''])
  const [exclusions, setExclusions] = useState<string[]>(pkg?.exclusions || [''])
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    pkg?.itinerary || [{ day: 1, title: '', description: '' }]
  )

  const addListItem = (list: string[], setList: (v: string[]) => void) => {
    setList([...list, ''])
  }

  const updateListItem = (list: string[], setList: (v: string[]) => void, index: number, value: string) => {
    const updated = [...list]
    updated[index] = value
    setList(updated)
  }

  const removeListItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])
  }

  const updateItinerary = (index: number, field: keyof ItineraryDay, value: string | number) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }))
    setItinerary(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      formData.set('images', JSON.stringify(images.filter(Boolean)))
      formData.set('highlights', JSON.stringify(highlights.filter(Boolean)))
      formData.set('inclusions', JSON.stringify(inclusions.filter(Boolean)))
      formData.set('exclusions', JSON.stringify(exclusions.filter(Boolean)))
      formData.set('itinerary', JSON.stringify(itinerary.filter(i => i.title)))
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const renderListEditor = (
    label: string,
    list: string[],
    setList: (v: string[]) => void,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {list.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateListItem(list, setList, i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {list.length > 1 && (
            <button type="button" onClick={() => removeListItem(list, setList, i)} className="p-2 text-red-400 hover:text-red-600 flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => addListItem(list, setList)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus className="h-4 w-4" /> Add {label}
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Basic Info</h3>

          <Input name="name" label="Package Name *" defaultValue={pkg?.name} required />
          <Input name="destination" label="Destination *" defaultValue={pkg?.destination} required />
          <Input name="country" label="Country" defaultValue={pkg?.country || ''} />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select name="category_id" defaultValue={pkg?.category_id || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Short Description</label>
            <textarea name="short_description" rows={2} defaultValue={pkg?.short_description || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Full Description</label>
            <textarea name="full_description" rows={4} defaultValue={pkg?.full_description || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input name="price" label="Price (INR) *" type="number" defaultValue={pkg?.price} required />
            <Input name="discount_price" label="Discount Price" type="number" defaultValue={pkg?.discount_price || ''} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input name="duration_days" label="Duration (Days) *" type="number" defaultValue={pkg?.duration_days} required />
            <Input name="duration_nights" label="Duration (Nights)" type="number" defaultValue={pkg?.duration_nights || ''} />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" value="true" defaultChecked={pkg?.featured} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Featured Package</span>
            </label>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Images</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {renderListEditor('Highlights', highlights, setHighlights, 'e.g., Airport Transfer')}
          {renderListEditor('Inclusions', inclusions, setInclusions, 'e.g., Breakfast Included')}
          {renderListEditor('Exclusions', exclusions, setExclusions, 'e.g., Personal Expenses')}

          {/* Itinerary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Itinerary</label>
              <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="h-4 w-4" /> Add Day
              </button>
            </div>
            {itinerary.map((day, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeItineraryDay(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateItinerary(i, 'title', e.target.value)}
                  placeholder="Day title (e.g., Arrival & Sightseeing)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <textarea
                  value={day.description}
                  onChange={(e) => updateItinerary(i, 'description', e.target.value)}
                  placeholder="Day description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="submit" loading={loading}>
          {pkg ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  )
}
