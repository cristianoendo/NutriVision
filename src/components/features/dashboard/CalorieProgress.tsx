import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { calculatePercentage } from '@/lib/utils'

interface CalorieProgressProps {
  current: number
  goal: number
}

export function CalorieProgress({ current, goal }: CalorieProgressProps) {
  const percentage = calculatePercentage(current, goal)
  const remaining = Math.max(0, goal - current)
  const isOverGoal = current > goal

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Calorias de Hoje
              </h3>
              <p className="text-xs text-gray-500">Meta: {goal.toLocaleString('pt-BR')} kcal</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {current.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-500">
              {isOverGoal ? (
                <span className="text-red-500">+{(current - goal).toLocaleString('pt-BR')} acima</span>
              ) : (
                <span className="text-green-500">{remaining.toLocaleString('pt-BR')} restantes</span>
              )}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${
              isOverGoal
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-green-400 to-primary-500'
            }`}
          />
          {isOverGoal && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage - 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="absolute right-0 top-0 h-full bg-red-600"
            />
          )}
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{percentage}%</span>
          <span>{goal.toLocaleString('pt-BR')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
