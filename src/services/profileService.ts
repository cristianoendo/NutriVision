import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import type { Database } from '@/lib/supabase-types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Profile Service - Handles all profile CRUD operations
 */
class ProfileService {
  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return this.mapRowToUserProfile(data)
    } catch (error) {
      console.error('Error in getProfile:', error)
      return null
    }
  }

  /**
   * Create a new profile
   */
  async createProfile(userId: string, profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const profileData: ProfileInsert = {
        user_id: userId,
        name: profile.name,
        email: profile.email || null,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        waist: profile.waist,
        hip: profile.hip,
        gender: profile.gender,
        activity_level: profile.activityLevel,
        reproductive_phase: profile.reproductivePhase || null,
        goal: profile.goal,
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      return this.mapRowToUserProfile(data)
    } catch (error) {
      console.error('Error in createProfile:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const profileData: ProfileUpdate = {}

      if (updates.name) profileData.name = updates.name
      if (updates.email !== undefined) profileData.email = updates.email || null
      if (updates.age) profileData.age = updates.age
      if (updates.weight) profileData.weight = updates.weight
      if (updates.height) profileData.height = updates.height
      if (updates.waist) profileData.waist = updates.waist
      if (updates.hip) profileData.hip = updates.hip
      if (updates.gender) profileData.gender = updates.gender
      if (updates.activityLevel) profileData.activity_level = updates.activityLevel
      if (updates.reproductivePhase !== undefined) profileData.reproductive_phase = updates.reproductivePhase || null
      if (updates.goal) profileData.goal = updates.goal

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return this.mapRowToUserProfile(data)
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return null
    }
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteProfile:', error)
      return false
    }
  }

  /**
   * Map database row to UserProfile type
   */
  private mapRowToUserProfile(row: ProfileRow): UserProfile {
    return {
      id: row.id,
      name: row.name,
      email: row.email || undefined,
      age: row.age,
      weight: row.weight,
      height: row.height,
      waist: row.waist,
      hip: row.hip,
      gender: row.gender as 'female' | 'male' | 'other',
      activityLevel: row.activity_level as any,
      reproductivePhase: row.reproductive_phase as any,
      goal: row.goal as any,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}

export const profileService = new ProfileService()
