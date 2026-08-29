'use client'

import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '@/app/actions/settings'
import { Settings, Mail, Save, Loader2, Check, Bell, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [settings, setSettings] = useState({
    notification_email: '',
    notification_enabled: 'true',
    company_name: 'Tourister',
    company_email: '',
    company_phone: '',
  })

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(prev => ({
        ...prev,
        notification_email: s.notification_email || 'admin@tourister.com',
        notification_enabled: s.notification_enabled || 'true',
        company_name: s.company_name || 'Tourister',
        company_email: s.company_email || '',
        company_phone: s.company_phone || '',
      }))
      setFetching(false)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Configure your site and notification preferences</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-blue-500" />
          Email Notifications
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Receive an email notification whenever a new enquiry is submitted on your website.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Notifications</p>
              <p className="text-xs text-slate-500">Get notified when someone submits an enquiry</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, notification_enabled: s.notification_enabled === 'true' ? 'false' : 'true' }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notification_enabled === 'true' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notification_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Notification Email
            </label>
            <input
              type="email"
              value={settings.notification_email}
              onChange={(e) => setSettings(s => ({ ...s, notification_email: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@tourister.com"
            />
            <p className="text-xs text-slate-400 mt-1">Enquiry details will be sent to this email address</p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-500" />
          Company Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings(s => ({ ...s, company_name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => setSettings(s => ({ ...s, company_email: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@tourister.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={settings.company_phone}
              onChange={(e) => setSettings(s => ({ ...s, company_phone: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 99999 99999"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Settings updated successfully</span>
        )}
      </div>
    </div>
  )
}
