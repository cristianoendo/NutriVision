import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserProfile,
  BodyMetrics,
  NutritionGoals,
  DailySummary,
  Meal,
  Notification,
} from '@/types'
import {
  calculateBodyMetrics,
  calculateNutritionGoals,
} from '@/services/calculations'

interface AppState {
  // User data
  user: UserProfile | null
  bodyMetrics: BodyMetrics | null
  nutritionGoals: NutritionGoals | null

  // App state
  isOnboarding: boolean
  hasCompletedOnboarding: boolean
  theme: 'light' | 'dark' | 'system'

  // Daily tracking
  dailySummary: DailySummary | null
  meals: Meal[]

  // Notifications
  notifications: Notification[]

  // Actions - User
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => void
  clearUser: () => void

  // Actions - Onboarding
  completeOnboarding: () => void
  startOnboarding: () => void

  // Actions - Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Actions - Meals
  addMeal: (meal: Meal) => void
  updateMeal: (mealId: string, updates: Partial<Meal>) => void
  deleteMeal: (mealId: string) => void
  clearTodayMeals: () => void

  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void
  markNotificationAsRead: (notificationId: string) => void
  clearNotifications: () => void

  // Actions - Calculations
  recalculateMetrics: () => void
  updateDailySummary: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      bodyMetrics: null,
      nutritionGoals: null,
      isOnboarding: true,
      hasCompletedOnboarding: false,
      theme: 'system',
      dailySummary: null,
      meals: [],
      notifications: [],

      // User actions
      setUser: (user) => {
        set({ user })
        // Recalculate metrics when user is set
        get().recalculateMetrics()
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() }
        set({ user: updatedUser })
        get().recalculateMetrics()
      },

      clearUser: () => {
        set({
          user: null,
          bodyMetrics: null,
          nutritionGoals: null,
          meals: [],
          dailySummary: null,
        })
      },

      // Onboarding actions
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true, isOnboarding: false })
      },

      startOnboarding: () => {
        set({ isOnboarding: true })
      },

      // Theme actions
      setTheme: (theme) => {
        set({ theme })

        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (prefersDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },

      // Meal actions
      addMeal: (meal) => {
        const meals = [...get().meals, meal]
        set({ meals })
        get().updateDailySummary()
      },

      updateMeal: (mealId, updates) => {
        const meals = get().meals.map((meal) =>
          meal.id === mealId ? { ...meal, ...updates } : meal
        )
        set({ meals })
        get().updateDailySummary()
      },

      deleteMeal: (mealId) => {
        const meals = get().meals.filter((meal) => meal.id !== mealId)
        set({ meals })
        get().updateDailySummary()
      },

      clearTodayMeals: () => {
        set({ meals: [], dailySummary: null })
      },

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
        }
        set({ notifications: [newNotification, ...get().notifications] })
      },

      markNotificationAsRead: (notificationId) => {
        const notifications = get().notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
        set({ notifications })
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Calculation actions
      recalculateMetrics: () => {
        const user = get().user
        if (!user) return

        const bodyMetrics = calculateBodyMetrics(user)
        const nutritionGoals = calculateNutritionGoals(user, bodyMetrics)

        set({ bodyMetrics, nutritionGoals })
        get().updateDailySummary()
      },

      updateDailySummary: () => {
        const { meals, nutritionGoals } = get()
        if (!nutritionGoals) return

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Filter meals from today
        const todayMeals = meals.filter((meal) => {
          const mealDate = new Date(meal.timestamp)
          mealDate.setHours(0, 0, 0, 0)
          return mealDate.getTime() === today.getTime()
        })

        // Calculate totals
        const totalCalories = todayMeals.reduce(
          (sum, meal) => sum + meal.totalCalories,
          0
        )
        const totalProtein = todayMeals.reduce(
          (sum, meal) => sum + meal.totalProtein,
          0
        )
        const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0)
        const totalFats = todayMeals.reduce((sum, meal) => sum + meal.totalFats, 0)
        const totalFiber = todayMeals.reduce((sum, meal) => sum + meal.totalFiber, 0)

        // Calculate average glycemic index
        const mealsWithGI = todayMeals.filter((meal) => meal.avgGlycemicIndex)
        const avgGlycemicIndex =
          mealsWithGI.length > 0
            ? mealsWithGI.reduce((sum, meal) => sum + (meal.avgGlycemicIndex || 0), 0) /
              mealsWithGI.length
            : undefined

        // Calculate adherence (percentage of goals met)
        const caloriesAdherence =
          Math.min((totalCalories / nutritionGoals.dailyCalories) * 100, 100)
        const proteinAdherence =
          Math.min((totalProtein / nutritionGoals.protein) * 100, 100)
        const carbsAdherence = Math.min((totalCarbs / nutritionGoals.carbs) * 100, 100)
        const fatsAdherence = Math.min((totalFats / nutritionGoals.fats) * 100, 100)

        const adherence = Math.round(
          (caloriesAdherence + proteinAdherence + carbsAdherence + fatsAdherence) / 4
        )

        const dailySummary: DailySummary = {
          date: today,
          meals: todayMeals,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFats,
          totalFiber,
          waterIntake: 0, // TODO: Track water intake separately
          avgGlycemicIndex,
          caloriesGoal: nutritionGoals.dailyCalories,
          proteinGoal: nutritionGoals.protein,
          carbsGoal: nutritionGoals.carbs,
          fatsGoal: nutritionGoals.fats,
          goals: nutritionGoals,
          adherence,
        }

        set({ dailySummary })
      },
    }),
    {
      name: 'vidaleve-storage',
      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        theme: state.theme,
        meals: state.meals,
        notifications: state.notifications,
      }),
    }
  )
)
