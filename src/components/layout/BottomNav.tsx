import { Home, PlusCircle, TrendingUp, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'add', label: 'Adicionar', icon: PlusCircle },
  { id: 'progress', label: 'Progresso', icon: TrendingUp },
  { id: 'recipes', label: 'Receitas', icon: BookOpen },
  { id: 'profile', label: 'Perfil', icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isAddButton = tab.id === 'add'

          if (isAddButton) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
