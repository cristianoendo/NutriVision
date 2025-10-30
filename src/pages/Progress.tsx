import { useState } from 'react'
import { TrendingDown, TrendingUp, Activity, Calendar, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressCharts } from '@/components/features/progress/ProgressCharts'
import { useAppStore } from '@/store/useAppStore'
import { format, subDays, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function Progress() {
  const { user, bodyMetrics, meals } = useAppStore()
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  if (!user || !bodyMetrics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  // Generate mock data for last 7 days (em produção, viria do histórico real)
  const generateWeekData = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayMeals = meals.filter((meal) => {
        const mealDate = startOfDay(new Date(meal.timestamp))
        return mealDate.getTime() === startOfDay(date).getTime()
      })

      const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0)
      const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0)
      const totalCarbs = dayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0)
      const totalFats = dayMeals.reduce((sum, meal) => sum + meal.totalFats, 0)

      data.push({
        day: format(date, 'EEE', { locale: ptBR }),
        calories: totalCalories || Math.floor(Math.random() * 500) + 1500,
        protein: totalProtein || Math.floor(Math.random() * 40) + 80,
        carbs: totalCarbs || Math.floor(Math.random() * 80) + 150,
        fats: totalFats || Math.floor(Math.random() * 30) + 40,
        weight: user.weight - Math.random() * 0.5,
      })
    }
    return data
  }

  const weekData = generateWeekData()

  // Calculate stats
  const totalMealsThisWeek = meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp)
    const weekAgo = subDays(new Date(), 7)
    return mealDate >= weekAgo
  }).length

  const avgCaloriesPerDay =
    weekData.reduce((sum, day) => sum + day.calories, 0) / weekData.length

  const weightChange = weekData[0].weight && weekData[weekData.length - 1].weight
    ? (weekData[weekData.length - 1].weight! - weekData[0].weight!)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Progresso</h1>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Semana
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refeições</p>
                  <p className="text-2xl font-bold">{totalMealsThisWeek}</p>
                  <p className="text-xs text-gray-500">esta semana</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Média Diária</p>
                  <p className="text-2xl font-bold">{Math.round(avgCaloriesPerDay)}</p>
                  <p className="text-xs text-gray-500">calorias/dia</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Peso</p>
                  <p className="text-2xl font-bold">
                    {weightChange >= 0 ? '+' : ''}
                    {weightChange.toFixed(1)} kg
                  </p>
                  <p className="text-xs text-gray-500">esta semana</p>
                </div>
                <div className={`rounded-full p-3 ${
                  weightChange < 0
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {weightChange < 0 ? (
                    <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Conquistas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {totalMealsThisWeek >= 14 && (
                <Badge variant="success" className="bg-green-500 text-white">
                  🎯 Consistência: {totalMealsThisWeek} refeições registradas
                </Badge>
              )}
              {weightChange < 0 && (
                <Badge variant="success" className="bg-purple-500 text-white">
                  💪 Progresso: {Math.abs(weightChange).toFixed(1)}kg perdidos
                </Badge>
              )}
              {avgCaloriesPerDay < 2000 && (
                <Badge variant="success" className="bg-blue-500 text-white">
                  ⚖️ Controle: Média calórica equilibrada
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <ProgressCharts data={weekData} type="calories" />
        <ProgressCharts data={weekData} type="macros" />
        <ProgressCharts data={weekData} type="weight" />

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo Semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Calorias</span>
              <span className="font-semibold">
                {Math.round(weekData.reduce((sum, day) => sum + day.calories, 0)).toLocaleString('pt-BR')} kcal
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Proteínas</span>
              <span className="font-semibold">
                {Math.round(weekData.reduce((sum, day) => sum + day.protein, 0))}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Carboidratos</span>
              <span className="font-semibold">
                {Math.round(weekData.reduce((sum, day) => sum + day.carbs, 0))}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Gorduras</span>
              <span className="font-semibold">
                {Math.round(weekData.reduce((sum, day) => sum + day.fats, 0))}g
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
