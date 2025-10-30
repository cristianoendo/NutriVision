import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Camera, Mic, Barcode, Loader2, Check } from 'lucide-react'
import { analyzeFood } from '@/services/aiService'
import type { Meal, MealType, FoodItem } from '@/types'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Café da Manhã' },
  { value: 'morning-snack', label: 'Lanche da Manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'afternoon-snack', label: 'Lanche da Tarde' },
  { value: 'dinner', label: 'Jantar' },
  { value: 'evening-snack', label: 'Ceia' },
]

export function AddMeal() {
  const { user, addMeal } = useAppStore()
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [foodInput, setFoodInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedFoods, setAnalyzedFoods] = useState<FoodItem[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAnalyze = async () => {
    if (!foodInput.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeFood({
        input: foodInput,
        inputType: 'text',
        userProfile: user || undefined,
        timestamp: new Date(),
      })

      setAnalyzedFoods(result.foods)
    } catch (error) {
      console.error('Error analyzing food:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveMeal = () => {
    if (analyzedFoods.length === 0) return

    const totalCalories = analyzedFoods.reduce((sum, food) => sum + food.calories, 0)
    const totalProtein = analyzedFoods.reduce((sum, food) => sum + food.protein, 0)
    const totalCarbs = analyzedFoods.reduce((sum, food) => sum + food.carbs, 0)
    const totalFats = analyzedFoods.reduce((sum, food) => sum + food.fats, 0)
    const totalFiber = analyzedFoods.reduce((sum, food) => sum + (food.fiber || 0), 0)

    // Calculate average glycemic index
    const foodsWithGI = analyzedFoods.filter((f) => f.glycemicIndex)
    const avgGlycemicIndex =
      foodsWithGI.length > 0
        ? foodsWithGI.reduce((sum, f) => sum + (f.glycemicIndex || 0), 0) / foodsWithGI.length
        : undefined

    const meal: Meal = {
      id: crypto.randomUUID(),
      userId: user?.id || '',
      type: mealType,
      foods: analyzedFoods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      totalFiber,
      avgGlycemicIndex,
      timestamp: new Date(),
    }

    addMeal(meal)

    // Show success and reset
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setFoodInput('')
      setAnalyzedFoods([])
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Adicionar Refeição</h1>

        {/* Meal Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipo de Refeição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMealType(type.value)}
                  className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                    mealType === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O que você comeu?</CardTitle>
            <CardDescription>Descreva os alimentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food-input">Digite os alimentos</Label>
              <Input
                id="food-input"
                placeholder="Ex: arroz, feijão, frango grelhado, salada"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnalyzing) {
                    handleAnalyze()
                  }
                }}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !foodInput.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                'Analisar com IA'
              )}
            </Button>

            {/* Alternative methods (disabled for MVP) */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" disabled className="flex-col h-auto py-3">
                <Camera className="h-5 w-5 mb-1" />
                <span className="text-xs">Foto</span>
              </Button>
              <Button variant="outline" disabled className="flex-col h-auto py-3">
                <Mic className="h-5 w-5 mb-1" />
                <span className="text-xs">Voz</span>
              </Button>
              <Button variant="outline" disabled className="flex-col h-auto py-3">
                <Barcode className="h-5 w-5 mb-1" />
                <span className="text-xs">Código</span>
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500">
              Recursos de foto, voz e código virão em breve!
            </p>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analyzedFoods.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Análise Nutricional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Foods List */}
              <div className="space-y-2">
                {analyzedFoods.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-gray-500">{food.portion}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <span>🔥 {Math.round(food.calories)} kcal</span>
                        <span>🥩 {Math.round(food.protein)}g</span>
                        <span>🍞 {Math.round(food.carbs)}g</span>
                        <span>🧈 {Math.round(food.fats)}g</span>
                        {food.glycemicIndex && (
                          <Badge variant="outline" className="text-xs">
                            IG: {food.glycemicIndex}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
                <h4 className="font-semibold mb-2">Total da Refeição</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Calorias:</span>{' '}
                    <span className="font-bold">
                      {Math.round(analyzedFoods.reduce((s, f) => s + f.calories, 0))} kcal
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Proteínas:</span>{' '}
                    <span className="font-bold">
                      {Math.round(analyzedFoods.reduce((s, f) => s + f.protein, 0))}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Carboidratos:</span>{' '}
                    <span className="font-bold">
                      {Math.round(analyzedFoods.reduce((s, f) => s + f.carbs, 0))}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Gorduras:</span>{' '}
                    <span className="font-bold">
                      {Math.round(analyzedFoods.reduce((s, f) => s + f.fats, 0))}g
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveMeal} className="w-full" size="lg">
                {showSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvo com sucesso!
                  </>
                ) : (
                  'Salvar Refeição'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
