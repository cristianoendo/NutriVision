import { useState } from 'react'
import { Droplets, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface WaterTrackerProps {
  goal: number // ml
  current?: number // ml
  onUpdate?: (amount: number) => void
}

export function WaterTracker({ goal, current = 0, onUpdate }: WaterTrackerProps) {
  const [consumed, setConsumed] = useState(current)

  const addWater = (amount: number) => {
    const newAmount = Math.min(consumed + amount, goal * 1.5) // Max 150% of goal
    setConsumed(newAmount)
    onUpdate?.(newAmount)
  }

  const removeWater = (amount: number) => {
    const newAmount = Math.max(consumed - amount, 0)
    setConsumed(newAmount)
    onUpdate?.(newAmount)
  }

  const percentage = Math.min((consumed / goal) * 100, 100)
  const remainingML = Math.max(goal - consumed, 0)
  const remainingGlasses = Math.ceil(remainingML / 250) // 250ml = 1 glass

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-blue-500" />
          Hidratação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {consumed}ml / {goal}ml
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(percentage)}%
            </span>
          </div>
          <Progress
            value={percentage}
            indicatorClassName="bg-gradient-to-r from-blue-400 to-cyan-500"
          />
        </div>

        {/* Remaining */}
        {remainingML > 0 ? (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💧 Faltam <strong>{remainingML}ml</strong> para sua meta
              {remainingGlasses > 0 && (
                <> (aprox. {remainingGlasses} copo{remainingGlasses > 1 ? 's' : ''})</>
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <p className="text-sm font-semibold text-green-900 dark:text-green-200">
              🎉 Meta de hidratação atingida!
            </p>
          </div>
        )}

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[250, 500, 750, 1000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => addWater(amount)}
              className="flex flex-col h-auto py-2"
            >
              <Plus className="h-3 w-3 mb-1" />
              <span className="text-xs">{amount}ml</span>
            </Button>
          ))}
        </div>

        {/* Custom Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeWater(250)}
            disabled={consumed === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex h-12 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <span className="text-lg font-bold">{consumed}ml</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => addWater(250)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
