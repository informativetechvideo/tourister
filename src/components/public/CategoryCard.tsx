import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Category } from '@/types/database'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg">{category.name}</h3>
          {category.description && (
            <p className="text-white/70 text-sm line-clamp-1">{category.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
