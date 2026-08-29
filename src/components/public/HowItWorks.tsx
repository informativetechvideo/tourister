import { Search, MessageSquare, CreditCard, Plane } from 'lucide-react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse Packages',
    description: 'Explore our curated collection of handpicked travel experiences across India.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Tell Us Your Vision',
    description: 'Share your preferences and let our experts craft the perfect itinerary for you.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Book & Pay Securely',
    description: 'Confirm your trip with secure payment options and flexible cancellation policies.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Plane,
    step: '04',
    title: 'Travel & Create Memories',
    description: 'Pack your bags and embark on the adventure of a lifetime with 24/7 support.',
    color: 'bg-purple-50 text-purple-600',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Your Journey in 4 Steps</h2>
          <p className="text-slate-500 mt-2">Simple, transparent, and hassle-free booking</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-blue-200 via-slate-200 to-purple-200" />

          {steps.map((s) => (
            <div key={s.step} className="text-center relative group">
              <div className={`h-16 w-16 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 relative`}>
                <s.icon className="h-7 w-7" />
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px] mx-auto">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
