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
  Plus,
  BarChart3,
  Moon,
  Sun,
  Star,
  Sparkles,
  Users,
  Award,
  PieChart,
  LineChart,
  Apple
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
  type: string
  description: string
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

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0
  const calorieGoal = 2000
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return
      
      try {
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
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

  // if (status === 'loading' || isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
  //       <div className="relative">
  //         <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
  //         <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-400 rounded-full animate-spin animation-delay-150"></div>
  //       </div>
  //     </div>
  //   )
  // }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
        
        {/* Stars */}
        <Star className="absolute top-32 left-1/4 w-4 h-4 text-yellow-400 animate-pulse" />
        <Sparkles className="absolute top-1/4 right-1/3 w-5 h-5 text-purple-400 animate-pulse animation-delay-1000" />
        <Star className="absolute bottom-1/3 left-1/5 w-3 h-3 text-pink-400 animate-pulse animation-delay-2000" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              JARVIS
            </h1>
            <p className="text-2xl text-gray-700 mb-3 font-medium">Your Peaceful AI Assistant</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Experience tranquil productivity with mindful task management, wellness tracking, and gentle financial guidance</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white/40 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-xl">Mindful Tasks</h3>
              <p className="text-gray-600 leading-relaxed">Gentle task prioritization with AI-powered insights for balanced productivity</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-xl">Wellness Journey</h3>
              <p className="text-gray-600 leading-relaxed">Holistic health tracking with beautiful visualizations and gentle reminders</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-xl">Financial Harmony</h3>
              <p className="text-gray-600 leading-relaxed">Peaceful money management with intuitive insights and stress-free budgeting</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
              <Link href="/auth/signin">
                <Sparkles className="w-5 h-5 mr-3" />
                Begin Your Journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/30 backdrop-blur-lg border-2 border-white/30 hover:bg-white/40 text-gray-700 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <Link href="/auth/signup">
                <Plus className="w-5 h-5 mr-3" />
                Create Account
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Good Morning, {session.user?.name || 'Friend'}!
                </h1>
              </div>
              <p className="text-gray-600 text-lg">You had a peaceful sleep last night ✨</p>
              <p className="text-gray-500">Ready to make today amazing?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/50 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/30 shadow-lg">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full px-3 py-1">
                    {Math.round(taskCompletionRate)}%
                  </Badge>
                </div>
                <CardTitle className="text-gray-700 text-sm font-medium mt-3">Task Progress</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-800 mb-3">{stats.completedTasks}/{stats.totalTasks}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${taskCompletionRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {taskCompletionRate > 75 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Excellent progress!
                    </span>
                  ) : (
                    <span className="text-blue-600 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Keep going!
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 rounded-full px-3 py-1">
                    {Math.round(savingsRate)}%
                  </Badge>
                </div>
                <CardTitle className="text-gray-700 text-sm font-medium mt-3">Balance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-800 mb-3">${stats.currentBalance.toLocaleString()}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {savingsRate > 20 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Great savings!
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Room to grow
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <UtensilsCrossed className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-0 rounded-full px-3 py-1">
                    {Math.round(calorieProgress)}%
                  </Badge>
                </div>
                <CardTitle className="text-gray-700 text-sm font-medium mt-3">Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-800 mb-3">{stats.totalCalories} cal</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {calorieProgress >= 80 && calorieProgress <= 120 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Perfect balance!
                    </span>
                  ) : (
                    <span className="text-blue-600 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Stay mindful
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-0 rounded-full px-3 py-1">
                    {stats.weeklyActivities}
                  </Badge>
                </div>
                <CardTitle className="text-gray-700 text-sm font-medium mt-3">Fitness</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-800 mb-3">{stats.weeklyActivities} sessions</div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">{stats.weeklyCaloriesBurned} cal burned</span>
                </div>
                <p className="text-xs text-gray-600">
                  {stats.weeklyActivities >= 3 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Amazing work!
                    </span>
                  ) : (
                    <span className="text-purple-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Let's move gently
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Weekly Progress Chart */}
          <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)}%`}}></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{stats.completedTasks}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">Workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.weeklyActivities / 7) * 100)}%`}}></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{stats.weeklyActivities}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">Meals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.todayMeals / 5) * 100)}%`}}></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{stats.todayMeals}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wellness Score */}
          <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                Wellness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-gradient-to-r from-green-400 to-blue-500"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${Math.round((taskCompletionRate + (stats.weeklyActivities * 10) + (stats.todayMeals * 5)) / 3)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {Math.round((taskCompletionRate + (stats.weeklyActivities * 10) + (stats.todayMeals * 5)) / 3)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {Math.round((taskCompletionRate + (stats.weeklyActivities * 10) + (stats.todayMeals * 5)) / 3) >= 80 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Award className="w-4 h-4" /> Excellent wellness!
                    </span>
                  ) : Math.round((taskCompletionRate + (stats.weeklyActivities * 10) + (stats.todayMeals * 5)) / 3) >= 60 ? (
                    <span className="text-blue-600 flex items-center gap-1">
                      <Target className="w-4 h-4" /> Good progress!
                    </span>
                  ) : (
                    <span className="text-purple-600 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Keep growing!
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 4).map((activity, index) => {
                    const IconComponent = getActivityIcon(activity.type)
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl hover:bg-white/40 transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm">{activity.title}</h3>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Moon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Your peaceful day awaits</p>
                    <p className="text-sm text-gray-400 mt-1">Start your journey with JARVIS</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild className="h-20 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href="/tasks" className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Add Task</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 text-green-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                   <Link href="/meals" className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                       <Apple className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-sm font-medium">Log Meal</span>
                   </Link>
                 </Button>
                <Button asChild className="h-20 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 text-orange-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href="/fitness" className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Log Workout</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 text-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href="/finance" className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Add Expense</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}