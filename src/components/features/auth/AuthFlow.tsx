import { useState } from 'react'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'

type AuthScreen = 'login' | 'register' | 'forgot-password'

interface AuthFlowProps {
  onAuthSuccess: (userId: string, userName?: string) => void
}

export function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login')

  const handleLoginSuccess = (userId: string) => {
    onAuthSuccess(userId)
  }

  const handleRegisterSuccess = (userId: string, userName: string) => {
    onAuthSuccess(userId, userName)
  }

  if (currentScreen === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentScreen('register')}
        onForgotPassword={() => setCurrentScreen('forgot-password')}
      />
    )
  }

  if (currentScreen === 'register') {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setCurrentScreen('login')}
      />
    )
  }

  if (currentScreen === 'forgot-password') {
    return <ForgotPassword onBack={() => setCurrentScreen('login')} />
  }

  return null
}
