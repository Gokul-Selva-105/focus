// Shared meals data store
// In a real app, this would be replaced with a proper database

export interface Meal {
  _id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  createdAt: string
  userEmail: string
}

// Mock database - shared across all API routes
export let mealsData: Meal[] = [
  {
    _id: '1',
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25,
    mealType: 'lunch',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  },
  {
    _id: '2',
    name: 'Oatmeal with Berries',
    calories: 320,
    protein: 12,
    carbs: 55,
    fat: 8,
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  }
]

// Helper functions for data manipulation
export const addMeal = (meal: Meal) => {
  mealsData.push(meal)
}

export const deleteMeal = (id: string, userEmail: string) => {
  const index = mealsData.findIndex(
    meal => meal._id === id && meal.userEmail === userEmail
  )
  if (index !== -1) {
    mealsData.splice(index, 1)
    return true
  }
  return false
}

export const getMealsByUser = (userEmail: string) => {
  return mealsData
    .filter(meal => meal.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const generateMealId = () => {
  return Date.now().toString()
}