import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ChefHat } from 'lucide-react'

export function Recipes() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <ChefHat className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold">Receitas Saudáveis</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <ChefHat className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
              Em breve: Centenas de receitas balanceadas
            </p>
            <p className="text-sm text-center text-gray-400">
              Filtros por restrições alimentares, tempo de preparo e objetivos nutricionais
            </p>
          </CardContent>
        </Card>

        {/* Sample Recipe Cards (placeholder) */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              name: 'Bowl de Quinoa com Frango',
              time: '25 min',
              calories: 450,
              tags: ['high-protein', 'low-gi'],
            },
            {
              name: 'Salmão com Legumes Assados',
              time: '35 min',
              calories: 520,
              tags: ['low-carb', 'anti-inflammatory'],
            },
          ].map((recipe, index) => (
            <Card key={index} className="overflow-hidden opacity-60">
              <div className="h-32 bg-gradient-to-br from-primary-200 to-primary-300" />
              <CardHeader>
                <CardTitle className="text-base">{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.time}
                  </span>
                  <span>🔥 {recipe.calories} kcal</span>
                </div>
                <div className="flex gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary-50 dark:bg-primary-900/20">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              💡 Estamos preparando receitas incríveis alinhadas com medicina funcional e suas metas!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
