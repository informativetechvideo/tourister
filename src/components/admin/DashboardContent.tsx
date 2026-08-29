'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCards } from '@/components/admin/StatsCards'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react'

export function DashboardContent() {
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalCategories: 0,
  })
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const [packagesRes, enquiriesRes, categoriesRes] = await Promise.all([
        supabase.from('packages').select('id, is_active', { count: 'exact' }),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('categories').select('id', { count: 'exact' }),
      ])

      const packages = packagesRes.data || []
      const enqs = enquiriesRes.data || []

      setStats({
        totalPackages: packagesRes.count || 0,
        activePackages: packages.filter(p => p.is_active).length,
        totalEnquiries: enquiriesRes.count || 0,
        newEnquiries: enqs.filter(e => e.status === 'new').length,
        totalCategories: categoriesRes.count || 0,
      })
      setEnquiries(enqs)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <StatsCards stats={stats} />

      {/* Recent Enquiries */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Recent Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {enquiries.length > 0 ? enquiries.map((enq) => (
            <div key={enq.id} className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{enq.name}</p>
                <p className="text-xs text-slate-500 truncate">{enq.email} · {enq.package_name || 'General Enquiry'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  enq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  enq.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                  enq.status === 'converted' ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {enq.status}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(enq.created_at)}</p>
              </div>
            </div>
          )) : (
            <div className="px-6 py-8 text-center text-sm text-slate-400">
              No enquiries yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
