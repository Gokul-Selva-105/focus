import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import Task from '@/models/Task'
import Meal from '@/models/Meal'
import Transaction from '@/models/Transaction'
import Activity from '@/models/Activity'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const userId = session.user.id

    // Get recent activities from all collections
    const recentActivities = []

    // Get recent tasks
    const recentTasks = await Task.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean()

    recentTasks.forEach((task: any) => {
      recentActivities.push({
        id: task._id.toString(),
        type: 'task',
        title: task.completed ? `Completed: ${task.title}` : `Created: ${task.title}`,
        time: new Date(task.updatedAt || task.createdAt).toLocaleString(),
        status: task.completed ? 'Completed' : 'Pending'
      })
    })

    // Get recent meals
    const recentMeals = await Meal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    recentMeals.forEach((meal: any) => {
      recentActivities.push({
        id: meal._id.toString(),
        type: 'meal',
        title: `Logged meal: ${meal.name}`,
        time: new Date(meal.createdAt).toLocaleString(),
        status: meal.calories ? `${meal.calories} cal` : undefined
      })
    })

    // Get recent fitness activities
    const recentFitness = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    recentFitness.forEach((activity: any) => {
      recentActivities.push({
        id: activity._id.toString(),
        type: 'fitness',
        title: `${activity.type}: ${activity.name}`,
        time: new Date(activity.createdAt).toLocaleString(),
        status: activity.caloriesBurned ? `${activity.caloriesBurned} cal burned` : undefined
      })
    })

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    recentTransactions.forEach((transaction: any) => {
      recentActivities.push({
        id: transaction._id.toString(),
        type: 'finance',
        title: `${transaction.type === 'income' ? 'Income' : 'Expense'}: ${transaction.description}`,
        time: new Date(transaction.createdAt).toLocaleString(),
        status: `$${transaction.amount.toFixed(2)}`
      })
    })

    // Get recent events
    const recentEvents = await db.collection('events')
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    recentEvents.forEach((event: any) => {
      recentActivities.push({
        id: event._id.toString(),
        type: 'event',
        title: `Event: ${event.title}`,
        time: new Date(event.createdAt).toLocaleString(),
        status: new Date(event.date).toLocaleDateString()
      })
    })

    // Sort all activities by time (most recent first) and limit to 20
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 20)

    return NextResponse.json(sortedActivities)
  } catch (error) {
    console.error('Recent activities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    )
  }
}