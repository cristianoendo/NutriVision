import { X, Clock, Users, ChefHat, Heart, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@/types'
import { cn } from '@/lib/utils'

interface RecipeDetailProps {
  recipe: Recipe
  onClose: () => void
  onToggleFavorite?: (id: string) => void
  onSpeak?: (text: string) => void
}

const TAG_LABELS: Record<string, string> = {
  'vegan': 'Vegano',
  'vegetarian': 'Vegetariano',
  'gluten-free': 'Sem Glúten',
  'dairy-free': 'Sem Lactose',
  'low-carb': 'Low Carb',
  'high-protein': 'Alto Proteína',
  'low-gi': 'Baixo IG',
  'anti-inflammatory': 'Anti-inflamatório',
  'quick': 'Rápido',
  'budget-friendly': 'Econômico',
}

export function RecipeDetail({ recipe, onClose, onToggleFavorite, onSpeak }: RecipeDetailProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  const handleSpeak = () => {
    const text = `${recipe.name}. ${recipe.description}. Modo de preparo: ${recipe.instructions.join('. ')}`
    onSpeak?.(text)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="min-h-screen pb-20">
        {/* Header Image */}
        <div className="relative h-64">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={() => onToggleFavorite?.(recipe.id)}
            className={cn(
              "absolute right-4 top-4 rounded-full p-2 shadow-lg backdrop-blur-sm",
              recipe.isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600"
            )}
          >
            <Heart className={cn("h-5 w-5", recipe.isFavorite && "fill-current")} />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="mb-2 text-2xl font-bold text-white">{recipe.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {totalTime} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {recipe.servings} porções
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                {recipe.difficulty === 'easy' ? 'Fácil' : recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {TAG_LABELS[tag] || tag}
              </Badge>
            ))}
          </div>

          {/* Nutrition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informação Nutricional (por porção)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Calorias</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.calories)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Proteínas</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.protein)}g</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Carboidratos</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.carbs)}g</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Gorduras</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.fats)}g</p>
                </div>
              </div>
              {recipe.glycemicIndex && (
                <div className="mt-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Índice Glicêmico: {recipe.glycemicIndex} (
                    {recipe.glycemicIndex < 55 ? 'Baixo' : recipe.glycemicIndex < 70 ? 'Médio' : 'Alto'})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>
                      {ingredient.amount} {ingredient.unit} de {ingredient.name}
                      {ingredient.notes && (
                        <span className="text-sm text-gray-500"> ({ingredient.notes})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Modo de Preparo</CardTitle>
                {onSpeak && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeak}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Ouvir
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
