import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RecipeCard } from '@/components/features/recipes/RecipeCard'
import { RecipeDetail } from '@/components/features/recipes/RecipeDetail'
import { MOCK_RECIPES } from '@/data/recipes'
import type { Recipe, RecipeTag, MealType } from '@/types'

const FILTER_TAGS: { value: RecipeTag; label: string }[] = [
  { value: 'vegan', label: 'Vegano' },
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'gluten-free', label: 'Sem Glúten' },
  { value: 'dairy-free', label: 'Sem Lactose' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'high-protein', label: 'Alto Proteína' },
  { value: 'low-gi', label: 'Baixo IG' },
  { value: 'anti-inflammatory', label: 'Anti-inflamatório' },
  { value: 'quick', label: 'Rápido' },
]

const MEAL_TYPE_FILTERS: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Café da Manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'dinner', label: 'Jantar' },
  { value: 'morning-snack', label: 'Lanche' },
]

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([])
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const toggleTag = (tag: RecipeTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const toggleMealType = (mealType: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mealType)
        ? prev.filter((t) => t !== mealType)
        : [...prev, mealType]
    )
  }

  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedMealTypes([])
    setSearchQuery('')
  }

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Tag filters
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) => recipe.tags.includes(tag))
        if (!hasAllTags) return false
      }

      // Meal type filters
      if (selectedMealTypes.length > 0) {
        const hasMatchingMealType = selectedMealTypes.some((type) =>
          recipe.mealType.includes(type)
        )
        if (!hasMatchingMealType) return false
      }

      return true
    })
  }, [recipes, searchQuery, selectedTags, selectedMealTypes])

  const hasActiveFilters = selectedTags.length > 0 || selectedMealTypes.length > 0

  // Text-to-speech function
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Seu navegador não suporta text-to-speech')
    }
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={toggleFavorite}
        onSpeak={handleSpeak}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Receitas Saudáveis</h1>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-2">
                {selectedTags.length + selectedMealTypes.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar receitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Meal Type Filters */}
              <div>
                <p className="mb-2 text-sm font-medium">Tipo de Refeição</p>
                <div className="flex flex-wrap gap-2">
                  {MEAL_TYPE_FILTERS.map((filter) => (
                    <Badge
                      key={filter.value}
                      variant={selectedMealTypes.includes(filter.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleMealType(filter.value)}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tag Filters */}
              <div>
                <p className="mb-2 text-sm font-medium">Restrições e Preferências</p>
                <div className="flex flex-wrap gap-2">
                  {FILTER_TAGS.map((filter) => (
                    <Badge
                      key={filter.value}
                      variant={selectedTags.includes(filter.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(filter.value)}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada
          {filteredRecipes.length !== 1 ? 's' : ''}
        </p>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-gray-500 dark:text-gray-400">
                Nenhuma receita encontrada com os filtros selecionados.
              </p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
