import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userEmail = session.user.email

    // Get current date for filtering
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Fetch tasks stats
    const totalTasks = await db.collection('tasks').countDocuments({ userEmail })
    const completedTasks = await db.collection('tasks').countDocuments({ 
      userEmail, 
      completed: true,
      updatedAt: { $gte: startOfDay }
    })

    // Fetch finance stats
    const transactions = await db.collection('transactions').find({ userEmail }).toArray()
    const currentBalance = transactions.reduce((sum: number, t: any) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount
    }, 0)

    const monthlyIncome = transactions
      .filter((t: any) => t.type === 'income' && new Date(t.createdAt) >= startOfMonth)
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const monthlyExpenses = transactions
      .filter((t: any) => t.type === 'expense' && new Date(t.createdAt) >= startOfMonth)
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    // Fetch meals stats
    const todayMeals = await db.collection('meals').countDocuments({ 
      userEmail,
      createdAt: { $gte: startOfDay }
    })

    const todayMealsData = await db.collection('meals').find({ 
      userEmail,
      createdAt: { $gte: startOfDay }
    }).toArray()

    const totalCalories = todayMealsData.reduce((sum: number, meal: any) => {
      return sum + (meal.calories || 0)
    }, 0)

    // Fetch fitness stats
    const weeklyActivities = await db.collection('activities').countDocuments({ 
      userEmail,
      createdAt: { $gte: startOfWeek }
    })

    const weeklyActivitiesData = await db.collection('activities').find({ 
      userEmail,
      createdAt: { $gte: startOfWeek }
    }).toArray()

    const weeklyCaloriesBurned = weeklyActivitiesData.reduce((sum: number, activity: any) => {
      return sum + (activity.caloriesBurned || 0)
    }, 0)

    // Fetch calendar stats
    const upcomingEvents = await db.collection('events').countDocuments({ 
      userEmail,
      date: { $gte: today }
    })

    const stats = {
      totalTasks,
      completedTasks,
      currentBalance,
      todayMeals,
      weeklyActivities,
      upcomingEvents,
      totalCalories,
      weeklyCaloriesBurned,
      monthlyIncome,
      monthlyExpenses
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}