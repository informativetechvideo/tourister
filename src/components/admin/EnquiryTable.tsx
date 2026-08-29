'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { updateEnquiryStatus, deleteEnquiry } from '@/app/actions/enquiries'
import { formatDate } from '@/lib/utils'
import { Trash2, ExternalLink, Mail, Phone, User, Calendar, Users } from 'lucide-react'
import type { Enquiry } from '@/types/database'

interface EnquiryTableProps {
  enquiries: Enquiry[]
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  new: { label: 'New', variant: 'info' },
  contacted: { label: 'Contacted', variant: 'warning' },
  converted: { label: 'Converted', variant: 'success' },
  closed: { label: 'Closed', variant: 'default' },
}

export function EnquiryTable({ enquiries }: EnquiryTableProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(true)
    try {
      await updateEnquiryStatus(id, status)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return
    await deleteEnquiry(id)
    setSelectedEnquiry(null)
  }

  return (
    <>
      {/* Mobile: Card Layout */}
      <div className="lg:hidden space-y-3">
        {enquiries.map((enq) => (
          <div key={enq.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{enq.name}</p>
                  <p className="text-xs text-slate-500 truncate">{enq.email}</p>
                </div>
              </div>
              <Badge variant={statusConfig[enq.status]?.variant || 'default'}>
                {statusConfig[enq.status]?.label || enq.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {enq.travel_date ? formatDate(enq.travel_date) : 'Not set'}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {enq.adults}A + {enq.children}C
              </div>
            </div>

            {enq.package_name && (
              <p className="text-xs text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded inline-block">{enq.package_name}</p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <select
                value={enq.status}
                onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                disabled={loading}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[36px]"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
              <div className="flex items-center gap-1">
                <button onClick={() => setSelectedEnquiry(enq)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(enq.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Travel Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Travelers</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{enq.name}</p>
                      <p className="text-xs text-slate-500">{enq.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{enq.package_name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{enq.travel_date ? formatDate(enq.travel_date) : '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{enq.adults}A + {enq.children}C</td>
                  <td className="px-4 py-3">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      disabled={loading}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(enq.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedEnquiry(enq)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(enq.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {enquiries.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-400">
          No enquiries found
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedEnquiry} onClose={() => setSelectedEnquiry(null)} title="Enquiry Details" size="lg">
        {selectedEnquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Name</p>
                <p className="text-sm text-slate-900">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Phone</p>
                <p className="text-sm text-slate-900 flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedEnquiry.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Email</p>
                <p className="text-sm text-slate-900 flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Package</p>
                <p className="text-sm text-slate-900">{selectedEnquiry.package_name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Travel Date</p>
                <p className="text-sm text-slate-900">{selectedEnquiry.travel_date ? formatDate(selectedEnquiry.travel_date) : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Travelers</p>
                <p className="text-sm text-slate-900">{selectedEnquiry.adults} Adults, {selectedEnquiry.children} Children, {selectedEnquiry.rooms} Rooms</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Budget</p>
                <p className="text-sm text-slate-900">{selectedEnquiry.budget || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Status</p>
                <Badge variant={statusConfig[selectedEnquiry.status]?.variant || 'default'}>
                  {statusConfig[selectedEnquiry.status]?.label || selectedEnquiry.status}
                </Badge>
              </div>
            </div>
            {selectedEnquiry.message && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Message</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg mt-1">{selectedEnquiry.message}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="danger" size="sm" onClick={() => handleDelete(selectedEnquiry.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
