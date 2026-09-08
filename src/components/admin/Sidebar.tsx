'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, MessageSquare, FolderTree, LogOut, X, Settings, Loader2, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [themeColor, setThemeColor] = useState('#2563eb')
  const [logoUrl, setLogoUrl] = useState('')
  const [companyName, setCompanyName] = useState('Tourister')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const s: Record<string, string> = {}
        data.forEach((row) => { s[row.key] = row.value })
        if (s.theme_color) setThemeColor(s.theme_color)
        if (s.logo_url) setLogoUrl(s.logo_url)
        if (s.company_name) setCompanyName(s.company_name)
      }
    })
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const handleNav = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" onClick={handleNav}>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="max-h-12 w-auto object-contain" />
            ) : (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                <MapPin className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="text-lg font-bold">{companyName}</span>
            <span className="text-xs text-white px-1.5 py-0.5 rounded font-medium ml-auto" style={{ backgroundColor: themeColor }}>Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNav}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                style={isActive ? { backgroundColor: themeColor } : undefined}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full disabled:opacity-50"
          >
            {loggingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}
