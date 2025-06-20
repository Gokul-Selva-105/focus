'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Utensils, 
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react'

interface AnalyticsData {
  finance: {
    totalIncome: number
    totalExpenses: number
    monthlyTrend: { month: string; income: number; expenses: number }[]
    topCategories: { category: string; amount: number }[]
  }
  fitness: {
    totalWorkouts: number
    totalDuration: number
    totalCalories: number
    weeklyTrend: { week: string; workouts: number; duration: number }[]
    activityTypes: { type: string; count: number }[]
  }
  meals: {
    totalMeals: number
    avgCalories: number
    avgProtein: number
    weeklyTrend: { week: string; meals: number; calories: number }[]
  }
  tasks: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    priorityDistribution: { priority: string; count: number }[]
  }
  events: {
    totalEvents: number
    upcomingEvents: number
    eventTypes: { type: string; count: number }[]
  }
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    if (session?.user) {
      fetchAnalytics()
    }
  }, [session, timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Please sign in to view your analytics.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>No analytics data available.</p>
      </div>
    )
  }

  const netIncome = analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses
  const fitnessGoalProgress = Math.min((analyticsData.fitness.totalWorkouts / 20) * 100, 100) // Assuming goal of 20 workouts per month

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Insights into your productivity and habits</p>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(netIncome).toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {netIncome >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                )}
                {netIncome >= 0 ? 'Profit' : 'Loss'} this {timeRange}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.fitness.totalWorkouts}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Target className="h-3 w-3 mr-1" />
                {fitnessGoalProgress.toFixed(0)}% of monthly goal
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.tasks.completionRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">
                {analyticsData.tasks.completedTasks} of {analyticsData.tasks.totalTasks} tasks
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Calories</CardTitle>
              <Utensils className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.meals.avgCalories.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {analyticsData.meals.avgProtein.toFixed(0)}g protein avg
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Finance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Overview
              </CardTitle>
              <CardDescription>Income vs Expenses breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Income</span>
                  <span className="text-green-600 font-bold">
                    ${analyticsData.finance.totalIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Expenses</span>
                  <span className="text-red-600 font-bold">
                    ${analyticsData.finance.totalExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Top Expense Categories</h4>
                  <div className="space-y-2">
                    {analyticsData.finance.topCategories.slice(0, 3).map((category, index) => (
                      <div key={category.category} className="flex justify-between text-sm">
                        <span className="capitalize">{category.category}</span>
                        <span>${category.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fitness Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Fitness Summary
              </CardTitle>
              <CardDescription>Your workout statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor(analyticsData.fitness.totalDuration / 60)}h
                    </div>
                    <div className="text-xs text-muted-foreground">Total Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analyticsData.fitness.totalCalories.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Calories Burned</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Activity Types</h4>
                  <div className="space-y-2">
                    {analyticsData.fitness.activityTypes.map((activity) => (
                      <div key={activity.type} className="flex justify-between text-sm">
                        <span className="capitalize">{activity.type}</span>
                        <span>{activity.count} sessions</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productivity Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Productivity Insights
              </CardTitle>
              <CardDescription>Task management statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {analyticsData.tasks.completionRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Task Priority Distribution</h4>
                  <div className="space-y-2">
                    {analyticsData.tasks.priorityDistribution.map((priority) => (
                      <div key={priority.priority} className="flex justify-between text-sm">
                        <span className="capitalize">{priority.priority}</span>
                        <span>{priority.count} tasks</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Overview
              </CardTitle>
              <CardDescription>Your calendar statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.events.totalEvents}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.events.upcomingEvents}
                    </div>
                    <div className="text-xs text-muted-foreground">Upcoming</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Event Types</h4>
                  <div className="space-y-2">
                    {analyticsData.events.eventTypes.map((eventType) => (
                      <div key={eventType.type} className="flex justify-between text-sm">
                        <span className="capitalize">{eventType.type}</span>
                        <span>{eventType.count} events</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Goals and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals & Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights to improve your productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600 mb-2">💪 Fitness Goal</h4>
                <p className="text-sm text-muted-foreground">
                  You're {fitnessGoalProgress.toFixed(0)}% towards your monthly workout goal. 
                  {fitnessGoalProgress < 75 ? 'Keep pushing!' : 'Great progress!'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600 mb-2">💰 Financial Health</h4>
                <p className="text-sm text-muted-foreground">
                  {netIncome >= 0 
                    ? 'Your finances are looking good! Consider investing the surplus.' 
                    : 'Review your expenses to improve your financial position.'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-purple-600 mb-2">✅ Productivity</h4>
                <p className="text-sm text-muted-foreground">
                  {analyticsData.tasks.completionRate >= 80 
                    ? 'Excellent task completion rate! You\'re very productive.' 
                    : 'Try breaking down large tasks into smaller, manageable chunks.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}