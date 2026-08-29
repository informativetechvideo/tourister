'use client'

import Link from 'next/link'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-72 w-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-8 left-[15%] h-4 w-4 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-20 right-[20%] h-3 w-3 bg-amber-400/30 rounded-full animate-float-delayed" />
      <div className="absolute bottom-16 left-[25%] h-5 w-5 bg-white/15 rounded-full animate-float" />
      <div className="absolute bottom-8 right-[30%] h-2 w-2 bg-blue-300/40 rounded-full animate-float-delayed" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm text-white/90 mb-6">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Limited Time Offer — 20% Off on All Packages
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          Your Dream Vacation<br />Is Just One Click Away
        </h2>

        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
          Get a free personalised itinerary crafted by our travel experts. No hidden costs, no obligations — just pure travel magic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/enquiry"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Plan My Trip Free <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="tel:+919999999999"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/20 transition-all"
          >
            <Phone className="h-5 w-5" /> Call Us Now
          </a>
        </div>
      </div>

    </section>
  )
}
