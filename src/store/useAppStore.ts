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
import { isSupabaseConfigured } from '@/lib/supabase'
import { profileService } from '@/services/profileService'
import { mealsService } from '@/services/mealsService'
import { waterService } from '@/services/waterService'

interface AppState {
  // Auth
  authUserId: string | null

  // User data
  user: UserProfile | null
  bodyMetrics: BodyMetrics | null
  nutritionGoals: NutritionGoals | null

  // App state
  isOnboarding: boolean
  hasCompletedOnboarding: boolean
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
  error: string | null

  // Daily tracking
  dailySummary: DailySummary | null
  meals: Meal[]

  // Notifications
  notifications: Notification[]

  // Actions - Auth
  setAuthUserId: (userId: string | null) => void
  loadUserData: (userId: string) => Promise<void>
  logout: () => void

  // Actions - User
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  clearUser: () => void

  // Actions - Onboarding
  completeOnboarding: () => void
  startOnboarding: () => void

  // Actions - Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Actions - Meals
  addMeal: (meal: Meal) => Promise<void>
  updateMeal: (mealId: string, updates: Partial<Meal>) => Promise<void>
  deleteMeal: (mealId: string) => Promise<void>
  clearTodayMeals: () => void
  loadTodayMeals: (userId: string) => Promise<void>

  // Actions - Water
  updateWaterIntake: (amount: number) => Promise<void>

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
      authUserId: null,
      user: null,
      bodyMetrics: null,
      nutritionGoals: null,
      isOnboarding: true,
      hasCompletedOnboarding: false,
      theme: 'system',
      isLoading: false,
      error: null,
      dailySummary: null,
      meals: [],
      notifications: [],

      // Auth actions
      setAuthUserId: (userId) => {
        set({ authUserId: userId })
      },

      loadUserData: async (userId) => {
        if (!isSupabaseConfigured()) return

        set({ isLoading: true, error: null })

        try {
          // Load profile from Supabase
          const profile = await profileService.getProfile(userId)

          if (profile) {
            set({ user: profile, hasCompletedOnboarding: true, isOnboarding: false })
            get().recalculateMetrics()

            // Load today's meals
            await get().loadTodayMeals(userId)

            // Load today's water
            const today = new Date()
            const waterData = await waterService.getWaterForDate(userId, today)
            if (waterData && get().dailySummary) {
              set({
                dailySummary: {
                  ...get().dailySummary!,
                  waterIntake: waterData.amountMl,
                },
              })
            }
          } else {
            // No profile found - user needs to complete onboarding
            set({ isOnboarding: true, hasCompletedOnboarding: false })
          }

          set({ isLoading: false })
        } catch (error) {
          console.error('Error loading user data:', error)
          set({ error: 'Failed to load user data', isLoading: false })
        }
      },

      logout: () => {
        set({
          authUserId: null,
          user: null,
          bodyMetrics: null,
          nutritionGoals: null,
          meals: [],
          dailySummary: null,
          notifications: [],
          hasCompletedOnboarding: false,
          isOnboarding: true,
        })
      },

      // User actions
      setUser: (user) => {
        set({ user })
        // Recalculate metrics when user is set
        get().recalculateMetrics()
      },

      updateUser: async (updates) => {
        const currentUser = get().user
        const authUserId = get().authUserId
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() }
        set({ user: updatedUser })
        get().recalculateMetrics()

        // Sync to Supabase if configured
        if (isSupabaseConfigured() && authUserId) {
          try {
            await profileService.updateProfile(authUserId, updates)
          } catch (error) {
            console.error('Error updating profile in Supabase:', error)
          }
        }
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
      addMeal: async (meal) => {
        const meals = [...get().meals, meal]
        set({ meals })
        get().updateDailySummary()

        // Sync to Supabase if configured
        const authUserId = get().authUserId
        if (isSupabaseConfigured() && authUserId) {
          try {
            const savedMeal = await mealsService.createMeal(authUserId, meal)
            if (savedMeal) {
              // Update local meal with server ID
              const updatedMeals = get().meals.map((m) =>
                m.id === meal.id ? savedMeal : m
              )
              set({ meals: updatedMeals })
            }
          } catch (error) {
            console.error('Error saving meal to Supabase:', error)
          }
        }
      },

      updateMeal: async (mealId, updates) => {
        const meals = get().meals.map((meal) =>
          meal.id === mealId ? { ...meal, ...updates } : meal
        )
        set({ meals })
        get().updateDailySummary()

        // Sync to Supabase if configured
        if (isSupabaseConfigured()) {
          try {
            await mealsService.updateMeal(mealId, updates)
          } catch (error) {
            console.error('Error updating meal in Supabase:', error)
          }
        }
      },

      deleteMeal: async (mealId) => {
        const meals = get().meals.filter((meal) => meal.id !== mealId)
        set({ meals })
        get().updateDailySummary()

        // Sync to Supabase if configured
        if (isSupabaseConfigured()) {
          try {
            await mealsService.deleteMeal(mealId)
          } catch (error) {
            console.error('Error deleting meal from Supabase:', error)
          }
        }
      },

      clearTodayMeals: () => {
        set({ meals: [], dailySummary: null })
      },

      loadTodayMeals: async (userId) => {
        if (!isSupabaseConfigured()) return

        try {
          const todayMeals = await mealsService.getTodayMeals(userId)
          set({ meals: todayMeals })
          get().updateDailySummary()
        } catch (error) {
          console.error('Error loading today meals:', error)
        }
      },

      // Water actions
      updateWaterIntake: async (amount) => {
        const currentSummary = get().dailySummary
        const authUserId = get().authUserId
        const nutritionGoals = get().nutritionGoals

        if (currentSummary) {
          set({
            dailySummary: {
              ...currentSummary,
              waterIntake: amount,
            },
          })
        }

        // Sync to Supabase if configured
        if (isSupabaseConfigured() && authUserId && nutritionGoals) {
          try {
            const today = new Date()
            await waterService.updateWaterIntake(
              authUserId,
              today,
              amount,
              nutritionGoals.water
            )
          } catch (error) {
            console.error('Error updating water intake in Supabase:', error)
          }
        }
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
        const { meals, nutritionGoals, dailySummary: currentSummary } = get()
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

        // Preserve water intake from current summary
        const waterIntake = currentSummary?.waterIntake || 0

        const dailySummary: DailySummary = {
          date: today,
          meals: todayMeals,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFats,
          totalFiber,
          waterIntake,
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
        authUserId: state.authUserId,
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        theme: state.theme,
        // Only persist meals/notifications if Supabase is not configured (fallback)
        meals: isSupabaseConfigured() ? [] : state.meals,
        notifications: state.notifications,
      }),
    }
  )
)
