import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  createdAt: Date
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser | null
  session: Session | null
  error: AuthError | Error | null
}

/**
 * Auth Service - Handles all authentication operations with Supabase
 */
class AuthService {
  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false

    const { data } = await supabase.auth.getSession()
    return !!data.session
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) return null

    const { data } = await supabase.auth.getUser()
    return data.user
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured()) return null

    const { data } = await supabase.auth.getSession()
    return data.session
  }

  /**
   * Sign up with email and password
   */
  async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase not configured. Please set up your environment variables.'),
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            name: signUpData.name,
          },
        },
      })

      if (error) {
        return { user: null, session: null, error }
      }

      if (!data.user) {
        return {
          user: null,
          session: null,
          error: new Error('Failed to create user'),
        }
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        createdAt: new Date(data.user.created_at),
      }

      return {
        user: authUser,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      }
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(signInData: SignInData): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase not configured. Please set up your environment variables.'),
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      })

      if (error) {
        return { user: null, session: null, error }
      }

      if (!data.user) {
        return {
          user: null,
          session: null,
          error: new Error('Failed to sign in'),
        }
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        createdAt: new Date(data.user.created_at),
      }

      return {
        user: authUser,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      }
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase not configured. Please set up your environment variables.'),
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { user: null, session: null, error }
      }

      // OAuth redirect doesn't return user immediately
      return {
        user: null,
        session: null,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      }
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: AuthError | Error | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null } // Silently succeed if not configured
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | Error | null }> {
    if (!isSupabaseConfigured()) {
      return {
        error: new Error('Supabase not configured. Please set up your environment variables.'),
      }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | Error | null }> {
    if (!isSupabaseConfigured()) {
      return {
        error: new Error('Supabase not configured. Please set up your environment variables.'),
      }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} }
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null, session)
    })

    return {
      unsubscribe: () => data.subscription.unsubscribe(),
    }
  }
}

export const authService = new AuthService()
