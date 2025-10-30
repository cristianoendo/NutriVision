import { motion } from 'framer-motion'
import { Rocket, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Análise completa do seu corpo e metabolismo',
  'Metas personalizadas de calorias e macros',
  'Identificação do seu tipo corporal',
  'Recomendações baseadas em medicina funcional',
  'Acompanhamento diário inteligente',
]

export function OnboardingReady() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 shadow-2xl">
          <Rocket className="h-16 w-16 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Pronta para Começar?
        </h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Vamos coletar algumas informações para criar seu perfil personalizado
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full space-y-3 text-left"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800"
          >
            <CheckCircle2 className="h-6 w-6 shrink-0 text-primary-500" />
            <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400"
      >
        Leva apenas 2 minutos • Todos os dados são privados e seguros
      </motion.p>
    </div>
  )
}
