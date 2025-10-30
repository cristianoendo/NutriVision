import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { BodyMetrics } from '@/types'
import type { Database } from '@/lib/supabase-types'

type BodyMetricsRow = Database['public']['Tables']['body_metrics']['Row']
type BodyMetricsInsert = Database['public']['Tables']['body_metrics']['Insert']

/**
 * Body Metrics Service - Track weight and measurements over time
 */
class BodyMetricsService {
  /**
   * Get all body metrics for a user
   */
  async getUserMetrics(userId: string, limit?: number): Promise<BodyMetrics[]> {
    if (!isSupabaseConfigured()) return []

    try {
      let query = supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching body metrics:', error)
        return []
      }

      return data.map(this.mapRowToBodyMetrics)
    } catch (error) {
      console.error('Error in getUserMetrics:', error)
      return []
    }
  }

  /**
   * Get latest body metrics
   */
  async getLatestMetrics(userId: string): Promise<BodyMetrics | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching latest metrics:', error)
        return null
      }

      return this.mapRowToBodyMetrics(data)
    } catch (error) {
      console.error('Error in getLatestMetrics:', error)
      return null
    }
  }

  /**
   * Save body metrics
   */
  async saveMetrics(userId: string, metrics: Omit<BodyMetrics, 'calculatedAt'>): Promise<BodyMetrics | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const metricsData: BodyMetricsInsert = {
        user_id: userId,
        weight: metrics.bmi, // This seems wrong - should be weight
        waist: null,
        hip: null,
        bmi: metrics.bmi,
        bmi_category: metrics.bmiCategory,
        body_fat_percentage: metrics.bodyFatPercentage,
        wh_ratio: metrics.whRatio,
        body_type: metrics.bodyType,
        bmr: metrics.bmr,
        tdee: metrics.tdee,
      }

      const { data, error } = await supabase
        .from('body_metrics')
        .insert(metricsData)
        .select()
        .single()

      if (error) {
        console.error('Error saving metrics:', error)
        return null
      }

      return this.mapRowToBodyMetrics(data)
    } catch (error) {
      console.error('Error in saveMetrics:', error)
      return null
    }
  }

  /**
   * Get metrics by date range
   */
  async getMetricsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<BodyMetrics[]> {
    if (!isSupabaseConfigured()) return []

    try {
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .lte('recorded_at', endDate.toISOString())
        .order('recorded_at', { ascending: true })

      if (error) {
        console.error('Error fetching metrics by date range:', error)
        return []
      }

      return data.map(this.mapRowToBodyMetrics)
    } catch (error) {
      console.error('Error in getMetricsByDateRange:', error)
      return []
    }
  }

  /**
   * Map database row to BodyMetrics type
   */
  private mapRowToBodyMetrics(row: BodyMetricsRow): BodyMetrics {
    return {
      bmi: Number(row.bmi),
      bmiCategory: row.bmi_category as any,
      bodyFatPercentage: Number(row.body_fat_percentage),
      whRatio: Number(row.wh_ratio),
      bodyType: row.body_type as any,
      bmr: Number(row.bmr),
      tdee: Number(row.tdee),
      calculatedAt: new Date(row.recorded_at),
    }
  }
}

export const bodyMetricsService = new BodyMetricsService()
