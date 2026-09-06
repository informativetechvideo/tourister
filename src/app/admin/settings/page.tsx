'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Mail, Save, Loader2, Check, Bell, Globe, Server, TestTube, Palette, Upload, X, MapPin, Link2, Plus, Trash2 } from 'lucide-react'

interface SocialLink {
  label: string
  url: string
  icon: string
}

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
    theme_color: '#2563eb',
    logo_url: '',
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { label: 'Facebook', url: '', icon: 'facebook' },
    { label: 'Instagram', url: '', icon: 'instagram' },
    { label: 'Twitter', url: '', icon: 'twitter' },
    { label: 'YouTube', url: '', icon: 'youtube' },
  ])
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const s: Record<string, string> = {}
        data.forEach((row) => { s[row.key] = row.value })
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
          theme_color: s.theme_color || '#2563eb',
          logo_url: s.logo_url || '',
        }))
        if (s.social_links) {
          try { setSocialLinks(JSON.parse(s.social_links)) } catch {}
        }
      }
      setFetching(false)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const supabase = createClient()
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      }
      await supabase
        .from('settings')
        .upsert({ key: 'social_links', value: JSON.stringify(socialLinks), updated_at: new Date().toISOString() }, { onConflict: 'key' })
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
      const supabase = createClient()
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      }
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage
        .from('package-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('package-images').getPublicUrl(fileName)
      update('logo_url', publicUrl)
    } catch (err) {
      alert('Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const presetColors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Cyan', value: '#0891b2' },
    { name: 'Slate', value: '#475569' },
  ]

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

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-blue-500" />
          Appearance
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Customize your site's theme color and logo.
        </p>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 flex-shrink-0">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="h-full w-full object-contain p-1" />
                ) : (
                  <MapPin className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                </label>
                {settings.logo_url && (
                  <button
                    type="button"
                    onClick={() => update('logo_url', '')}
                    className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                  >
                    <X className="h-3 w-3" /> Remove logo
                  </button>
                )}
                <p className="text-xs text-slate-400 mt-1">Recommended: 200x50px, PNG or SVG</p>
              </div>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.theme_color}
                onChange={(e) => update('theme_color', e.target.value)}
                className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme_color}
                onChange={(e) => update('theme_color', e.target.value)}
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#2563eb"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => update('theme_color', color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    settings.theme_color === color.value ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: settings.theme_color }}>
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">{settings.company_name || 'Tourister'}</span>
              <button
                type="button"
                className="ml-auto text-white px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: settings.theme_color }}
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
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

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-600 mb-2">Quick fill for popular providers:</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { update('smtp_host', 'smtp.gmail.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">Gmail</button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.office365.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">Outlook</button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.zoho.com'); update('smtp_port', '587') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">Zoho</button>
              <button type="button" onClick={() => { update('smtp_host', 'smtp.hostinger.com'); update('smtp_port', '465') }} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">Hostinger</button>
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

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Link2 className="h-5 w-5 text-blue-500" />
          Social Media Links
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Add your social media profiles. These will appear in the footer.
        </p>

        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 w-24 flex-shrink-0">{link.label}</span>
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const updated = [...socialLinks]
                  updated[index] = { ...updated[index], url: e.target.value }
                  setSocialLinks(updated)
                }}
                placeholder={`https://${link.label.toLowerCase()}.com/yourpage`}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
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
          className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors"
          style={{ backgroundColor: settings.theme_color }}
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
