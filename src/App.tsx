import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { SplashScreen } from './components/features/splash/SplashScreen'
import { OnboardingFlow } from './components/features/onboarding/OnboardingFlow'
import { Dashboard } from './pages/Dashboard'
import { AddMeal } from './pages/AddMeal'
import { Recipes } from './pages/Recipes'
import { Profile } from './pages/Profile'
import { BottomNav } from './components/layout/BottomNav'

function App() {
  const { hasCompletedOnboarding, theme } = useAppStore()
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

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

  // Show splash screen on first load
  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
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
      {activeTab === 'recipes' && <Recipes />}
      {activeTab === 'profile' && <Profile />}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
