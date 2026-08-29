import Link from 'next/link'
import { Shield, Star, Headphones, CheckCircle } from 'lucide-react'

export function StatsBar() {
  const stats = [
    { icon: Star, label: '4.5 Rated', sublabel: 'Google Reviews' },
    { icon: CheckCircle, label: '100% Customised', sublabel: 'Trips' },
    { icon: Shield, label: '98% Visa', sublabel: 'Success Rate' },
    { icon: Headphones, label: '24x7', sublabel: 'Concierge' },
  ]

  return (
    <section className="bg-slate-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 whitespace-nowrap">
              <stat.icon className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
