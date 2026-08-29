'use client'

import { useState } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { submitEnquiry } from '@/app/actions/enquiries'
import { Send, Check, Loader2 } from 'lucide-react'

export default function EnquiryPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travel_date: '',
    adults: 2,
    children: 0,
    rooms: 1,
    budget: '',
    message: '',
  })

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        travel_date: formData.travel_date,
        adults: formData.adults,
        children: formData.children,
        rooms: formData.rooms,
        budget: formData.budget,
        message: `${formData.destination ? `Destination: ${formData.destination}\n` : ''}${formData.message}`,
      })
      setSuccess(true)
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Send Us Your Enquiry</h1>
          <p className="text-slate-300">Tell us about your dream vacation and we&apos;ll craft the perfect itinerary</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success ? (
          <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h2>
            <p className="text-slate-500 mb-6">Thank you for your interest. Our travel experts will contact you within 24 hours.</p>
            <button onClick={() => setSuccess(false)} className="text-blue-600 font-medium hover:text-blue-700">
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 99999 99999" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input type="email" required value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Destination</label>
              <input type="text" value={formData.destination} onChange={(e) => updateField('destination', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Goa, Bali, Thailand" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Travel Date *</label>
              <input type="date" required value={formData.travel_date} onChange={(e) => updateField('travel_date', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adults</label>
                <input type="number" min={1} value={formData.adults} onChange={(e) => updateField('adults', Number(e.target.value))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Children</label>
                <input type="number" min={0} value={formData.children} onChange={(e) => updateField('children', Number(e.target.value))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rooms</label>
                <input type="number" min={1} value={formData.rooms} onChange={(e) => updateField('rooms', Number(e.target.value))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget Range</label>
              <select value={formData.budget} onChange={(e) => updateField('budget', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Budget</option>
                <option value="Below 50000">Below Rs. 50,000</option>
                <option value="50000-100000">Rs. 50,000 - 1,00,000</option>
                <option value="100000-200000">Rs. 1,00,000 - 2,00,000</option>
                <option value="200000-300000">Rs. 2,00,000 - 3,00,000</option>
                <option value="Above 300000">Above Rs. 3,00,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Message</label>
              <textarea rows={4} value={formData.message} onChange={(e) => updateField('message', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell us about your travel preferences, special requirements, etc." />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </>
  )
}
