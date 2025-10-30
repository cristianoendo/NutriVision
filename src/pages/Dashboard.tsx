import { useAppStore } from '@/store/useAppStore'
import { CalorieProgress } from '@/components/features/dashboard/CalorieProgress'
import { MacroCircle } from '@/components/features/dashboard/MacroCircle'
import { MealsList } from '@/components/features/dashboard/MealsList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingDown, Activity, Droplets } from 'lucide-react'
import { calculatePercentage } from '@/lib/utils'
import { getBodyTypeRecommendations } from '@/services/calculations'

export function Dashboard() {
  const { user, bodyMetrics, nutritionGoals, dailySummary, deleteMeal } = useAppStore()

  if (!user || !bodyMetrics || !nutritionGoals) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  const totalCalories = dailySummary?.totalCalories || 0
  const totalProtein = dailySummary?.totalProtein || 0
  const totalCarbs = dailySummary?.totalCarbs || 0
  const totalFats = dailySummary?.totalFats || 0

  const proteinPercentage = calculatePercentage(totalProtein, nutritionGoals.protein)
  const carbsPercentage = calculatePercentage(totalCarbs, nutritionGoals.carbs)
  const fatsPercentage = calculatePercentage(totalFats, nutritionGoals.fats)

  const bodyTypeInfo = getBodyTypeRecommendations(bodyMetrics.bodyType)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Olá, {user.name}!</h1>
              <p className="text-primary-100">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {bodyTypeInfo.title}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs opacity-90">IMC</span>
              </div>
              <p className="text-xl font-bold">{bodyMetrics.bmi.toFixed(1)}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-xs opacity-90">Meta Cal.</span>
              </div>
              <p className="text-xl font-bold">{Math.round(nutritionGoals.dailyCalories)}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="h-4 w-4" />
                <span className="text-xs opacity-90">Água</span>
              </div>
              <p className="text-xl font-bold">{(nutritionGoals.water / 1000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 -mt-4 space-y-4">
        {/* Calorie Progress */}
        <CalorieProgress current={totalCalories} goal={nutritionGoals.dailyCalories} />

        {/* Macros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Macronutrientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <MacroCircle
                label="Proteínas"
                current={totalProtein}
                goal={nutritionGoals.protein}
                unit="g"
                color="#10b981"
                percentage={proteinPercentage}
              />
              <MacroCircle
                label="Carboidratos"
                current={totalCarbs}
                goal={nutritionGoals.carbs}
                unit="g"
                color="#3b82f6"
                percentage={carbsPercentage}
              />
              <MacroCircle
                label="Gorduras"
                current={totalFats}
                goal={nutritionGoals.fats}
                unit="g"
                color="#f59e0b"
                percentage={fatsPercentage}
              />
            </div>
          </CardContent>
        </Card>

        {/* Body Type Tips */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 Dica Personalizada - {bodyTypeInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {bodyTypeInfo.description}
            </p>
            <div className="space-y-2">
              {bodyTypeInfo.tips.slice(0, 3).map((tip, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  • {tip}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meals List */}
        <MealsList meals={dailySummary?.meals || []} onDeleteMeal={deleteMeal} />

        {/* Add Meal Button - Fixed at bottom */}
        <div className="fixed bottom-20 right-4 z-10">
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
