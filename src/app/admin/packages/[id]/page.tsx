import { EditPackageForm } from './EditPackageForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Package</h1>
        <p className="text-slate-500 text-sm mt-1">Update package details</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <EditPackageForm id={id} />
      </div>
    </div>
  )
}
