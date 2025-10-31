import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { SplashScreen } from './components/features/splash/SplashScreen'
import { AuthFlow } from './components/features/auth/AuthFlow'
import { OnboardingFlow } from './components/features/onboarding/OnboardingFlow'
import { Dashboard } from './pages/Dashboard'
import { AddMeal } from './pages/AddMeal'
import { Progress } from './pages/Progress'
import { Recipes } from './pages/Recipes'
import { Profile } from './pages/Profile'
import { BottomNav } from './components/layout/BottomNav'
import { isSupabaseConfigured } from './lib/supabase'
import { authService } from './services/authService'
import { Loader2 } from 'lucide-react'

function App() {
  const {
    hasCompletedOnboarding,
    theme,
    authUserId,
    setAuthUserId,
    loadUserData,
    isLoading
  } = useAppStore()

  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) {
        setCheckingAuth(false)
        return
      }

      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setAuthUserId(user.id)
          await loadUserData(user.id)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [setAuthUserId, loadUserData])

  // Listen for auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const { unsubscribe } = authService.onAuthStateChange(async (user) => {
      if (user) {
        setAuthUserId(user.id)
        await loadUserData(user.id)
      } else {
        setAuthUserId(null)
      }
    })

    return () => unsubscribe()
  }, [setAuthUserId, loadUserData])

  // Show splash screen on first load
  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Handle successful auth
  const handleAuthSuccess = async (userId: string) => {
    setAuthUserId(userId)

    if (isSupabaseConfigured()) {
      await loadUserData(userId)
    }
  }

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show loading while checking auth
  if (checkingAuth || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Show auth flow if Supabase is configured and user is not authenticated
  if (isSupabaseConfigured() && !authUserId) {
    return <AuthFlow onAuthSuccess={handleAuthSuccess} />
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={() => setActiveTab('home')} />
  }

  // Main app with navigation
  return (
    <div className="app-container">
      {/* Render active page */}
      {activeTab === 'home' && <Dashboard />}
      {activeTab === 'add' && <AddMeal />}
      {activeTab === 'progress' && <Progress />}
      {activeTab === 'recipes' && <Recipes />}
      {activeTab === 'profile' && <Profile />}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
