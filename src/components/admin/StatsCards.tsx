import { Package, MessageSquare, FolderTree, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalPackages: number
    activePackages: number
    totalEnquiries: number
    newEnquiries: number
    totalCategories: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: 'Total Packages', value: stats.totalPackages, icon: Package, color: 'bg-blue-500' },
    { label: 'Active Packages', value: stats.activePackages, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'bg-amber-500' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: MessageSquare, color: 'bg-red-500' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderTree, color: 'bg-purple-500' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`h-10 w-10 ${card.color} rounded-lg flex items-center justify-center`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
