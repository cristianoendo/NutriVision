import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

export function OnboardingWelcome() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative mb-8"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl">
          <Heart className="h-16 w-16 text-white" fill="white" strokeWidth={1.5} />
        </div>
        <motion.div
          className="absolute -right-2 -top-2"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-8 w-8 text-yellow-400" fill="currentColor" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Bem-vinda ao VidaLeve
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Sua jornada para o equilíbrio hormonal e emagrecimento saudável começa aqui
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 space-y-4 text-left"
      >
        {[
          { emoji: '🌿', text: 'Nutrição personalizada baseada em ciência' },
          { emoji: '💪', text: 'Abordagem de medicina funcional' },
          { emoji: '📊', text: 'Tracking inteligente e análise com IA' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-gray-700 dark:text-gray-200">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
