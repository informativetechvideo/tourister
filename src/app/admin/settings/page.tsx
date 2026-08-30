'use client'

import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '@/app/actions/settings'
import { Settings, Mail, Save, Loader2, Check, Bell, Globe, Server, Send, TestTube } from 'lucide-react'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    notification_email: '',
    notification_enabled: 'true',
    company_name: 'Tourister',
    company_email: '',
    company_phone: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from_name: 'Tourister',
  })

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(prev => ({
        ...prev,
        notification_email: s.notification_email || '',
        notification_enabled: s.notification_enabled || 'true',
        company_name: s.company_name || 'Tourister',
        company_email: s.company_email || '',
        company_phone: s.company_phone || '',
        smtp_host: s.smtp_host || '',
        smtp_port: s.smtp_port || '587',
        smtp_user: s.smtp_user || '',
        smtp_pass: s.smtp_pass || '',
        smtp_from_name: s.smtp_from_name || 'Tourister',
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

  const handleTestEmail = async () => {
    if (!settings.smtp_host || !settings.smtp_user || !settings.notification_email) {
      alert('Please fill SMTP host, username, and notification email first.')
      return
    }
    setTesting(true)
    try {
      await updateSettings(settings)
      const res = await fetch('/api/test-email', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert('Test email sent successfully! Check your inbox.')
      } else {
        alert(`Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      alert('Failed to send test email')
    } finally {
      setTesting(false)
    }
  }

  const update = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }))

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
        <p className="text-slate-500 text-sm mt-1">Configure your site, email, and notifications</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-blue-500" />
          Email Notifications
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Receive an email notification whenever a new enquiry is submitted.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Notifications</p>
              <p className="text-xs text-slate-500">Get notified when someone submits an enquiry</p>
            </div>
            <button
              type="button"
              onClick={() => update('notification_enabled', settings.notification_enabled === 'true' ? 'false' : 'true')}
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
              onChange={(e) => update('notification_email', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@tourister.com"
            />
            <p className="text-xs text-slate-400 mt-1">Enquiry details will be sent to this email</p>
          </div>
        </div>
      </div>

      {/* SMTP Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Server className="h-5 w-5 text-blue-500" />
          SMTP Email Settings
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Configure your email server to send enquiry notifications.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host *</label>
              <input
                type="text"
                value={settings.smtp_host}
                onChange={(e) => update('smtp_host', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port *</label>
              <input
                type="number"
                value={settings.smtp_port}
                onChange={(e) => update('smtp_port', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="587"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username (Email) *</label>
            <input
              type="text"
              value={settings.smtp_user}
              onChange={(e) => update('smtp_user', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password (App Password) *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.smtp_pass}
                onChange={(e) => update('smtp_pass', e.target.value)}
                className="w-full px-3 py-2.5 pr-16 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="xxxx-xxxx-xxxx-xxxx"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              For Gmail, use an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-600 hover:underline">App Password</a> (not your regular password)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From Name</label>
            <input
              type="text"
              value={settings.smtp_from_name}
              onChange={(e) => update('smtp_from_name', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tourister"
            />
          </div>

          {/* SMTP Provider Quick Fill */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-600 mb-2">Quick fill for popular providers:</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { update('smtp_host', 'smtp.gmail.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                Gmail
              </button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.office365.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                Outlook
              </button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.zoho.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                Zoho
              </button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.hostinger.com'); update('smtp_port', '465') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                Hostinger
              </button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.gmail.com'); update('smtp_port', '465') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                Gmail (SSL)
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testing}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
            {testing ? 'Sending test...' : 'Send Test Email'}
          </button>
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
              onChange={(e) => update('company_name', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => update('company_email', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@tourister.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={settings.company_phone}
              onChange={(e) => update('company_phone', e.target.value)}
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
