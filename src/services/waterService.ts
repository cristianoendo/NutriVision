import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'

type DailyWaterRow = Database['public']['Tables']['daily_water']['Row']
type DailyWaterInsert = Database['public']['Tables']['daily_water']['Insert']
type DailyWaterUpdate = Database['public']['Tables']['daily_water']['Update']

export interface DailyWater {
  id: string
  userId: string
  date: Date
  amountMl: number
  goalMl: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Water Service - Track daily water intake
 */
class WaterService {
  /**
   * Get water tracking for a specific date
   */
  async getWaterForDate(userId: string, date: Date): Promise<DailyWater | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const dateStr = this.formatDate(date)

      const { data, error } = await supabase
        .from('daily_water')
        .select('*')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found - not an error
          return null
        }
        console.error('Error fetching water data:', error)
        return null
      }

      return this.mapRowToDailyWater(data)
    } catch (error) {
      console.error('Error in getWaterForDate:', error)
      return null
    }
  }

  /**
   * Get water tracking for today
   */
  async getTodayWater(userId: string): Promise<DailyWater | null> {
    return this.getWaterForDate(userId, new Date())
  }

  /**
   * Update water intake for a specific date
   */
  async updateWaterIntake(userId: string, date: Date, amountMl: number, goalMl: number): Promise<DailyWater | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const dateStr = this.formatDate(date)

      // Check if record exists
      const existing = await this.getWaterForDate(userId, date)

      if (existing) {
        // Update existing record
        const updateData: DailyWaterUpdate = {
          amount_ml: amountMl,
          goal_ml: goalMl,
        }

        const { data, error } = await supabase
          .from('daily_water')
          .update(updateData)
          .eq('user_id', userId)
          .eq('date', dateStr)
          .select()
          .single()

        if (error) {
          console.error('Error updating water data:', error)
          return null
        }

        return this.mapRowToDailyWater(data)
      } else {
        // Create new record
        const insertData: DailyWaterInsert = {
          user_id: userId,
          date: dateStr,
          amount_ml: amountMl,
          goal_ml: goalMl,
        }

        const { data, error } = await supabase
          .from('daily_water')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error('Error creating water data:', error)
          return null
        }

        return this.mapRowToDailyWater(data)
      }
    } catch (error) {
      console.error('Error in updateWaterIntake:', error)
      return null
    }
  }

  /**
   * Add water to today's intake
   */
  async addWater(userId: string, amountMl: number, goalMl: number): Promise<DailyWater | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const today = new Date()
      const existing = await this.getTodayWater(userId)

      const newAmount = (existing?.amountMl || 0) + amountMl

      return this.updateWaterIntake(userId, today, newAmount, goalMl)
    } catch (error) {
      console.error('Error in addWater:', error)
      return null
    }
  }

  /**
   * Get water history for date range
   */
  async getWaterHistory(userId: string, startDate: Date, endDate: Date): Promise<DailyWater[]> {
    if (!isSupabaseConfigured()) return []

    try {
      const startDateStr = this.formatDate(startDate)
      const endDateStr = this.formatDate(endDate)

      const { data, error } = await supabase
        .from('daily_water')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching water history:', error)
        return []
      }

      return data.map(this.mapRowToDailyWater)
    } catch (error) {
      console.error('Error in getWaterHistory:', error)
      return []
    }
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Map database row to DailyWater type
   */
  private mapRowToDailyWater(row: DailyWaterRow): DailyWater {
    return {
      id: row.id,
      userId: row.user_id,
      date: new Date(row.date),
      amountMl: row.amount_ml,
      goalMl: row.goal_ml,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}

export const waterService = new WaterService()
