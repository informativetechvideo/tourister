'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from './Sidebar'
import { Menu, MapPin } from 'lucide-react'
import Link from 'next/link'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = ['/admin/login', '/admin/signup', '/admin/setup'].includes(pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isPublicPage) return

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/admin/login'
      }
    })
  }, [isPublicPage])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-slate-900 text-white h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold">Tourister</span>
          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">Admin</span>
        </Link>
      </div>

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto lg:pt-0 pt-14">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
