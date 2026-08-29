'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { searchSuggestions } from '@/app/actions/packages'

interface Suggestion {
  id: string
  name: string
  slug: string
  destination: string
  images: string[]
  price: number
  discount_price: number | null
  duration_days: number
}

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  inputClassName?: string
  large?: boolean
}

export function SearchAutocomplete({ placeholder = 'Search destinations, packages...', className = '', inputClassName = '', large = false }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const results = await searchSuggestions(q)
      setSuggestions(results)
      setOpen(results.length > 0)
    } catch {
      setSuggestions([])
    }
    setLoading(false)
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    setHighlightIndex(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form action="/packages" method="GET" className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} />
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-white text-slate-900 focus:outline-none ${large ? 'pl-13 pr-32 py-5 text-base rounded-2xl shadow-2xl' : 'pl-11 pr-24 py-3.5 text-sm rounded-xl shadow-lg'} ${inputClassName}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); inputRef.current?.focus() }}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${large ? 'right-28' : 'right-20'}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors ${large ? 'px-8 py-3 rounded-xl text-base' : 'px-5 py-2 rounded-lg text-sm'}`}
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          )}
          {!loading && suggestions.map((s, i) => (
            <Link
              key={s.id}
              href={`/packages/${s.slug}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === highlightIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                {s.images?.[0] ? (
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${s.images[0]})` }} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900 truncate">{s.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />{s.destination}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-3 w-3" />{s.duration_days}D
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-slate-900">
                  ₹{(s.discount_price || s.price).toLocaleString()}
                </div>
                {s.discount_price && (
                  <div className="text-xs text-slate-400 line-through">₹{s.price.toLocaleString()}</div>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
            </Link>
          ))}
          {!loading && (
            <Link
              href={`/packages?q=${encodeURIComponent(query)}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-slate-100"
            >
              View all results for &ldquo;{query}&rdquo; →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
