'use client'

import { useState } from 'react'
import { submitEnquiry } from '@/app/actions/enquiries'
import { X, ChevronLeft, ChevronRight, Check, Send, Loader2 } from 'lucide-react'

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  packageName?: string
  packageId?: string
}

export function EnquiryModal({ isOpen, onClose, packageName, packageId }: EnquiryModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await submitEnquiry({
        ...formData,
        package_id: packageId,
        package_name: packageName,
      })
      setSuccess(true)
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { num: 1, label: 'Personal Info' },
    { num: 2, label: 'Travel Details' },
    { num: 3, label: 'Review' },
  ]

  const canNext = () => {
    if (step === 1) return formData.name && formData.email && formData.phone
    if (step === 2) return formData.travel_date
    return true
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Send Enquiry</h3>
            {packageName && <p className="text-sm text-slate-500 mt-0.5">{packageName}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        {!success && (
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= s.num ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Enquiry Submitted!</h4>
              <p className="text-slate-500 mb-6">We&apos;ll get back to you within 24 hours.</p>
              <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Personal Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 99999 99999"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Travel Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Travel Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Travel Date *</label>
                    <input
                      type="date"
                      value={formData.travel_date}
                      onChange={(e) => updateField('travel_date', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Adults</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.adults}
                        onChange={(e) => updateField('adults', Number(e.target.value))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Children</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.children}
                        onChange={(e) => updateField('children', Number(e.target.value))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rooms</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.rooms}
                        onChange={(e) => updateField('rooms', Number(e.target.value))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Budget Range</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Budget</option>
                      <option value="Below 50000">Below Rs. 50,000</option>
                      <option value="50000-100000">Rs. 50,000 - 1,00,000</option>
                      <option value="100000-200000">Rs. 1,00,000 - 2,00,000</option>
                      <option value="200000-300000">Rs. 2,00,000 - 3,00,000</option>
                      <option value="Above 300000">Above Rs. 3,00,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Review Your Enquiry</h4>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Personal Info</p>
                      <p className="text-sm text-slate-700">{formData.name}</p>
                      <p className="text-sm text-slate-500">{formData.email} | {formData.phone}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Travel Details</p>
                      <p className="text-sm text-slate-700">Date: {formData.travel_date}</p>
                      <p className="text-sm text-slate-500">
                        {formData.adults} Adults, {formData.children} Children, {formData.rooms} Room(s)
                      </p>
                      {formData.budget && <p className="text-sm text-slate-500">Budget: {formData.budget}</p>}
                    </div>
                    {formData.message && (
                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Message</p>
                        <p className="text-sm text-slate-500">{formData.message}</p>
                      </div>
                    )}
                    {packageName && (
                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Package</p>
                        <p className="text-sm text-slate-700 font-medium">{packageName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between gap-3">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={() => canNext() && setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Enquiry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
