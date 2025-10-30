/**
 * Open Food Facts API Service
 * https://world.openfoodfacts.org/data
 */

import type { FoodItem } from '@/types'

interface OpenFoodFactsProduct {
  product_name?: string
  brands?: string
  quantity?: string
  serving_size?: string
  nutriments?: {
    'energy-kcal_100g'?: number
    'energy-kcal_serving'?: number
    proteins_100g?: number
    proteins_serving?: number
    carbohydrates_100g?: number
    carbohydrates_serving?: number
    fat_100g?: number
    fat_serving?: number
    fiber_100g?: number
    fiber_serving?: number
    sodium_100g?: number
    sodium_serving?: number
  }
  nutrition_grade_fr?: string
}

interface OpenFoodFactsResponse {
  status: number
  product?: OpenFoodFactsProduct
}

/**
 * Fetch product data from Open Food Facts by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    )

    if (!response.ok) {
      throw new Error('Product not found')
    }

    const data: OpenFoodFactsResponse = await response.json()

    if (data.status !== 1 || !data.product) {
      return null
    }

    const product = data.product
    const nutriments = product.nutriments || {}

    // Prefer serving size data, fallback to 100g data
    const calories = nutriments['energy-kcal_serving'] || nutriments['energy-kcal_100g'] || 0
    const protein = nutriments.proteins_serving || nutriments.proteins_100g || 0
    const carbs = nutriments.carbohydrates_serving || nutriments.carbohydrates_100g || 0
    const fat = nutriments.fat_serving || nutriments.fat_100g || 0
    const fiber = nutriments.fiber_serving || nutriments.fiber_100g || 0
    const sodium = nutriments.sodium_serving || nutriments.sodium_100g || 0

    const name = product.product_name || 'Produto sem nome'
    const brand = product.brands || ''
    const fullName = brand ? `${name} - ${brand}` : name

    const portion = product.serving_size || product.quantity || '100g'

    const foodItem: FoodItem = {
      id: crypto.randomUUID(),
      name: fullName,
      calories,
      protein,
      carbs,
      fats: fat,
      fiber,
      sodium,
      portion,
      category: determineCategory(product),
    }

    return foodItem
  } catch (error) {
    console.error('Error fetching product from Open Food Facts:', error)
    return null
  }
}

/**
 * Search products by name
 */
export async function searchProducts(query: string, page: number = 1): Promise<FoodItem[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&page=${page}&page_size=10&json=true`
    )

    if (!response.ok) {
      throw new Error('Search failed')
    }

    const data = await response.json()

    if (!data.products || data.products.length === 0) {
      return []
    }

    return data.products
      .map((product: OpenFoodFactsProduct) => {
        const nutriments = product.nutriments || {}

        const calories = nutriments['energy-kcal_100g'] || 0
        const protein = nutriments.proteins_100g || 0
        const carbs = nutriments.carbohydrates_100g || 0
        const fat = nutriments.fat_100g || 0
        const fiber = nutriments.fiber_100g || 0
        const sodium = nutriments.sodium_100g || 0

        const name = product.product_name || 'Produto sem nome'
        const brand = product.brands || ''
        const fullName = brand ? `${name} - ${brand}` : name

        return {
          id: crypto.randomUUID(),
          name: fullName,
          calories,
          protein,
          carbs,
          fats: fat,
          fiber,
          sodium,
          portion: '100g',
          category: determineCategory(product),
        } as FoodItem
      })
      .filter((item: FoodItem) => item.calories > 0) // Filter out items with no nutritional data
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

/**
 * Determine food category based on product data
 */
function determineCategory(product: OpenFoodFactsProduct): FoodItem['category'] {
  const name = (product.product_name || '').toLowerCase()

  if (name.includes('carne') || name.includes('frango') || name.includes('peixe')) {
    return 'protein'
  }
  if (name.includes('arroz') || name.includes('massa') || name.includes('pão')) {
    return 'carbs'
  }
  if (name.includes('vegetal') || name.includes('salada') || name.includes('verdura')) {
    return 'vegetables'
  }
  if (name.includes('fruta') || name.includes('banana') || name.includes('maçã')) {
    return 'fruits'
  }
  if (name.includes('leite') || name.includes('iogurte') || name.includes('queijo')) {
    return 'dairy'
  }
  if (name.includes('refrigerante') || name.includes('suco') || name.includes('bebida')) {
    return 'beverages'
  }

  return 'processed'
}
