import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store/useAppStore'
import type { UserProfile, ActivityLevel, ReproductivePhase, Goal } from '@/types'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { profileService } from '@/services/profileService'

interface UserProfileFormProps {
  onComplete: () => void
}

export function UserProfileForm({ onComplete }: UserProfileFormProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, completeOnboarding, authUserId } = useAppStore()

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    waist: '',
    hip: '',
    gender: 'female' as 'female' | 'male' | 'other',
    activityLevel: 'moderate' as ActivityLevel,
    reproductivePhase: 'regular-cycle' as ReproductivePhase,
    goal: 'weight-loss' as Goal,
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const userProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      waist: parseFloat(formData.waist),
      hip: parseFloat(formData.hip),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      reproductivePhase: formData.reproductivePhase,
      goal: formData.goal,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to local store first (immediate feedback)
    setUser(userProfile)
    completeOnboarding()

    // Save to Supabase if configured and authenticated
    if (isSupabaseConfigured() && authUserId) {
      try {
        const savedProfile = await profileService.createProfile(authUserId, userProfile)
        if (savedProfile) {
          // Update with server-generated ID
          setUser(savedProfile)
        }
      } catch (error) {
        console.error('Error saving profile to Supabase:', error)
        // Continue anyway - profile is saved locally
      }
    }

    setIsSubmitting(false)
    onComplete()
  }

  const isStepValid = () => {
    switch (step) {
      case 0:
        return formData.name.trim().length > 0 && formData.age && parseInt(formData.age) > 0
      case 1:
        return formData.weight && formData.height && parseFloat(formData.weight) > 0 && parseFloat(formData.height) > 0
      case 2:
        return formData.waist && formData.hip && parseFloat(formData.waist) > 0 && parseFloat(formData.hip) > 0
      case 3:
        return true // Seleção sempre válida
      case 4:
        return true // Seleção sempre válida
      default:
        return false
    }
  }

  const steps = [
    {
      title: 'Informações Básicas',
      description: 'Vamos começar com o básico',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Como você gostaria de ser chamada?"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              placeholder="Sua idade"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gênero</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { value: 'female', label: 'Feminino' },
                { value: 'male', label: 'Masculino' },
                { value: 'other', label: 'Outro' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('gender', option.value)}
                  className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                    formData.gender === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Medidas Corporais',
      description: 'Peso e altura atuais',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-gray-500">Seu peso atual em quilogramas</p>
          </div>
          <div>
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Ex: 165"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-gray-500">Sua altura em centímetros</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Circunferências',
      description: 'Para determinar seu tipo corporal',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="waist">Cintura (cm)</Label>
            <Input
              id="waist"
              type="number"
              placeholder="Ex: 80"
              value={formData.waist}
              onChange={(e) => updateField('waist', e.target.value)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-gray-500">
              Meça na altura do umbigo, sem apertar
            </p>
          </div>
          <div>
            <Label htmlFor="hip">Quadril (cm)</Label>
            <Input
              id="hip"
              type="number"
              placeholder="Ex: 100"
              value={formData.hip}
              onChange={(e) => updateField('hip', e.target.value)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-gray-500">
              Meça na parte mais larga dos quadris
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💡 Essas medidas nos ajudam a identificar seu tipo corporal e personalizar suas metas nutricionais
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Estilo de Vida',
      description: 'Atividade física e fase reprodutiva',
      content: (
        <div className="space-y-4">
          <div>
            <Label>Nível de Atividade Física</Label>
            <div className="mt-2 space-y-2">
              {[
                { value: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                { value: 'light', label: 'Leve', desc: '1-3 dias por semana' },
                { value: 'moderate', label: 'Moderado', desc: '3-5 dias por semana' },
                { value: 'active', label: 'Ativo', desc: '6-7 dias por semana' },
                { value: 'very-active', label: 'Muito Ativo', desc: 'Exercício intenso diário' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('activityLevel', option.value)}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                    formData.activityLevel === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {formData.gender === 'female' && (
            <div>
              <Label>Fase do Ciclo Reprodutivo</Label>
              <select
                value={formData.reproductivePhase}
                onChange={(e) => updateField('reproductivePhase', e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="regular-cycle">Ciclo menstrual regular</option>
                <option value="irregular-cycle">Ciclo menstrual irregular</option>
                <option value="perimenopause">Perimenopausa</option>
                <option value="menopause">Menopausa</option>
                <option value="postmenopause">Pós-menopausa</option>
                <option value="pregnant">Gestante</option>
                <option value="breastfeeding">Amamentando</option>
              </select>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Seu Objetivo',
      description: 'O que você quer alcançar?',
      content: (
        <div className="space-y-3">
          {[
            {
              value: 'weight-loss',
              label: 'Perda de Peso',
              desc: 'Emagrecer de forma saudável e sustentável',
              emoji: '🎯',
            },
            {
              value: 'maintenance',
              label: 'Manutenção',
              desc: 'Manter o peso atual e melhorar a saúde',
              emoji: '⚖️',
            },
            {
              value: 'muscle-gain',
              label: 'Ganho Muscular',
              desc: 'Aumentar massa magra',
              emoji: '💪',
            },
            {
              value: 'hormonal-balance',
              label: 'Equilíbrio Hormonal',
              desc: 'Otimizar saúde hormonal e metabólica',
              emoji: '🧘',
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('goal', option.value)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formData.goal === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{option.emoji}</span>
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="mb-4 flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= step ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Próximo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Finalizar
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
