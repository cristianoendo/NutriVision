import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Meal } from '@/types'

interface MealsListProps {
  meals: Meal[]
  onDeleteMeal?: (mealId: string) => void
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  'morning-snack': 'Lanche da Manhã',
  lunch: 'Almoço',
  'afternoon-snack': 'Lanche da Tarde',
  dinner: 'Jantar',
  'evening-snack': 'Ceia',
}

export function MealsList({ meals, onDeleteMeal }: MealsListProps) {
  if (meals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma refeição registrada hoje.
            <br />
            Adicione sua primeira refeição!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Refeições de Hoje</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {MEAL_TYPE_LABELS[meal.type]}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {format(new Date(meal.timestamp), 'HH:mm', { locale: ptBR })}
                  </div>
                </div>

                <div className="space-y-1">
                  {meal.foods.map((food, index) => (
                    <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {food.name} {food.portion && `(${food.portion})`}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="font-medium">
                    <span className="text-orange-500">{Math.round(meal.totalCalories)}</span> kcal
                  </span>
                  <span>
                    P: <span className="font-medium">{Math.round(meal.totalProtein)}g</span>
                  </span>
                  <span>
                    C: <span className="font-medium">{Math.round(meal.totalCarbs)}g</span>
                  </span>
                  <span>
                    G: <span className="font-medium">{Math.round(meal.totalFats)}g</span>
                  </span>
                  {meal.avgGlycemicIndex && (
                    <span>
                      IG: <span className="font-medium">{Math.round(meal.avgGlycemicIndex)}</span>
                    </span>
                  )}
                </div>
              </div>

              {onDeleteMeal && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteMeal(meal.id)}
                  className="ml-2 h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
