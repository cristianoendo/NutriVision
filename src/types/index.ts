// User Profile Types
export interface UserProfile {
  id: string
  name: string
  email?: string
  age: number
  weight: number // kg
  height: number // cm
  waist: number // cm
  hip: number // cm
  gender: 'female' | 'male' | 'other'
  activityLevel: ActivityLevel
  reproductivePhase?: ReproductivePhase
  goal: Goal
  createdAt: Date
  updatedAt: Date
}

export type ActivityLevel =
  | 'sedentary'      // Sedentário (pouco ou nenhum exercício)
  | 'light'          // Levemente ativo (1-3 dias/semana)
  | 'moderate'       // Moderadamente ativo (3-5 dias/semana)
  | 'active'         // Muito ativo (6-7 dias/semana)
  | 'very-active'    // Extremamente ativo (exercício intenso diário)

export type ReproductivePhase =
  | 'regular-cycle'       // Ciclo menstrual regular
  | 'irregular-cycle'     // Ciclo menstrual irregular
  | 'perimenopause'       // Perimenopausa
  | 'menopause'          // Menopausa
  | 'postmenopause'      // Pós-menopausa
  | 'pregnant'           // Gestante
  | 'breastfeeding'      // Amamentando
  | 'not-applicable'     // Não se aplica

export type Goal =
  | 'weight-loss'        // Perda de peso
  | 'maintenance'        // Manutenção
  | 'muscle-gain'        // Ganho muscular
  | 'hormonal-balance'   // Equilíbrio hormonal

// Body Metrics Types
export interface BodyMetrics {
  bmi: number
  bmiCategory: BMICategory
  bodyFatPercentage: number
  whRatio: number // Waist-Hip Ratio
  bodyType: BodyType
  bmr: number // Basal Metabolic Rate
  tdee: number // Total Daily Energy Expenditure
  calculatedAt: Date
}

export type BMICategory =
  | 'underweight'        // < 18.5
  | 'normal'             // 18.5 - 24.9
  | 'overweight'         // 25 - 29.9
  | 'obese-class-1'      // 30 - 34.9 (Leve)
  | 'obese-class-2'      // 35 - 39.9 (Moderada)
  | 'obese-class-3'      // >= 40 (Grave)

export type BodyType =
  | 'apple'     // Tipo maçã (gordura abdominal - resistência insulínica)
  | 'pear'      // Tipo pêra (gordura nos quadris - dominância estrogênica)
  | 'mixed'     // Tipo misto

// Nutrition Goals Types
export interface NutritionGoals {
  dailyCalories: number
  protein: number // gramas
  carbs: number // gramas
  fats: number // gramas
  fiber: number // gramas
  water: number // ml
  proteinPercentage: number
  carbsPercentage: number
  fatsPercentage: number
}

// Food & Meal Types
export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber?: number
  sodium?: number
  glycemicIndex?: number
  micronutrients?: Micronutrients
  portion: string
  portionWeight?: number // gramas
  category?: FoodCategory
}

export interface Micronutrients {
  vitaminA?: number
  vitaminC?: number
  vitaminD?: number
  vitaminE?: number
  vitaminK?: number
  calcium?: number
  iron?: number
  magnesium?: number
  potassium?: number
  zinc?: number
}

export type FoodCategory =
  | 'protein'
  | 'carbs'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'fats'
  | 'beverages'
  | 'snacks'
  | 'processed'

export interface Meal {
  id: string
  userId: string
  type: MealType
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalFiber: number
  avgGlycemicIndex?: number
  timestamp: Date
  photo?: string
  notes?: string
}

export type MealType =
  | 'breakfast'    // Café da manhã
  | 'morning-snack'// Lanche da manhã
  | 'lunch'        // Almoço
  | 'afternoon-snack' // Lanche da tarde
  | 'dinner'       // Jantar
  | 'evening-snack' // Ceia

// Daily Summary Types
export interface DailySummary {
  date: Date
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalFiber: number
  waterIntake: number
  avgGlycemicIndex?: number
  caloriesGoal: number
  proteinGoal: number
  carbsGoal: number
  fatsGoal: number
  goals: NutritionGoals
  adherence: number // 0-100%
}

// Recipe Types
export interface Recipe {
  id: string
  name: string
  description: string
  image?: string
  prepTime: number // minutes
  cookTime: number // minutes
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  mealType: MealType[]
  ingredients: Ingredient[]
  instructions: string[]
  nutrition: FoodItem
  tags: RecipeTag[]
  glycemicIndex?: number
  isFavorite?: boolean
}

export interface Ingredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

export type RecipeTag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-carb'
  | 'high-protein'
  | 'low-gi'
  | 'anti-inflammatory'
  | 'quick'
  | 'budget-friendly'

// AI Analysis Types
export interface AIAnalysisRequest {
  input: string
  inputType: 'text' | 'image' | 'barcode'
  userProfile?: UserProfile
  timestamp: Date
}

export interface AIAnalysisResponse {
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalFiber: number
  analysis: string
  suggestions: string[]
  warnings?: string[]
  confidence: number // 0-1
}

// Notification Types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export type NotificationType =
  | 'meal-reminder'
  | 'water-reminder'
  | 'goal-achieved'
  | 'daily-summary'
  | 'tip'
  | 'motivation'
  | 'update-metrics'

// Wearable Data Types
export interface WearableData {
  date: Date
  steps: number
  caloriesBurned: number
  activeMinutes: number
  sleepHours: number
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent'
  heartRateAvg?: number
  source: 'google-fit' | 'apple-health' | 'manual'
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  context?: ChatContext
}

export interface ChatContext {
  userProfile?: UserProfile
  recentMeals?: Meal[]
  todaySummary?: DailySummary
  question?: string
}

// App State Types
export interface AppState {
  user: UserProfile | null
  bodyMetrics: BodyMetrics | null
  nutritionGoals: NutritionGoals | null
  dailySummary: DailySummary | null
  isOnboarding: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Notification[]
}
