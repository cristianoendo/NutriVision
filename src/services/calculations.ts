import type {
  UserProfile,
  BodyMetrics,
  NutritionGoals,
  ActivityLevel,
  BMICategory,
  BodyType,
} from '@/types'

// Multiplicadores de atividade física para TDEE
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}

/**
 * Calcula o IMC (Índice de Massa Corporal)
 * Fórmula: peso (kg) / altura² (m)
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

/**
 * Determina a categoria do IMC
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  if (bmi < 35) return 'obese-class-1'
  if (bmi < 40) return 'obese-class-2'
  return 'obese-class-3'
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor
 * Fórmula para mulheres: (10 × peso) + (6.25 × altura) - (5 × idade) - 161
 * Fórmula para homens: (10 × peso) + (6.25 × altura) - (5 × idade) + 5
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'female' | 'male' | 'other'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age

  if (gender === 'male') {
    return base + 5
  } else {
    return base - 161
  }
}

/**
 * Calcula o TDEE (Total Daily Energy Expenditure)
 * TDEE = TMB × multiplicador de atividade
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

/**
 * Calcula o percentual de gordura corporal usando a fórmula da Marinha dos EUA
 * Esta é uma estimativa baseada em circunferências
 */
export function calculateBodyFatPercentage(
  gender: 'female' | 'male' | 'other',
  waist: number,
  hip: number,
  height: number,
  neck: number = 35 // valor padrão estimado
): number {
  if (gender === 'female') {
    // Fórmula para mulheres
    const logSum = Math.log10(waist + hip - neck)
    const logHeight = Math.log10(height)
    return 495 / (1.29579 - 0.35004 * logSum + 0.22100 * logHeight) - 450
  } else {
    // Fórmula para homens
    const logWaist = Math.log10(waist - neck)
    const logHeight = Math.log10(height)
    return 495 / (1.0324 - 0.19077 * logWaist + 0.15456 * logHeight) - 450
  }
}

/**
 * Calcula a Relação Cintura-Quadril (RCQ)
 */
export function calculateWHRatio(waist: number, hip: number): number {
  return waist / hip
}

/**
 * Determina o tipo corporal baseado na RCQ e gênero
 */
export function determineBodyType(
  whRatio: number,
  gender: 'female' | 'male' | 'other'
): BodyType {
  if (gender === 'female') {
    if (whRatio > 0.85) return 'apple' // Risco de resistência insulínica
    if (whRatio < 0.75) return 'pear'  // Dominância estrogênica
    return 'mixed'
  } else {
    if (whRatio > 0.90) return 'apple'
    if (whRatio < 0.85) return 'pear'
    return 'mixed'
  }
}

/**
 * Calcula todas as métricas corporais de uma vez
 */
export function calculateBodyMetrics(profile: UserProfile): BodyMetrics {
  const bmi = calculateBMI(profile.weight, profile.height)
  const bmiCategory = getBMICategory(bmi)
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const whRatio = calculateWHRatio(profile.waist, profile.hip)
  const bodyType = determineBodyType(whRatio, profile.gender)
  const bodyFatPercentage = calculateBodyFatPercentage(
    profile.gender,
    profile.waist,
    profile.hip,
    profile.height
  )

  return {
    bmi,
    bmiCategory,
    bodyFatPercentage,
    whRatio,
    bodyType,
    bmr,
    tdee,
    calculatedAt: new Date(),
  }
}

/**
 * Calcula as metas nutricionais personalizadas baseadas no perfil e objetivo
 */
