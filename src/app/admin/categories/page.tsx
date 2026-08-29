import { getAllCategoriesAdmin } from '@/app/actions/categories'
import { CreateCategoryForm } from './CreateCategoryForm'
import { CategoryList } from './CategoryList'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin().catch(() => [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-500 text-sm mt-1">{categories.length} total categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Add Category</h2>
            <CreateCategoryForm />
          </div>
        </div>
        <div className="lg:col-span-2">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}
