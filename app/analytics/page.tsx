'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Clock,
  Zap,
  Brain,
  Sparkles,
  Eye,
  Layers,
  Cpu,
  Orbit,
  Hexagon
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
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Neural Network Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          </div>
          {/* Floating Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Holographic Card */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl max-w-md mx-4">
              {/* Holographic Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-sm animate-pulse" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <Brain className="h-20 w-20 text-cyan-400 mx-auto" />
                    <div className="absolute inset-0 h-20 w-20 text-purple-400 mx-auto animate-ping opacity-20">
                      <Brain className="h-20 w-20" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  JARVIS Analytics
                </motion.h2>
                
                <p className="text-gray-300 mb-6 leading-relaxed">Access your neural analytics dashboard and AI-powered insights</p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:from-purple-500 hover:to-cyan-500 transition-all duration-300"
                >
                  <Zap className="h-4 w-4" />
                  Initialize Neural Link
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Neural Network Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              
              <div className="relative z-10 text-center">
                {/* Neural Loading Animation */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative w-16 h-16 mx-auto"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 w-16 h-16 mx-auto"
                  >
                    <Cpu className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-xl font-medium bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Neural Network Initializing...
                </motion.p>
                
                <div className="mt-4 flex justify-center space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl max-w-md mx-4">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Eye className="h-16 w-16 text-gray-400 mx-auto" />
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">Neural Data Void</h2>
                <p className="text-gray-400 leading-relaxed">Initialize your JARVIS modules to populate the neural analytics matrix.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const netIncome = analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses
  const fitnessGoalProgress = Math.min((analyticsData.fitness.totalWorkouts / 20) * 100, 100) // Assuming goal of 20 workouts per month

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10" />
        
        {/* Animated Neural Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.2)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        
        {/* Floating Neural Orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 0.7, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </div>
      
      <div className="relative z-10 p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 relative"
        >
          {/* Neural Header */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
            >
              <Orbit className="h-8 w-8 text-cyan-400/30" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_100%]"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              NEURAL ANALYTICS
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"
            />
          </div>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Advanced AI-powered insights into your digital consciousness and productivity matrix
          </motion.p>
          
          {/* Neural Time Range Selector */}
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            {(['week', 'month', 'year'] as const).map((range, index) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`relative px-8 py-4 rounded-2xl font-medium text-sm uppercase tracking-wider transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-white shadow-lg shadow-purple-500/25' 
                    : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                {timeRange === range && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {range === 'week' && <Clock className="h-4 w-4" />}
                  {range === 'month' && <Calendar className="h-4 w-4" />}
                  {range === 'year' && <Target className="h-4 w-4" />}
                  {range}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Neural Overview Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10, rotateX: 5 }}
            className="group perspective-1000"
          >
            <div className="relative">
              {/* Holographic Card */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-800/30 backdrop-blur-xl border border-green-500/30 shadow-2xl overflow-hidden">
                {/* Neural Circuit Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                
                {/* Holographic Glow */}
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-medium text-green-400/80 uppercase tracking-wider mb-1">Financial Neural</div>
                      <div className="text-sm text-gray-300">Net Income</div>
                    </div>
                    <motion.div 
                      className="p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value Display */}
                  <div className="mb-4">
                    <motion.div 
                      className={`text-4xl font-bold mb-2 ${
                        netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      ${Math.abs(netIncome).toLocaleString()}
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {netIncome >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                      </motion.div>
                      <span className="text-sm text-gray-400">
                        {netIncome >= 0 ? 'Neural Profit' : 'System Loss'} • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Neural Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: netIncome >= 0 ? '100%' : '30%' }}
                        transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10, rotateX: 5 }}
            className="group perspective-1000"
          >
            <div className="relative">
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-blue-800/30 backdrop-blur-xl border border-blue-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-medium text-blue-400/80 uppercase tracking-wider mb-1">Fitness Neural</div>
                      <div className="text-sm text-gray-300">Workout Sessions</div>
                    </div>
                    <motion.div 
                      className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Activity className="h-6 w-6 text-blue-400" />
                    </motion.div>
                  </div>
                  
                  <div className="mb-4">
                    <motion.div 
                      className="text-4xl font-bold mb-2 text-blue-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    >
                      {analyticsData.fitness.totalWorkouts}
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Target className="h-4 w-4 text-blue-400" />
                      </motion.div>
                      <span className="text-sm text-gray-400">
                        {fitnessGoalProgress.toFixed(0)}% Neural Goal • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(fitnessGoalProgress, 100)}%` }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -10, rotateX: 5 }}
            className="group perspective-1000"
          >
            <div className="relative">
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-purple-800/30 backdrop-blur-xl border border-purple-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-medium text-purple-400/80 uppercase tracking-wider mb-1">Task Neural</div>
                      <div className="text-sm text-gray-300">Completion Matrix</div>
                    </div>
                    <motion.div 
                      className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Award className="h-6 w-6 text-purple-400" />
                    </motion.div>
                  </div>
                  
                  <div className="mb-4">
                    <motion.div 
                      className="text-4xl font-bold mb-2 text-purple-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                    >
                      {analyticsData.tasks.completionRate.toFixed(0)}%
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <Target className="h-4 w-4 text-purple-400" />
                      </motion.div>
                      <span className="text-sm text-gray-400">
                        {analyticsData.tasks.completedTasks} of {analyticsData.tasks.totalTasks} • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-violet-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${analyticsData.tasks.completionRate}%` }}
                        transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ y: -10, rotateX: 5 }}
            className="group perspective-1000"
          >
            <div className="relative">
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-orange-800/30 backdrop-blur-xl border border-orange-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-medium text-orange-400/80 uppercase tracking-wider mb-1">Energy Neural</div>
                      <div className="text-sm text-gray-300">Daily Calories</div>
                    </div>
                    <motion.div 
                      className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Utensils className="h-6 w-6 text-orange-400" />
                    </motion.div>
                  </div>
                  
                  <div className="mb-4">
                    <motion.div 
                      className="text-4xl font-bold mb-2 text-orange-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                    >
                      {analyticsData.meals.avgCalories.toLocaleString()}
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                      >
                        <Target className="h-4 w-4 text-orange-400" />
                      </motion.div>
                      <span className="text-sm text-gray-400">
                        {analyticsData.meals.avgProtein.toFixed(0)}g protein • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((analyticsData.meals.avgCalories / 2000) * 100, 100)}%` }}
                        transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.9 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Neural Interface */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative">
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-900/20 via-green-900/10 to-emerald-800/20 backdrop-blur-xl border border-emerald-500/20 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 blur-lg"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-4 mb-8"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <motion.div
                      className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <DollarSign className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                        Financial Neural Matrix
                      </h3>
                      <p className="text-gray-400 text-sm">Advanced monetary intelligence • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-800/30 to-green-800/20 border border-emerald-500/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <div className="relative z-10">
                        <div className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-2">Income Neural</div>
                        <div className="text-3xl font-bold text-emerald-400 mb-2">
                          ${analyticsData.finance.totalIncome.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm text-gray-400">
                            +{((analyticsData.finance.totalIncome / 5000) * 100).toFixed(1)}% vs neural target
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-red-800/30 to-rose-800/20 border border-red-500/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                      />
                      <div className="relative z-10">
                        <div className="text-xs font-medium text-red-400/80 uppercase tracking-wider mb-2">Expense Neural</div>
                        <div className="text-3xl font-bold text-red-400 mb-2">
                          ${analyticsData.finance.totalExpenses.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-400" />
                          <span className="text-sm text-gray-400">
                            {((analyticsData.finance.totalExpenses / analyticsData.finance.totalIncome) * 100).toFixed(1)}% of income
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-800/30 to-cyan-800/20 border border-blue-500/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                      />
                      <div className="relative z-10">
                        <div className="text-xs font-medium text-blue-400/80 uppercase tracking-wider mb-2">Savings Neural</div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          ${(analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-400">
                            {(((analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses) / analyticsData.finance.totalIncome) * 100).toFixed(1)}% neural rate
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-emerald-500/20 pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                      <BarChart3 className="h-5 w-5" />
                      Neural Expense Categories
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analyticsData.finance.topCategories.slice(0, 3).map((category, index) => (
                        <motion.div 
                          key={category.category} 
                          className="relative p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-600/30 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize font-medium text-gray-300">{category.category}</span>
                            <span className="font-bold text-white">${category.amount.toLocaleString()}</span>
                          </div>
                          <motion.div 
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(category.amount / Math.max(...analyticsData.finance.topCategories.map(c => c.amount))) * 100}%` }}
                            transition={{ delay: 1.7 + index * 0.1, duration: 1, ease: "easeOut" }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fitness Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <div className="relative">
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-blue-800/20 backdrop-blur-xl border border-blue-500/20 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-lg"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-4 mb-8"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <motion.div
                      className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Activity className="h-8 w-8 text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Fitness Neural Matrix
                      </h3>
                      <p className="text-gray-400 text-sm">Advanced biometric intelligence • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-800/30 to-cyan-800/20 border border-blue-500/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                      />
                      <div className="relative z-10">
                        <div className="text-xs font-medium text-blue-400/80 uppercase tracking-wider mb-2">Duration Neural</div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          {Math.floor(analyticsData.fitness.totalDuration / 60)}h
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-400">
                            Total training time • Neural tracking
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-red-800/30 to-orange-800/20 border border-red-500/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                      />
                      <div className="relative z-10">
                        <div className="text-xs font-medium text-red-400/80 uppercase tracking-wider mb-2">Burn Neural</div>
                        <div className="text-3xl font-bold text-red-400 mb-2">
                          {analyticsData.fitness.totalCalories.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-red-400" />
                          <span className="text-sm text-gray-400">
                            Calories burned • Neural energy
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-blue-500/20 pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-400">
                      <Target className="h-5 w-5" />
                      Neural Activity Types
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analyticsData.fitness.activityTypes.map((activity, index) => (
                        <motion.div 
                          key={activity.type} 
                          className="relative p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-600/30 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize font-medium text-gray-300">{activity.type}</span>
                            <span className="font-bold text-white">{activity.count} sessions</span>
                          </div>
                          <motion.div 
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(activity.count / Math.max(...analyticsData.fitness.activityTypes.map(a => a.count))) * 100}%` }}
                            transition={{ delay: 1.7 + index * 0.1, duration: 1, ease: "easeOut" }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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