import { Clock, Users, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@/types'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  onToggleFavorite?: (id: string) => void
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

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="h-48 w-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(recipe.id)
          }}
          className={cn(
            "absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition-colors",
            recipe.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/70 text-gray-600 hover:bg-white"
          )}
        >
          <Heart className={cn("h-5 w-5", recipe.isFavorite && "fill-current")} />
        </button>
      </div>
      <CardContent className="p-4 cursor-pointer" onClick={onClick}>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{recipe.name}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {recipe.description}
        </p>

        <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} porções
          </span>
          <span>🔥 {recipe.nutrition.calories} kcal</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {TAG_LABELS[tag] || tag}
            </Badge>
          ))}
          {recipe.glycemicIndex && recipe.glycemicIndex < 55 && (
            <Badge variant="success" className="text-xs bg-green-100 text-green-800">
              Baixo IG
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
