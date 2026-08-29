import { getCategories } from '@/app/actions/categories'
import { PackageForm } from '@/components/admin/PackageForm'
import { createPackage } from '@/app/actions/packages'
import { redirect } from 'next/navigation'

export default async function NewPackagePage() {
  const categories = await getCategories().catch(() => [])

  const handleSubmit = async (formData: FormData) => {
    'use server'
    await createPackage(formData)
    redirect('/admin/packages')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Package</h1>
        <p className="text-slate-500 text-sm mt-1">Create a new tour package</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <PackageForm categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
