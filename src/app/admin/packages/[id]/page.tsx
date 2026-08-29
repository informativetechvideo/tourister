import { notFound, redirect } from 'next/navigation'
import { getPackageById } from '@/app/actions/packages'
import { getCategories } from '@/app/actions/categories'
import { PackageForm } from '@/components/admin/PackageForm'
import { updatePackage } from '@/app/actions/packages'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params

  let pkg
  try {
    pkg = await getPackageById(id)
  } catch {
    notFound()
  }

  const categories = await getCategories().catch(() => [])

  const handleSubmit = async (formData: FormData) => {
    'use server'
    await updatePackage(id, formData)
    redirect('/admin/packages')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Package</h1>
        <p className="text-slate-500 text-sm mt-1">Update {pkg.name}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <PackageForm pkg={pkg} categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
