'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Loader2, Check } from 'lucide-react'
import Link from 'next/link'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (signupError) {
        setResult({ type: 'error', message: signupError.message })
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        setResult({ type: 'success', message: 'Account created! Redirecting...' })
        setTimeout(() => { window.location.href = '/admin' }, 1000)
      } else {
        setResult({ type: 'success', message: 'Account created! Check your email to confirm, then sign in.' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setResult({ type: 'error', message: msg })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Setup</h1>
          <p className="text-sm text-slate-500 mt-1">Create your first admin account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSetup} className="space-y-4">
            {result && (
              <div className={`px-4 py-3 rounded-lg text-sm ${result.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {result.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@tourister.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Setting up...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link href="/admin/login" className="text-xs text-blue-600">Already have an account? Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
