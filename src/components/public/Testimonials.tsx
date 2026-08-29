'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'PS',
    rating: 5,
    text: 'Our Kerala houseboat trip was absolutely magical! Every detail was perfectly arranged. The team made our anniversary celebration truly special.',
    tour: 'Kerala Backwater Bliss',
  },
  {
    name: 'Rahul Verma',
    location: 'Delhi',
    avatar: 'RV',
    rating: 5,
    text: 'The Ladakh expedition was a life-changing experience. The guides were knowledgeable and safety was the top priority. Already planning my next trip!',
    tour: 'Ladakh Adventure Expedition',
  },
  {
    name: 'Anjali Patel',
    location: 'Bangalore',
    avatar: 'AP',
    rating: 5,
    text: 'Best Rajasthan tour ever! The palace hotels were stunning, and the desert safari was unforgettable. Great value for money.',
    tour: 'Rajasthan Royal Heritage',
  },
  {
    name: 'Vikram Singh',
    location: 'Pune',
    avatar: 'VS',
    rating: 5,
    text: 'Family trip to Goa was完美 perfect! Kids loved the water sports, and we enjoyed the heritage walk. Will book again for sure.',
    tour: 'Goa Beach Holiday',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">What Our Travelers Say</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 relative">
                    <Quote className="h-10 w-10 text-blue-100 absolute top-6 right-6" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.name}</div>
                        <div className="text-sm text-slate-500">{t.location} &middot; {t.tour}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors hidden sm:flex"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors hidden sm:flex"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-blue-600 w-8' : 'bg-slate-200 w-2 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