export function calculateNutritionGoals(
  profile: UserProfile,
  metrics: BodyMetrics
): NutritionGoals {
  let dailyCalories = metrics.tdee

  // Ajusta calorias baseado no objetivo
  switch (profile.goal) {
    case 'weight-loss':
      dailyCalories = metrics.tdee * 0.80 // Déficit de 20%
      break
    case 'maintenance':
      dailyCalories = metrics.tdee
      break
    case 'muscle-gain':
      dailyCalories = metrics.tdee * 1.10 // Superávit de 10%
      break
    case 'hormonal-balance':
      dailyCalories = metrics.tdee * 0.85 // Pequeno déficit
      break
  }

  // Ajusta macros baseado no tipo corporal
  let proteinPercentage = 30
  let carbsPercentage = 40
  let fatsPercentage = 30

  if (metrics.bodyType === 'apple') {
    // Tipo maçã: menos carbs, mais proteína (resistência insulínica)
    proteinPercentage = 35
    carbsPercentage = 30
    fatsPercentage = 35
  } else if (metrics.bodyType === 'pear') {
    // Tipo pêra: balanceado com mais fibras
    proteinPercentage = 30
    carbsPercentage = 40
    fatsPercentage = 30
  }

  // Calcula gramas de cada macronutriente
  const protein = (dailyCalories * (proteinPercentage / 100)) / 4
  const carbs = (dailyCalories * (carbsPercentage / 100)) / 4
  const fats = (dailyCalories * (fatsPercentage / 100)) / 9

  // Calcula fibras (25-35g por dia para mulheres, 30-40g para homens)
  const fiber = profile.gender === 'female' ? 30 : 35

  // Calcula água (35ml por kg de peso corporal)
  const water = Math.round(profile.weight * 35)

  return {
    dailyCalories: Math.round(dailyCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    fiber,
    water,
    proteinPercentage,
    carbsPercentage,
    fatsPercentage,
  }
}

/**
 * Retorna recomendações personalizadas baseadas no tipo corporal
 */
export function getBodyTypeRecommendations(bodyType: BodyType): {
  title: string
  description: string
  tips: string[]
} {
  switch (bodyType) {
    case 'apple':
      return {
        title: 'Tipo Maçã',
        description:
          'Tendência de acúmulo de gordura na região abdominal, associado à resistência insulínica.',
        tips: [
          'Priorize proteínas de qualidade em cada refeição',
          'Reduza carboidratos refinados e açúcares',
          'Inclua gorduras saudáveis (abacate, nuts, azeite)',
          'Pratique exercícios de força regularmente',
          'Controle o estresse (cortisol elevado favorece gordura abdominal)',
          'Considere jejum intermitente após orientação',
        ],
      }
    case 'pear':
      return {
        title: 'Tipo Pêra',
        description:
          'Tendência de acúmulo de gordura nos quadris e coxas, associado à dominância estrogênica.',
        tips: [
          'Aumente o consumo de fibras (vegetais crucíferos)',
          'Inclua alimentos detox (brócolis, couve, couve-flor)',
          'Evite xenoestrogênios (plásticos, produtos químicos)',
          'Reduza laticínios e carnes processadas',
          'Pratique exercícios cardiovasculares',
          'Consuma alimentos ricos em ômega-3',
        ],
      }
    case 'mixed':
      return {
        title: 'Tipo Misto',
        description:
          'Distribuição equilibrada de gordura corporal. Mantenha hábitos saudáveis para otimização hormonal.',
        tips: [
          'Mantenha alimentação balanceada e variada',
          'Combine exercícios aeróbicos e de força',
          'Priorize alimentos integrais e naturais',
          'Mantenha hidratação adequada',
          'Durma 7-9 horas por noite',
          'Gerencie o estresse com técnicas de relaxamento',
        ],
      }
  }
}

/**
 * Calcula o déficit calórico ideal para perda de peso saudável
 * Perda recomendada: 0.5-1kg por semana
 */
export function calculateWeightLossDeficit(tdee: number): {
  moderate: number
  aggressive: number
  weeklyLoss: { moderate: number; aggressive: number }
} {
  const moderate = tdee * 0.85 // 15% déficit
  const aggressive = tdee * 0.75 // 25% déficit

  return {
    moderate: Math.round(moderate),
    aggressive: Math.round(aggressive),
    weeklyLoss: {
      moderate: 0.5, // kg por semana
      aggressive: 1.0, // kg por semana
    },
  }
}
