import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { OnboardingWelcome } from './screens/OnboardingWelcome'
import { OnboardingFeatures } from './screens/OnboardingFeatures'
import { OnboardingApproach } from './screens/OnboardingApproach'
import { OnboardingReady } from './screens/OnboardingReady'
import { UserProfileForm } from './UserProfileForm'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const screens = [
    <OnboardingWelcome key="welcome" />,
    <OnboardingFeatures key="features" />,
    <OnboardingApproach key="approach" />,
    <OnboardingReady key="ready" />,
    <UserProfileForm key="profile" onComplete={onComplete} />,
  ]

  const handleNext = () => {
    if (currentStep < screens.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep(screens.length - 1)
  }

  const isLastIntroScreen = currentStep === screens.length - 2
  const isProfileScreen = currentStep === screens.length - 1

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Progress indicator */}
      {!isProfileScreen && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <div className="mx-auto max-w-md px-4 py-4">
            <div className="flex gap-2">
              {screens.slice(0, -1).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-primary-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {screens[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {!isProfileScreen && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 dark:bg-gray-900/80">
            <div className="mx-auto max-w-md flex items-center justify-between gap-4">
              {currentStep < screens.length - 2 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Pular
                </Button>
              )}
              <div className="flex-1" />
              <Button
                onClick={handleNext}
                size="lg"
                className="min-w-32"
              >
                {isLastIntroScreen ? 'Começar' : 'Próximo'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
