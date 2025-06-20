import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Task from '@/models/Task'
import Transaction from '@/models/Transaction'
import Meal from '@/models/Meal'
import Activity from '@/models/Activity'
import Event from '@/models/Event'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const userId = session.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    // Get tasks stats
    const [totalTasks, completedTasks] = await Promise.all([
      Task.countDocuments({ userId, createdAt: { $gte: today, $lt: tomorrow } }),
      Task.countDocuments({ 
        userId, 
        completed: true,
        completedAt: { $gte: today, $lt: tomorrow }
      })
    ])

    // Get current balance
    const transactions = await Transaction.find({ userId })
    const currentBalance = transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount
    }, 0)

    // Get today's meals count
    const todayMeals = await Meal.countDocuments({
      userId,
      date: { $gte: today, $lt: tomorrow }
    })

    // Get this week's activities count
    const weeklyActivities = await Activity.countDocuments({
      userId,
      date: { $gte: weekStart }
    })

    // Get upcoming events count (next 7 days)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const upcomingEvents = await Event.countDocuments({
      userId,
      startDate: { $gte: today, $lte: nextWeek }
    })

    return NextResponse.json({
      totalTasks,
      completedTasks,
      currentBalance,
      todayMeals,
      weeklyActivities,
      upcomingEvents
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}