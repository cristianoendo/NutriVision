import { motion } from 'framer-motion'
import { Target, Scale, Activity, Brain } from 'lucide-react'

const approaches = [
  {
    icon: Brain,
    title: 'Medicina Funcional',
    description:
      'Entendemos a raiz dos problemas. Não tratamos apenas sintomas, mas a causa hormonal e metabólica do ganho de peso.',
  },
  {
    icon: Scale,
    title: 'Tipo Corporal',
    description:
      'Identificamos seu tipo corporal (Maçã, Pêra ou Misto) e ajustamos a nutrição para otimizar seu metabolismo único.',
  },
  {
    icon: Activity,
    title: 'Equilíbrio Hormonal',
    description:
      'Foco em balancear insulina, cortisol e hormônios sexuais através da alimentação e timing de refeições.',
  },
  {
    icon: Target,
    title: 'Resultados Sustentáveis',
    description:
      'Perda de peso saudável e permanente, sem dietas restritivas ou efeito sanfona.',
  },
]

export function OnboardingApproach() {
  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          Nossa Abordagem
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Baseada em ciência, medicina funcional e nutrologia
        </p>
      </motion.div>

      <div className="space-y-6">
        {approaches.map((approach, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * index }}
            className="flex gap-4 rounded-xl bg-white p-5 shadow-md dark:bg-gray-800"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <approach.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {approach.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {approach.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
