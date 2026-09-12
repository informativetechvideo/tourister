import Link from 'next/link'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { HeroCarousel } from '@/components/public/HeroCarousel'
import { StatsCounter } from '@/components/public/StatsCounter'
import { PackageGrid } from '@/components/public/PackageGrid'
import { DestinationShowcase } from '@/components/public/DestinationShowcase'
import { HowItWorks } from '@/components/public/HowItWorks'
import { Testimonials } from '@/components/public/Testimonials'
import { CTABanner } from '@/components/public/CTABanner'
import { CategoryCard } from '@/components/public/CategoryCard'
import { Shield, Headphones, MapPin, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: packages }, { data: categories }] = await Promise.all([
    supabase
      .from('packages')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(6),
  ])

  return (
    <>
      <Navbar />

      <HeroCarousel />

      <StatsCounter />

      {/* Packages */}
      {packages && packages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Discover</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Our Packages</h2>
              <p className="text-slate-500 mt-2">Handpicked journeys for unforgettable experiences</p>
            </div>
            <PackageGrid packages={packages} />
            <div className="mt-10 text-center">
              <Link href="/packages" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All Packages →
              </Link>
            </div>
          </div>
        </section>
      )}

      <DestinationShowcase />

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Explore</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Browse by Category</h2>
              <p className="text-slate-500 mt-2">Find the perfect style for your next adventure</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      <HowItWorks />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Our Promise</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Why Travel With Us</h2>
            <p className="text-slate-500 mt-2">We don&apos;t just plan trips, we craft experiences</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified & Safe', desc: 'Every property and partner is thoroughly vetted for your safety.', color: 'bg-blue-50 text-blue-600' },
              { icon: Headphones, title: '24/7 Concierge', desc: 'Round-the-clock support, anywhere in India, anytime you need.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: MapPin, title: 'Local Expertise', desc: 'Our on-ground experts know every hidden gem and secret spot.', color: 'bg-amber-50 text-amber-600' },
              { icon: Award, title: 'Best Price Promise', desc: 'Found a better price? We&apos;ll match it and add a bonus.', color: 'bg-purple-50 text-purple-600' },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`h-14 w-14 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CTABanner />

      <Footer />
    </>
  )
}
