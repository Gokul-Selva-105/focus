import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Mock database - in a real app, you'd use a proper database
let meals: any[] = [
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter meals by user email
    const userMeals = meals.filter(meal => meal.userEmail === session.user.email)
    
    // Sort by date (newest first)
    userMeals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(userMeals)
  } catch (error) {
    console.error('Meals GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, calories, protein, carbs, fat, mealType } = body

    if (!name || !calories || !mealType) {
      return NextResponse.json(
        { error: 'Name, calories, and meal type are required' },
        { status: 400 }
      )
    }

    const newMeal = {
      _id: Date.now().toString(),
      name,
      calories: parseInt(calories),
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      mealType,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      userEmail: session.user.email
    }

    meals.push(newMeal)
    
    return NextResponse.json(newMeal, { status: 201 })
  } catch (error) {
    console.error('Meals POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}