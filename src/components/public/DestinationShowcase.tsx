'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const destinations = [
  {
    name: 'Rajasthan',
    tagline: 'Land of Kings',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop',
    packages: 12,
    color: 'from-amber-600/80 to-orange-700/80',
  },
  {
    name: 'Kerala',
    tagline: "God's Own Country",
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop',
    packages: 8,
    color: 'from-emerald-600/80 to-teal-700/80',
  },
  {
    name: 'Ladakh',
    tagline: 'The Roof of India',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop',
    packages: 6,
    color: 'from-blue-600/80 to-indigo-700/80',
  },
  {
    name: 'Goa',
    tagline: 'Beach Paradise',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=800&fit=crop',
    packages: 10,
    color: 'from-pink-500/80 to-rose-600/80',
  },
  {
    name: 'Varanasi',
    tagline: 'Spiritual Capital',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=800&fit=crop',
    packages: 5,
    color: 'from-violet-600/80 to-purple-700/80',
  },
]

export function DestinationShowcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Top Destinations</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Where Will You Go?</h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">Explore India&apos;s most breathtaking destinations, each with its own unique charm and story.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((dest, i) => (
            <Link
              key={dest.name}
              href={`/packages?q=${dest.name}`}
              className={`group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer ${
                i === 0 ? 'sm:row-span-2 sm:aspect-auto' : ''
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} group-hover:from-black/60 group-hover:to-black/20 transition-all duration-300`} />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <h3 className="text-white font-bold text-lg sm:text-xl">{dest.name}</h3>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">{dest.tagline}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/60 text-xs">{dest.packages} packages</span>
                  <span className="h-8 w-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
