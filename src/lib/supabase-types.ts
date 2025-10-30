// Database types generated from Supabase schema
// This will be auto-generated after creating tables in Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          age: number
          weight: number
          height: number
          waist: number
          hip: number
          gender: 'female' | 'male' | 'other'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
          reproductive_phase: string | null
          goal: 'weight-loss' | 'maintenance' | 'muscle-gain' | 'hormonal-balance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          age: number
          weight: number
          height: number
          waist: number
          hip: number
          gender: 'female' | 'male' | 'other'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
          reproductive_phase?: string | null
          goal: 'weight-loss' | 'maintenance' | 'muscle-gain' | 'hormonal-balance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          age?: number
          weight?: number
          height?: number
          waist?: number
          hip?: number
          gender?: 'female' | 'male' | 'other'
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
          reproductive_phase?: string | null
          goal?: 'weight-loss' | 'maintenance' | 'muscle-gain' | 'hormonal-balance'
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          type: 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner' | 'evening-snack'
          foods: Json
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fats: number
          total_fiber: number
          avg_glycemic_index: number | null
          timestamp: string
          photo: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner' | 'evening-snack'
          foods: Json
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fats: number
          total_fiber: number
          avg_glycemic_index?: number | null
          timestamp: string
          photo?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner' | 'evening-snack'
          foods?: Json
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fats?: number
          total_fiber?: number
          avg_glycemic_index?: number | null
          timestamp?: string
          photo?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      body_metrics: {
        Row: {
          id: string
          user_id: string
          weight: number
          waist: number | null
          hip: number | null
          bmi: number
          bmi_category: string
          body_fat_percentage: number
          wh_ratio: number
          body_type: 'apple' | 'pear' | 'mixed'
          bmr: number
          tdee: number
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          waist?: number | null
          hip?: number | null
          bmi: number
          bmi_category: string
          body_fat_percentage: number
          wh_ratio: number
          body_type: 'apple' | 'pear' | 'mixed'
          bmr: number
          tdee: number
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          waist?: number | null
          hip?: number | null
          bmi?: number
          bmi_category?: string
          body_fat_percentage?: number
          wh_ratio?: number
          body_type?: 'apple' | 'pear' | 'mixed'
          bmr?: number
          tdee?: number
          recorded_at?: string
          created_at?: string
        }
      }
      daily_water: {
        Row: {
          id: string
          user_id: string
          date: string
          amount_ml: number
          goal_ml: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          amount_ml?: number
          goal_ml: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          amount_ml?: number
          goal_ml?: number
          created_at?: string
          updated_at?: string
        }
      }
      recipes_favorites: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
