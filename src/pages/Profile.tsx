import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Scale,
  Ruler,
  Activity,
  Target,
  TrendingDown,
  Percent,
  Heart,
  Edit,
  Save,
  X,
} from 'lucide-react'
import { getBodyTypeRecommendations } from '@/services/calculations'

export function Profile() {
  const { user, bodyMetrics, nutritionGoals, updateUser } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    weight: user?.weight.toString() || '',
    waist: user?.waist.toString() || '',
    hip: user?.hip.toString() || '',
  })

  if (!user || !bodyMetrics || !nutritionGoals) {
    return null
  }

  const bodyTypeInfo = getBodyTypeRecommendations(bodyMetrics.bodyType)

  const handleSave = () => {
    updateUser({
      weight: parseFloat(editData.weight),
      waist: parseFloat(editData.waist),
      hip: parseFloat(editData.hip),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      weight: user.weight.toString(),
      waist: user.waist.toString(),
      hip: user.hip.toString(),
    })
    setIsEditing(false)
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'normal':
        return 'success'
      case 'overweight':
        return 'warning'
      case 'obese-class-1':
      case 'obese-class-2':
      case 'obese-class-3':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getBMILabel = (category: string) => {
    switch (category) {
      case 'underweight':
        return 'Abaixo do Peso'
      case 'normal':
        return 'Peso Normal'
      case 'overweight':
        return 'Sobrepeso'
      case 'obese-class-1':
        return 'Obesidade Grau I'
      case 'obese-class-2':
        return 'Obesidade Grau II'
      case 'obese-class-3':
        return 'Obesidade Grau III'
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-4 pb-16 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            {!isEditing ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  className="bg-white/20 text-white border-white/30"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  className="bg-white text-primary-600 hover:bg-white/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-primary-100">
                {user.age} anos • {user.gender === 'female' ? 'Feminino' : 'Masculino'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 -mt-12 space-y-4">
        {/* Body Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Métricas Corporais
            </CardTitle>
            <CardDescription>Última atualização: {new Date(user.updatedAt).toLocaleDateString('pt-BR')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              {isEditing ? (
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={editData.weight}
                  onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
                />
              ) : (
                <p className="text-2xl font-bold">{user.weight} kg</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Altura (cm)</Label>
              <p className="text-2xl font-bold">{user.height} cm</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist">Cintura (cm)</Label>
              {isEditing ? (
                <Input
                  id="waist"
                  type="number"
                  value={editData.waist}
                  onChange={(e) => setEditData({ ...editData, waist: e.target.value })}
                />
              ) : (
                <p className="text-2xl font-bold">{user.waist} cm</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hip">Quadril (cm)</Label>
              {isEditing ? (
                <Input
                  id="hip"
                  type="number"
                  value={editData.hip}
                  onChange={(e) => setEditData({ ...editData, hip: e.target.value })}
                />
              ) : (
                <p className="text-2xl font-bold">{user.hip} cm</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calculated Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Indicadores Calculados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* IMC */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  IMC (Índice de Massa Corporal)
                </p>
                <p className="text-3xl font-bold">{bodyMetrics.bmi.toFixed(1)}</p>
              </div>
              <Badge variant={getBMIColor(bodyMetrics.bmiCategory)}>
                {getBMILabel(bodyMetrics.bmiCategory)}
              </Badge>
            </div>

            {/* Body Fat */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Percentual de Gordura Estimado
                </p>
                <p className="text-3xl font-bold">{bodyMetrics.bodyFatPercentage.toFixed(1)}%</p>
              </div>
              <Percent className="h-8 w-8 text-gray-400" />
            </div>

            {/* RCQ */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Relação Cintura/Quadril (RCQ)
                </p>
                <p className="text-3xl font-bold">{bodyMetrics.whRatio.toFixed(2)}</p>
              </div>
              <Ruler className="h-8 w-8 text-gray-400" />
            </div>

            {/* Body Type */}
            <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
              <div className="flex items-start gap-3 mb-3">
                <Heart className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                    {bodyTypeInfo.title}
                  </h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    {bodyTypeInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas Nutricionais Diárias
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calorias</p>
              <p className="text-2xl font-bold">{Math.round(nutritionGoals.dailyCalories)} kcal</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Proteínas</p>
              <p className="text-2xl font-bold">
                {Math.round(nutritionGoals.protein)}g{' '}
                <span className="text-sm text-gray-500">
                  ({nutritionGoals.proteinPercentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carboidratos</p>
              <p className="text-2xl font-bold">
                {Math.round(nutritionGoals.carbs)}g{' '}
                <span className="text-sm text-gray-500">
                  ({nutritionGoals.carbsPercentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gorduras</p>
              <p className="text-2xl font-bold">
                {Math.round(nutritionGoals.fats)}g{' '}
                <span className="text-sm text-gray-500">
                  ({nutritionGoals.fatsPercentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fibras</p>
              <p className="text-2xl font-bold">{nutritionGoals.fiber}g</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Água</p>
              <p className="text-2xl font-bold">{(nutritionGoals.water / 1000).toFixed(1)}L</p>
            </div>
          </CardContent>
        </Card>

        {/* Metabolism */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Metabolismo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taxa Metabólica Basal (TMB)
              </p>
              <p className="text-2xl font-bold">{Math.round(bodyMetrics.bmr)} kcal/dia</p>
              <p className="text-xs text-gray-500 mt-1">
                Calorias que seu corpo queima em repouso
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Gasto Energético Total (TDEE)
              </p>
              <p className="text-2xl font-bold">{Math.round(bodyMetrics.tdee)} kcal/dia</p>
              <p className="text-xs text-gray-500 mt-1">
                Calorias totais considerando seu nível de atividade
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle>💡 Recomendações Personalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {bodyTypeInfo.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary-600 dark:text-primary-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
