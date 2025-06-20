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
    if (!newMeal.name || !newMeal.calories) return

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Please sign in to track your meals.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Meals</h1>
        <p className="text-muted-foreground">Track your daily nutrition and calories</p>
      </motion.div>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories}</div>
            <p className="text-xs text-muted-foreground">kcal today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProtein.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCarbs.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFat.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Meal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createMeal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Meal Name</Label>
                <Input
                  id="name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <select
                  id="mealType"
                  value={newMeal.mealType}
                  onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack' })}
                  className="w-full p-2 border rounded-md"
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
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging...' : 'Log Meal'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>Your meals logged for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayMeals.length === 0 ? (
            <div className="text-center py-8">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No meals logged today. Add your first meal above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayMeals.map((meal, index) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      meal.mealType === 'breakfast' ? 'bg-yellow-100' :
                      meal.mealType === 'lunch' ? 'bg-green-100' :
                      meal.mealType === 'dinner' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <UtensilsCrossed className={`h-4 w-4 ${
                        meal.mealType === 'breakfast' ? 'text-yellow-600' :
                        meal.mealType === 'lunch' ? 'text-green-600' :
                        meal.mealType === 'dinner' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {meal.mealType} • {meal.calories} kcal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMeal(meal._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}