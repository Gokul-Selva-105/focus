'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckSquare, 
  DollarSign, 
  UtensilsCrossed, 
  Activity, 
  Calendar, 
  TrendingUp,
  Target,
  Clock,
  Flame,
  Heart,
  Zap,
  Trophy,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  currentBalance: number
  todayMeals: number
  weeklyActivities: number
  upcomingEvents: number
  totalCalories: number
  weeklyCaloriesBurned: number
  monthlyIncome: number
  monthlyExpenses: number
}

interface RecentActivity {
  id: string
  type: 'task' | 'meal' | 'fitness' | 'finance' | 'event'
  title: string
  time: string
  status?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    currentBalance: 0,
    todayMeals: 0,
    weeklyActivities: 0,
    upcomingEvents: 0,
    totalCalories: 0,
    weeklyCaloriesBurned: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-activities')
      ])
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">JARVIS</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your Personal AI Assistant for Self Development
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Track tasks, manage finances, monitor health, plan events, and achieve your goals with intelligent insights
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4">
              <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Task Management</p>
            </div>
            <div className="text-center p-4">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Finance Tracking</p>
            </div>
            <div className="text-center p-4">
              <UtensilsCrossed className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Nutrition Logging</p>
            </div>
            <div className="text-center p-4">
              <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Fitness Tracking</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0
  const calorieGoal = 2000 // This could be user-configurable
  const calorieProgress = (stats.totalCalories / calorieGoal) * 100
  const savingsRate = stats.monthlyIncome > 0 ? ((stats.monthlyIncome - stats.monthlyExpenses) / stats.monthlyIncome) * 100 : 0

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return CheckSquare
      case 'meal': return UtensilsCrossed
      case 'fitness': return Activity
      case 'finance': return DollarSign
      case 'event': return Calendar
      default: return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-600'
      case 'meal': return 'text-orange-600'
      case 'fitness': return 'text-red-600'
      case 'finance': return 'text-green-600'
      case 'event': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {session.user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your personal development overview for today
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchDashboardData}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/analytics">
                <Trophy className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Task Progress</CardTitle>
                <CheckSquare className="w-4 h-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {stats.completedTasks}/{stats.totalTasks}
              </div>
              <Progress value={taskCompletionRate} className="bg-blue-400" />
              <p className="text-xs opacity-90 mt-2">
                {taskCompletionRate.toFixed(0)}% completed today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Balance</CardTitle>
                <DollarSign className="w-4 h-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                ${stats.currentBalance.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                {savingsRate >= 0 ? (
                  <ArrowUp className="w-3 h-3 text-green-200" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-200" />
                )}
                <p className="text-xs opacity-90">
                  {savingsRate.toFixed(1)}% savings rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Nutrition</CardTitle>
                <UtensilsCrossed className="w-4 h-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {stats.totalCalories} cal
              </div>
              <Progress value={Math.min(calorieProgress, 100)} className="bg-orange-400" />
              <p className="text-xs opacity-90 mt-2">
                {stats.todayMeals} meals logged
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Fitness</CardTitle>
                <Activity className="w-4 h-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {stats.weeklyCaloriesBurned}
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-3 h-3 text-red-200" />
                <p className="text-xs opacity-90">
                  calories burned this week
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/tasks">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/meals">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Meal
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/fitness">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Workout
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/finance">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/calendar">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activity. Start by adding some data!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.slice(0, 6).map((activity) => {
                      const Icon = getActivityIcon(activity.type)
                      return (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full bg-white ${getActivityColor(activity.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.time}</p>
                          </div>
                          {activity.status && (
                            <Badge variant="secondary">{activity.status}</Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Module Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/tasks">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                      Tasks
                    </CardTitle>
                    <Badge variant="secondary">{stats.totalTasks}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage your daily tasks and to-dos</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>{stats.completedTasks}/{stats.totalTasks}</span>
                    </div>
                    <Progress value={taskCompletionRate} className="h-2" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/finance">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Finance
                    </CardTitle>
                    <Badge variant="secondary">${stats.currentBalance.toFixed(0)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track income, expenses, and budget</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Income</span>
                      <span className="text-green-600">${stats.monthlyIncome}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Expenses</span>
                      <span className="text-red-600">${stats.monthlyExpenses}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/meals">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      Nutrition
                    </CardTitle>
                    <Badge variant="secondary">{stats.todayMeals}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Log meals and track nutrition</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today's Calories</span>
                      <span>{stats.totalCalories} / {calorieGoal}</span>
                    </div>
                    <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/fitness">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-600" />
                      Fitness
                    </CardTitle>
                    <Badge variant="secondary">{stats.weeklyActivities}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track workouts and activities</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Activities</span>
                      <span>{stats.weeklyActivities}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Calories Burned</span>
                      <span>{stats.weeklyCaloriesBurned}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/calendar">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Calendar
                    </CardTitle>
                    <Badge variant="secondary">{stats.upcomingEvents}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage events and schedule</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upcoming Events</span>
                      <span>{stats.upcomingEvents}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link href="/analytics">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      Analytics
                    </CardTitle>
                    <Badge variant="secondary">Insights</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View detailed progress reports</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Points</span>
                      <span>All Modules</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}