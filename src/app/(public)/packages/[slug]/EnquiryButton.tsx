'use client'

import { useState } from 'react'
import { EnquiryModal } from '@/components/public/EnquiryModal'
import { MessageSquare } from 'lucide-react'

interface EnquiryButtonProps {
  packageName: string
  packageId: string
}

export function EnquiryButton({ packageName, packageId }: EnquiryButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
      >
        <MessageSquare className="h-5 w-5" />
        Enquire Now
      </button>
      <EnquiryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        packageName={packageName}
        packageId={packageId}
      />
    </>
  )
}
