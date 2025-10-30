import type { AIAnalysisRequest, AIAnalysisResponse, FoodItem } from '@/types'

/**
 * Service for AI-powered nutritional analysis
 * This service can be connected to OpenAI, Claude, or any other AI provider
 */

// Mock function - Replace with actual API calls to OpenAI/Claude
export async function analyzeFood(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In production, this would call:
  // - OpenAI API: https://api.openai.com/v1/chat/completions
  // - Claude API: https://api.anthropic.com/v1/messages
  // Or use a vision model for image analysis

  // Mock response based on input
  const input = request.input.toLowerCase()

  // Simple mock food database for demonstration
  const mockFoods = generateMockFoods(input)

  const totalCalories = mockFoods.reduce((sum, food) => sum + food.calories, 0)
  const totalProtein = mockFoods.reduce((sum, food) => sum + food.protein, 0)
  const totalCarbs = mockFoods.reduce((sum, food) => sum + food.carbs, 0)
  const totalFats = mockFoods.reduce((sum, food) => sum + food.fats, 0)
  const totalFiber = mockFoods.reduce((sum, food) => sum + (food.fiber || 0), 0)

  const suggestions = generateSuggestions(mockFoods, request.userProfile?.goal)
  const warnings = generateWarnings(mockFoods, totalCalories)

  return {
    foods: mockFoods,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    totalFiber,
    analysis: generateAnalysis(mockFoods, totalCalories),
    suggestions,
    warnings,
    confidence: 0.85,
  }
}

function generateMockFoods(input: string): FoodItem[] {
  const foods: FoodItem[] = []

  // Simple keyword matching for demo purposes
  if (input.includes('arroz') || input.includes('rice')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Arroz branco cozido',
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fats: 0.3,
      fiber: 0.4,
      glycemicIndex: 73,
      portion: '1 colher de servir (100g)',
      category: 'carbs',
    })
  }

  if (input.includes('feijão') || input.includes('beans')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Feijão preto cozido',
      calories: 77,
      protein: 4.5,
      carbs: 14,
      fats: 0.5,
      fiber: 5.5,
      glycemicIndex: 38,
      portion: '1 concha (100g)',
      category: 'protein',
    })
  }

  if (input.includes('frango') || input.includes('chicken')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Peito de frango grelhado',
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      fiber: 0,
      glycemicIndex: 0,
      portion: '100g',
      category: 'protein',
    })
  }

  if (input.includes('salada') || input.includes('alface') || input.includes('lettuce')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Salada verde mista',
      calories: 25,
      protein: 1.5,
      carbs: 4,
      fats: 0.3,
      fiber: 2,
      glycemicIndex: 15,
      portion: '1 prato (150g)',
      category: 'vegetables',
    })
  }

  if (input.includes('banana')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Banana média',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fats: 0.4,
      fiber: 3.1,
      glycemicIndex: 51,
      portion: '1 unidade (120g)',
      category: 'fruits',
    })
  }

  if (input.includes('ovo') || input.includes('egg')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Ovo cozido',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fats: 11,
      fiber: 0,
      glycemicIndex: 0,
      portion: '2 unidades',
      category: 'protein',
    })
  }

  if (input.includes('batata doce') || input.includes('sweet potato')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Batata doce cozida',
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fats: 0.1,
      fiber: 3,
      glycemicIndex: 44,
      portion: '100g',
      category: 'carbs',
    })
  }

  if (input.includes('café') || input.includes('coffee')) {
    foods.push({
      id: crypto.randomUUID(),
      name: 'Café preto',
      calories: 2,
      protein: 0.3,
      carbs: 0,
      fats: 0,
      fiber: 0,
      glycemicIndex: 0,
      portion: '1 xícara (240ml)',
      category: 'beverages',
    })
  }

  // Default generic food if no matches
  if (foods.length === 0) {
    foods.push({
      id: crypto.randomUUID(),
      name: input,
      calories: 200,
      protein: 10,
      carbs: 25,
      fats: 8,
      fiber: 3,
      portion: 'Porção estimada',
      category: 'processed',
    })
  }

  return foods
}

function generateAnalysis(foods: FoodItem[], totalCalories: number): string {
  const hasProtein = foods.some((f) => f.protein > 10)
  const hasVeggies = foods.some((f) => f.category === 'vegetables')
  const lowGI = foods.every((f) => !f.glycemicIndex || f.glycemicIndex < 55)

  let analysis = `Refeição de ${Math.round(totalCalories)} calorias. `

  if (hasProtein) {
    analysis += 'Boa fonte de proteína. '
  }

  if (hasVeggies) {
    analysis += 'Inclui vegetais, ótimo! '
  }

  if (lowGI) {
    analysis += 'Alimentos de baixo índice glicêmico, excelente para controle hormonal. '
  }

  return analysis
}

function generateSuggestions(foods: FoodItem[], goal?: string): string[] {
  const suggestions: string[] = []

  const hasProtein = foods.some((f) => f.protein > 10)
  const hasVeggies = foods.some((f) => f.category === 'vegetables')
  const hasFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0) > 5

  if (!hasProtein) {
    suggestions.push('Adicione uma fonte de proteína (frango, peixe, ovos) para saciedade')
  }

  if (!hasVeggies) {
    suggestions.push('Inclua vegetais para aumentar fibras e micronutrientes')
  }

  if (!hasFiber) {
    suggestions.push('Aumente as fibras com vegetais, legumes ou grãos integrais')
  }

  if (goal === 'weight-loss') {
    suggestions.push('Para perda de peso, priorize proteínas e vegetais')
  }

  return suggestions
}

function generateWarnings(foods: FoodItem[], totalCalories: number): string[] {
  const warnings: string[] = []

  if (totalCalories > 800) {
    warnings.push('Refeição calórica. Considere reduzir porções se estiver em déficit calórico')
  }

  const highGI = foods.filter((f) => f.glycemicIndex && f.glycemicIndex > 70)
  if (highGI.length > 0) {
    warnings.push(
      'Alimentos de alto índice glicêmico detectados. Podem causar picos de insulina'
    )
  }

  return warnings
}

/**
 * Analyze food from barcode
 * In production, this would call Open Food Facts API or similar
 */
export async function analyzeFoodFromBarcode(barcode: string): Promise<AIAnalysisResponse> {
  // Mock implementation
  return analyzeFood({
    input: `produto com código de barras ${barcode}`,
    inputType: 'barcode',
    timestamp: new Date(),
  })
}

/**
 * Analyze food from image
 * In production, this would use vision AI (OpenAI Vision, Claude Vision, or Google Vision)
 */
export async function analyzeFoodFromImage(_imageData: string): Promise<AIAnalysisResponse> {
  // Mock implementation
  // In production, use imageData to send to vision AI
  return analyzeFood({
    input: 'prato de comida com arroz, feijão e frango',
    inputType: 'image',
    timestamp: new Date(),
  })
}
