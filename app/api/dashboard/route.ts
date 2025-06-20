import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for dashboard stats
    // In a real app, you would fetch this from your database
    const dashboardStats = {
      tasks: {
        total: 24,
        completed: 18,
        pending: 6,
        overdue: 2
      },
      finance: {
        totalIncome: 5420,
        totalExpenses: 3280,
        netIncome: 2140,
        recentTransactions: 8
      },
      meals: {
        todayCalories: 1850,
        targetCalories: 2000,
        mealsLogged: 3,
        avgProtein: 85
      },
      fitness: {
        weeklyWorkouts: 4,
        totalDuration: 240, // minutes
        caloriesBurned: 1200,
        activeStreak: 5
      },
      calendar: {
        todayEvents: 3,
        upcomingEvents: 7,
        thisWeekEvents: 12,
        nextEvent: 'Team Meeting at 2:00 PM'
      },
      analytics: {
        productivityScore: 85,
        weeklyProgress: 78,
        goalsAchieved: 6,
        totalGoals: 8
      }
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}