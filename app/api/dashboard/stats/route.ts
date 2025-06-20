import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Task from '@/models/Task'
import Transaction from '@/models/Transaction'
import Meal from '@/models/Meal'
import Activity from '@/models/Activity'
import Event from '@/models/Event'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current date for filtering
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Fetch tasks stats
    const totalTasks = await Task.countDocuments({ userId: user._id })
    const completedTasks = await Task.countDocuments({ 
      userId: user._id, 
      completed: true,
      updatedAt: { $gte: startOfDay }
    })

    // Fetch finance stats
    const transactions = await Transaction.find({ userId: user._id })
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
    const todayMeals = await Meal.countDocuments({ 
      userId: user._id,
      createdAt: { $gte: startOfDay }
    })

    const todayMealsData = await Meal.find({ 
      userId: user._id,
      createdAt: { $gte: startOfDay }
    })

    const totalCalories = todayMealsData.reduce((sum: number, meal: any) => {
      return sum + (meal.calories || 0)
    }, 0)

    // Fetch fitness stats
    const weeklyActivities = await Activity.countDocuments({ 
      userId: user._id,
      createdAt: { $gte: startOfWeek }
    })

    const weeklyActivitiesData = await Activity.find({ 
      userId: user._id,
      createdAt: { $gte: startOfWeek }
    })

    const weeklyCaloriesBurned = weeklyActivitiesData.reduce((sum: number, activity: any) => {
      return sum + (activity.caloriesBurned || 0)
    }, 0)

    // Fetch calendar stats
    const upcomingEvents = await Event.countDocuments({ 
      userId: user._id,
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