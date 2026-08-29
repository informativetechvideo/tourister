'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { SearchAutocomplete } from './SearchAutocomplete'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1920&h=1080&fit=crop',
    tag: 'Most Popular',
    title: 'Explore the Wonders of India',
    subtitle: 'From the mighty Himalayas to serene backwaters — your dream journey starts here.',
  },
  {
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&h=1080&fit=crop',
    tag: 'Heritage',
    title: 'Walk Through Living History',
    subtitle: 'Taj Mahal, Jaipur Forts, Kerala Temples — witness centuries of grandeur.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1920&h=1080&fit=crop&q=80',
    tag: 'Adventure',
    title: 'Conquer the Himalayas',
    subtitle: 'Ladakh, Spiti, Uttarakhand — thrill awaits at every altitude.',
  },
  {
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&h=1080&fit=crop',
    tag: 'Tranquility',
    title: 'Float on Kerala Backwaters',
    subtitle: 'Palm-fringed canals, houseboat luxury, and the art of slow travel.',
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <section
      className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1)' : 'scale(1.08)',
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <div
            key={`tag-${current}`}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm text-white mb-6 animate-fade-in-up"
          >
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            {slides[current].tag}
          </div>

          <h1
            key={`title-${current}`}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up"
          >
            {slides[current].title}
          </h1>

          <p
            key={`sub-${current}`}
            className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed animate-fade-in-up"
          >
            {slides[current].subtitle}
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up max-w-xl">
            <SearchAutocomplete
              placeholder="Where do you want to go?"
              large
              className="w-full"
            />
          </div>

          {/* Quick links */}
          <div className="flex gap-3 mt-6 animate-fade-in-up">
            {['Kerala', 'Ladakh', 'Rajasthan', 'Goa'].map((dest) => (
              <Link
                key={dest}
                href={`/packages?q=${dest}`}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm text-white hover:bg-white/20 transition-colors"
              >
                {dest}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
