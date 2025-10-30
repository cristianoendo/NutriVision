import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Meal } from '@/types'
import type { Database } from '@/lib/supabase-types'

type MealRow = Database['public']['Tables']['meals']['Row']
type MealInsert = Database['public']['Tables']['meals']['Insert']
type MealUpdate = Database['public']['Tables']['meals']['Update']

/**
 * Meals Service - Handles all meal CRUD operations
 */
class MealsService {
  /**
   * Get all meals for a user
   */
  async getUserMeals(userId: string, limit?: number): Promise<Meal[]> {
    if (!isSupabaseConfigured()) return []

    try {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching meals:', error)
        return []
      }

      return data.map(this.mapRowToMeal)
    } catch (error) {
      console.error('Error in getUserMeals:', error)
      return []
    }
  }

  /**
   * Get meals for a specific date range
   */
  async getMealsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Meal[]> {
    if (!isSupabaseConfigured()) return []

    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching meals by date range:', error)
        return []
      }

      return data.map(this.mapRowToMeal)
    } catch (error) {
      console.error('Error in getMealsByDateRange:', error)
      return []
    }
  }

  /**
   * Get meals for today
   */
  async getTodayMeals(userId: string): Promise<Meal[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.getMealsByDateRange(userId, today, tomorrow)
  }

  /**
   * Get a single meal by ID
   */
  async getMeal(mealId: string): Promise<Meal | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', mealId)
        .single()

      if (error) {
        console.error('Error fetching meal:', error)
        return null
      }

      return this.mapRowToMeal(data)
    } catch (error) {
      console.error('Error in getMeal:', error)
      return null
    }
  }

  /**
   * Create a new meal
   */
  async createMeal(userId: string, meal: Omit<Meal, 'id' | 'userId'>): Promise<Meal | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const mealData: MealInsert = {
        user_id: userId,
        type: meal.type,
        foods: meal.foods as any,
        total_calories: meal.totalCalories,
        total_protein: meal.totalProtein,
        total_carbs: meal.totalCarbs,
        total_fats: meal.totalFats,
        total_fiber: meal.totalFiber,
        avg_glycemic_index: meal.avgGlycemicIndex || null,
        timestamp: meal.timestamp.toISOString(),
        photo: meal.photo || null,
        notes: meal.notes || null,
      }

      const { data, error } = await supabase
        .from('meals')
        .insert(mealData)
        .select()
        .single()

      if (error) {
        console.error('Error creating meal:', error)
        return null
      }

      return this.mapRowToMeal(data)
    } catch (error) {
      console.error('Error in createMeal:', error)
      return null
    }
  }

  /**
   * Update a meal
   */
  async updateMeal(mealId: string, updates: Partial<Meal>): Promise<Meal | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const mealData: MealUpdate = {}

      if (updates.type) mealData.type = updates.type
      if (updates.foods) mealData.foods = updates.foods as any
      if (updates.totalCalories !== undefined) mealData.total_calories = updates.totalCalories
      if (updates.totalProtein !== undefined) mealData.total_protein = updates.totalProtein
      if (updates.totalCarbs !== undefined) mealData.total_carbs = updates.totalCarbs
      if (updates.totalFats !== undefined) mealData.total_fats = updates.totalFats
      if (updates.totalFiber !== undefined) mealData.total_fiber = updates.totalFiber
      if (updates.avgGlycemicIndex !== undefined) mealData.avg_glycemic_index = updates.avgGlycemicIndex || null
      if (updates.timestamp) mealData.timestamp = updates.timestamp.toISOString()
      if (updates.photo !== undefined) mealData.photo = updates.photo || null
      if (updates.notes !== undefined) mealData.notes = updates.notes || null

      const { data, error } = await supabase
        .from('meals')
        .update(mealData)
        .eq('id', mealId)
        .select()
        .single()

      if (error) {
        console.error('Error updating meal:', error)
        return null
      }

      return this.mapRowToMeal(data)
    } catch (error) {
      console.error('Error in updateMeal:', error)
      return null
    }
  }

  /**
   * Delete a meal
   */
  async deleteMeal(mealId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false

    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)

      if (error) {
        console.error('Error deleting meal:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteMeal:', error)
      return false
    }
  }

  /**
   * Map database row to Meal type
   */
  private mapRowToMeal(row: MealRow): Meal {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type as any,
      foods: row.foods as any,
      totalCalories: Number(row.total_calories),
      totalProtein: Number(row.total_protein),
      totalCarbs: Number(row.total_carbs),
      totalFats: Number(row.total_fats),
      totalFiber: Number(row.total_fiber),
      avgGlycemicIndex: row.avg_glycemic_index ? Number(row.avg_glycemic_index) : undefined,
      timestamp: new Date(row.timestamp),
      photo: row.photo || undefined,
      notes: row.notes || undefined,
    }
  }
}

export const mealsService = new MealsService()
