import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeeklyData {
  day: string
  calories: number
  protein: number
  carbs: number
  fats: number
  weight?: number
}

interface ProgressChartsProps {
  data: WeeklyData[]
  type?: 'calories' | 'macros' | 'weight'
}

export function ProgressCharts({ data, type = 'calories' }: ProgressChartsProps) {
  if (type === 'calories') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calorias - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCalories)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  if (type === 'macros') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Macronutrientes - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="#10b981" name="Proteínas (g)" />
              <Bar dataKey="carbs" fill="#3b82f6" name="Carboidratos (g)" />
              <Bar dataKey="fats" fill="#f59e0b" name="Gorduras (g)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  if (type === 'weight') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução de Peso - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Peso (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return null
}
