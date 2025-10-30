import { motion } from 'framer-motion'
import { Camera, Mic, Barcode, MessageSquare, TrendingDown, Apple } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Camera,
    title: 'Foto de Alimentos',
    description: 'Tire foto da refeição e receba análise nutricional instantânea',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Mic,
    title: 'Entrada por Voz',
    description: 'Fale o que comeu e deixe a IA fazer o resto',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: Barcode,
    title: 'Scanner de Código',
    description: 'Escaneie produtos e obtenha informações completas',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: TrendingDown,
    title: 'Metas Personalizadas',
    description: 'Cálculo automático de calorias e macros para seu objetivo',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: Apple,
    title: 'Receitas Saudáveis',
    description: 'Centenas de receitas balanceadas e deliciosas',
    color: 'from-red-400 to-red-600',
  },
  {
    icon: MessageSquare,
    title: 'Assistente IA',
    description: 'Tire dúvidas sobre nutrição 24/7',
    color: 'from-pink-400 to-pink-600',
  },
]

export function OnboardingFeatures() {
  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          Recursos Poderosos
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tudo que você precisa em um só lugar
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} shadow-md`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
