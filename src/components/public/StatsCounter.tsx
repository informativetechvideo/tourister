'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, MapPin, Award, Star } from 'lucide-react'

const stats = [
  { icon: Users, value: 15000, suffix: '+', label: 'Happy Travelers' },
  { icon: MapPin, value: 200, suffix: '+', label: 'Destinations' },
  { icon: Award, value: 500, suffix: '+', label: 'Tours Completed' },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', isDecimal: true },
]

function useCountUp(target: number, duration = 2000, isDecimal = false) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = Date.now()
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(isDecimal ? Number((eased * target).toFixed(1)) : Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, isDecimal])

  return { count, ref }
}

function StatItem({ icon: Icon, value, suffix, label, isDecimal }: { icon: typeof Users; value: number; suffix: string; label: string; isDecimal?: boolean }) {
  const { count, ref } = useCountUp(value, 2000, isDecimal)

  return (
    <div ref={ref} className="text-center group">
      <div className="h-14 w-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="h-7 w-7 text-amber-400" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-white">
        {isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </div>
  )
}

export function StatsCounter() {
  return (
    <section className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
