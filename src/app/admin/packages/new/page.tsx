import { NewPackageForm } from './NewPackageForm'

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">New Package</h1>
        <p className="text-slate-500 text-sm mt-1">Create a new tour package</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <NewPackageForm />
      </div>
    </div>
  )
}
