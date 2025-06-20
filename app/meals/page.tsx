'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, UtensilsCrossed, Clock, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Meal {
  _id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  createdAt: string
}

export default function MealsPage() {
  const { data: session } = useSession()
  const [meals, setMeals] = useState<Meal[]>([])
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'breakfast' as const
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchMeals()
    }
  }, [session])

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/meals')
      if (response.ok) {
        const data = await response.json()
        setMeals(data)
      }
    } catch (error) {
      console.error('Failed to fetch meals:', error)
    }
  }

  const createMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMeal.name) {
      toast({ title: 'Please enter a meal name', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMeal,
          calories: parseFloat(newMeal.calories),
          protein: parseFloat(newMeal.protein) || 0,
          carbs: parseFloat(newMeal.carbs) || 0,
          fat: parseFloat(newMeal.fat) || 0
        })
      })

      if (response.ok) {
        const meal = await response.json()
        setMeals([meal, ...meals])
        setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'breakfast' })
        toast({ title: 'Meal logged successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to log meal', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMeal = async (mealId: string) => {
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMeals(meals.filter(m => m._id !== mealId))
        toast({ title: 'Meal deleted successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete meal', variant: 'destructive' })
    }
  }

  const todayMeals = meals.filter(meal => {
    const today = new Date().toDateString()
    const mealDate = new Date(meal.date).toDateString()
    return today === mealDate
  })

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0)

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-center justify-center min-h-[60vh]">
          <div className="glass-card p-8 text-center">
            <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium mb-2">Welcome to Meals Tracker</p>
            <p className="text-muted-foreground">Please sign in to track your meals and nutrition.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-200/20 dark:bg-green-500/5 rounded-full blur-3xl" />
      
      <div className="relative space-y-8 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Meals</h1>
          <p className="text-muted-foreground text-lg">Track your daily nutrition and calories</p>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="glass-card hover-lift p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Calories</h3>
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalCalories}</div>
            <p className="text-xs text-muted-foreground mt-1">kcal today</p>
          </div>
          
          <div className="glass-card hover-lift p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Protein</h3>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalProtein.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground mt-1">today</p>
          </div>
          
          <div className="glass-card hover-lift p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Carbs</h3>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{totalCarbs.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground mt-1">today</p>
          </div>
          
          <div className="glass-card hover-lift p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Fat</h3>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalFat.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground mt-1">today</p>
          </div>
        </motion.div>

        {/* Add Meal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Log Meal</h2>
          </div>
          
          <form onSubmit={createMeal} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">Meal Name</Label>
                <Input
                  id="name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                  className="glass-input"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mealType" className="text-sm font-medium mb-2 block">Meal Type</Label>
                <select
                  id="mealType"
                  value={newMeal.mealType}
                  onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack' })}
                  className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories" className="text-sm font-medium mb-2 block">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  placeholder="0"
                  className="glass-input"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-sm font-medium mb-2 block">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  placeholder="0"
                  className="glass-input"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-sm font-medium mb-2 block">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  placeholder="0"
                  className="glass-input"
                />
              </div>
              <div>
                <Label htmlFor="fat" className="text-sm font-medium mb-2 block">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                  placeholder="0"
                  className="glass-input"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="btn-premium w-full">
              {isLoading ? 'Logging...' : 'Log Meal'}
            </Button>
          </form>
        </motion.div>

        {/* Meals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Today's Meals</h2>
              <p className="text-sm text-muted-foreground">Your meals logged for today</p>
            </div>
          </div>
          
          {todayMeals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No meals logged today</h3>
              <p className="text-muted-foreground">Add your first meal above to start tracking your nutrition!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayMeals.map((meal, index) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card hover-lift p-4 border-l-4 border-l-blue-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        meal.mealType === 'breakfast' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                        meal.mealType === 'lunch' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                        meal.mealType === 'dinner' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                        'bg-gradient-to-r from-purple-400 to-pink-400'
                      }`}>
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{meal.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meal.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            meal.mealType === 'lunch' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            meal.mealType === 'dinner' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          } capitalize`}>
                            {meal.mealType}
                          </span>
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">{meal.calories} kcal</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            P: {meal.protein}g
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            C: {meal.carbs}g
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            F: {meal.fat}g
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMeal(meal._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}