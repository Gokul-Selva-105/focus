import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getMealsByUser, addMeal, generateMealId, type Meal } from '@/lib/meals-data'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get meals by user email (already sorted)
    const userMeals = getMealsByUser(session.user.email)
    
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

    const newMeal: Meal = {
      _id: generateMealId(),
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

    addMeal(newMeal)
    
    return NextResponse.json(newMeal, { status: 201 })
  } catch (error) {
    console.error('Meals POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}