'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface PackageFiltersProps {
  categories: { id: string; name: string }[]
  onFilterChange: (filters: {
    search?: string
    category_id?: string
    sort?: string
  }) => void
}

export function PackageFilters({ categories, onFilterChange }: PackageFiltersProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, category_id: category, sort })
  }

  const handleCategory = (value: string) => {
    setCategory(value)
    onFilterChange({ search, category_id: value, sort })
  }

  const handleSort = (value: string) => {
    setSort(value)
    onFilterChange({ search, category_id: category, sort: value })
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setSort('newest')
    onFilterChange({ search: '', category_id: '', sort: 'newest' })
  }

  const hasFilters = search || category || sort !== 'newest'

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search packages, destinations..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
            showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-slide-in">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Sort By</label>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
