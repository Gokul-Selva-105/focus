import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Mock data - in a real app, you'd calculate this from your database
const generateAnalyticsData = (timeRange: string) => {
  const now = new Date()
  const isWeek = timeRange === 'week'
  const isMonth = timeRange === 'month'
  const isYear = timeRange === 'year'

  return {
    finance: {
      totalIncome: isWeek ? 1200 : isMonth ? 5420 : 65000,
      totalExpenses: isWeek ? 800 : isMonth ? 3280 : 42000,
      monthlyTrend: [
        { month: 'Jan', income: 5200, expenses: 3100 },
        { month: 'Feb', income: 5400, expenses: 3200 },
        { month: 'Mar', income: 5100, expenses: 3400 },
        { month: 'Apr', income: 5600, expenses: 3000 },
        { month: 'May', income: 5300, expenses: 3300 },
        { month: 'Jun', income: 5420, expenses: 3280 }
      ],
      topCategories: [
        { category: 'rent', amount: 1200 },
        { category: 'groceries', amount: 450 },
        { category: 'utilities', amount: 280 },
        { category: 'transportation', amount: 200 },
        { category: 'entertainment', amount: 150 }
      ]
    },
    fitness: {
      totalWorkouts: isWeek ? 4 : isMonth ? 16 : 180,
      totalDuration: isWeek ? 240 : isMonth ? 960 : 10800, // minutes
      totalCalories: isWeek ? 1200 : isMonth ? 4800 : 54000,
      weeklyTrend: [
        { week: 'Week 1', workouts: 4, duration: 240 },
        { week: 'Week 2', workouts: 3, duration: 180 },
        { week: 'Week 3', workouts: 5, duration: 300 },
        { week: 'Week 4', workouts: 4, duration: 240 }
      ],
      activityTypes: [
        { type: 'cardio', count: isWeek ? 2 : isMonth ? 8 : 90 },
        { type: 'strength', count: isWeek ? 2 : isMonth ? 6 : 70 },
        { type: 'flexibility', count: isWeek ? 0 : isMonth ? 2 : 20 }
      ]
    },
    meals: {
      totalMeals: isWeek ? 21 : isMonth ? 90 : 1095,
      avgCalories: isWeek ? 1850 : isMonth ? 1920 : 1900,
      avgProtein: isWeek ? 85 : isMonth ? 88 : 90,
      weeklyTrend: [
        { week: 'Week 1', meals: 21, calories: 1850 },
        { week: 'Week 2', meals: 20, calories: 1920 },
        { week: 'Week 3', meals: 22, calories: 1880 },
        { week: 'Week 4', meals: 21, calories: 1900 }
      ]
    },
    tasks: {
      totalTasks: isWeek ? 12 : isMonth ? 48 : 580,
      completedTasks: isWeek ? 10 : isMonth ? 38 : 465,
      completionRate: isWeek ? 83.3 : isMonth ? 79.2 : 80.2,
      priorityDistribution: [
        { priority: 'high', count: isWeek ? 3 : isMonth ? 12 : 145 },
        { priority: 'medium', count: isWeek ? 6 : isMonth ? 24 : 290 },
        { priority: 'low', count: isWeek ? 3 : isMonth ? 12 : 145 }
      ]
    },
    events: {
      totalEvents: isWeek ? 8 : isMonth ? 32 : 385,
      upcomingEvents: isWeek ? 5 : isMonth ? 15 : 45,
      eventTypes: [
        { type: 'meeting', count: isWeek ? 3 : isMonth ? 12 : 150 },
        { type: 'appointment', count: isWeek ? 2 : isMonth ? 8 : 95 },
        { type: 'personal', count: isWeek ? 2 : isMonth ? 8 : 95 },
        { type: 'work', count: isWeek ? 1 : isMonth ? 4 : 45 }
      ]
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('range') || 'month'

    if (!['week', 'month', 'year'].includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range. Must be week, month, or year' },
        { status: 400 }
      )
    }

    const analyticsData = generateAnalyticsData(timeRange)
    
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}