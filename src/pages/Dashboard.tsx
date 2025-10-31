import { useAppStore } from '@/store/useAppStore'
import { CalorieProgress } from '@/components/features/dashboard/CalorieProgress'
import { MacroCircle } from '@/components/features/dashboard/MacroCircle'
import { MealsList } from '@/components/features/dashboard/MealsList'
import { WaterTracker } from '@/components/features/dashboard/WaterTracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingDown, Activity, Droplets } from 'lucide-react'
import { calculatePercentage } from '@/lib/utils'
import { getBodyTypeRecommendations } from '@/services/calculations'

export function Dashboard() {
  const { user, bodyMetrics, nutritionGoals, dailySummary, deleteMeal, updateWaterIntake } = useAppStore()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 pb-24">
      {/* Header with animated gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-600 px-4 pb-12 pt-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8 animate-fade-in-down">
            <div>
              <h1 className="text-3xl font-bold text-shadow-lg mb-1">Olá, {user.name}! 👋</h1>
              <p className="text-primary-100 text-shadow">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-lg font-semibold px-4 py-1.5 animate-pulse-soft">
              {bodyTypeInfo.title}
            </Badge>
          </div>

          {/* Quick Stats with glassmorphism */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <span className="text-xs opacity-90 font-medium">IMC</span>
              </div>
              <p className="text-2xl font-bold text-shadow">{bodyMetrics.bmi.toFixed(1)}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-xs opacity-90 font-medium">Meta Cal.</span>
              </div>
              <p className="text-2xl font-bold text-shadow">{Math.round(nutritionGoals.dailyCalories)}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-xs opacity-90 font-medium">Água</span>
              </div>
              <p className="text-2xl font-bold text-shadow">{(nutritionGoals.water / 1000).toFixed(1)}L</p>
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

        {/* Water Tracker */}
        <WaterTracker
          goal={nutritionGoals.water}
          current={dailySummary?.waterIntake || 0}
          onUpdate={updateWaterIntake}
        />

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
