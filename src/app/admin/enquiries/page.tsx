import { getEnquiries } from '@/app/actions/enquiries'
import { EnquiryTable } from '@/components/admin/EnquiryTable'

export const dynamic = 'force-dynamic'

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries().catch(() => [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
        <p className="text-slate-500 text-sm mt-1">{enquiries.length} total enquiries</p>
      </div>

      <EnquiryTable enquiries={enquiries} />
    </div>
  )
}
