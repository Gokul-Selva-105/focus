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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center max-w-md mx-4"
          >
            <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 gradient-text">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Please sign in to view your analytics and insights.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium gradient-text">Loading Analytics...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center max-w-md mx-4"
          >
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground">Start using JARVIS to see your analytics and insights.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  const netIncome = analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses
  const fitnessGoalProgress = Math.min((analyticsData.fitness.totalWorkouts / 20) * 100, 100) // Assuming goal of 20 workouts per month

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Comprehensive insights into your productivity, health, and financial wellness</p>
          
          <div className="flex justify-center gap-3">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`capitalize transition-all duration-200 ${
                  timeRange === range 
                    ? 'btn-premium' 
                    : 'glass-card hover-lift border-white/20 hover:border-white/40'
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card hover-lift group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:scale-110 transition-transform">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${
                  netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ${Math.abs(netIncome).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {netIncome >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
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
            <Card className="glass-card hover-lift group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Workouts</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                  {analyticsData.fitness.totalWorkouts}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-2" />
                  {fitnessGoalProgress.toFixed(0)}% of monthly goal
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(fitnessGoalProgress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card hover-lift group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Task Completion</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform">
                  <Award className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                  {analyticsData.tasks.completionRate.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {analyticsData.tasks.completedTasks} of {analyticsData.tasks.totalTasks} tasks
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analyticsData.tasks.completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card hover-lift group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Daily Calories</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white group-hover:scale-110 transition-transform">
                  <Utensils className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-orange-600 dark:text-orange-400">
                  {analyticsData.meals.avgCalories.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
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
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  Financial Overview
                </CardTitle>
                <CardDescription>Income vs Expenses breakdown and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${analyticsData.finance.totalIncome.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Income</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ${analyticsData.finance.totalExpenses.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Expenses</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Top Expense Categories
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.finance.topCategories.slice(0, 3).map((category, index) => (
                        <div key={category.category} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="capitalize font-medium">{category.category}</span>
                          <span className="font-bold">${category.amount.toLocaleString()}</span>
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
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  Fitness Summary
                </CardTitle>
                <CardDescription>Your workout statistics and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.floor(analyticsData.fitness.totalDuration / 60)}h
                      </div>
                      <div className="text-sm text-muted-foreground">Total Duration</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {analyticsData.fitness.totalCalories.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Calories Burned</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Activity Types
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.fitness.activityTypes.map((activity) => (
                        <div key={activity.type} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="capitalize font-medium">{activity.type}</span>
                          <span className="font-bold">{activity.count} sessions</span>
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
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  Productivity Insights
                </CardTitle>
                <CardDescription>Task management and completion statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {analyticsData.tasks.completionRate.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${analyticsData.tasks.completionRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Task Priority Distribution
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.tasks.priorityDistribution.map((priority) => (
                        <div key={priority.priority} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="capitalize font-medium flex items-center gap-2">
                            {priority.priority === 'high' ? '🔴' : priority.priority === 'medium' ? '🟡' : '🟢'}
                            {priority.priority}
                          </span>
                          <span className="font-bold">{priority.count} tasks</span>
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
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  Schedule Overview
                </CardTitle>
                <CardDescription>Your calendar and event statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analyticsData.events.totalEvents}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analyticsData.events.upcomingEvents}
                      </div>
                      <div className="text-sm text-muted-foreground">Upcoming</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Event Types
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.events.eventTypes.map((eventType) => (
                        <div key={eventType.type} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="capitalize font-medium">{eventType.type}</span>
                          <span className="font-bold">{eventType.count} events</span>
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
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Target className="h-5 w-5" />
                </div>
                Goals & Recommendations
              </CardTitle>
              <CardDescription>AI-powered insights to improve your productivity and wellness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    💪 Fitness Goal
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You're {fitnessGoalProgress.toFixed(0)}% towards your monthly workout goal. 
                    {fitnessGoalProgress < 75 ? 'Keep pushing! You\'re doing great!' : 'Excellent progress! You\'re crushing it!'}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                    💰 Financial Health
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {netIncome >= 0 
                      ? 'Your finances are looking great! Consider investing the surplus for long-term growth.' 
                      : 'Review your expenses and identify areas to optimize your financial position.'}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                    ✅ Productivity
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analyticsData.tasks.completionRate >= 80 
                      ? 'Outstanding task completion rate! Your productivity system is working excellently.' 
                      : 'Try breaking down large tasks into smaller, manageable chunks for better completion rates.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}