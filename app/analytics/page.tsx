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
  Hexagon,
  Flame,
  Diamond,
  Star,
  Gem,
  Crown,
  Rocket,
  Atom,
  Waves
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black">
        {/* Neon Cyberpunk Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-emerald-500/5 to-yellow-500/5" />
          {/* Animated Neon Grid */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.4)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
          </div>
          {/* Floating Energy Orbs */}
          <motion.div 
            className="absolute top-1/3 left-1/5 w-80 h-80 bg-gradient-to-r from-orange-400/15 to-red-400/15 rounded-full blur-3xl"
            animate={{ 
              x: [0, 120, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-2/3 right-1/5 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"
            animate={{ 
              x: [0, -90, 0],
              y: [0, 70, 0],
              scale: [1, 0.7, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Neon Cyberpunk Card */}
            <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-900/60 via-slate-800/60 to-gray-900/60 backdrop-blur-2xl border border-orange-400/40 shadow-2xl max-w-lg mx-4">
              {/* Neon Glow Effects */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-orange-400/10 to-transparent animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/30 via-emerald-400/30 to-yellow-400/30 blur-sm animate-pulse" />
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-400/20 via-emerald-400/20 to-yellow-400/20 blur-lg opacity-50" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-8"
                >
                  <div className="relative">
                    <Flame className="h-24 w-24 text-orange-400 mx-auto drop-shadow-lg" />
                    <div className="absolute inset-0 h-24 w-24 text-red-400 mx-auto animate-ping opacity-30">
                      <Flame className="h-24 w-24" />
                    </div>
                    <div className="absolute inset-0 h-24 w-24 text-yellow-400 mx-auto animate-pulse opacity-40">
                      <Flame className="h-24 w-24" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                    textShadow: ['0 0 20px rgba(251,146,60,0.5)', '0 0 40px rgba(251,146,60,0.8)', '0 0 20px rgba(251,146,60,0.5)']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  NEXUS Analytics
                </motion.h2>
                
                <p className="text-gray-200 mb-8 leading-relaxed text-lg">Enter the cybernetic analytics realm and unlock data-driven insights</p>
                
                <motion.div
                  whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(251,146,60,0.6)' }}
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-lg"
                >
                  <Rocket className="h-5 w-5" />
                  Launch Interface
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black">
        {/* Neon Cyberpunk Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-emerald-500/5 to-yellow-500/5" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.4)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-900/60 via-slate-800/60 to-gray-900/60 backdrop-blur-2xl border border-orange-400/40 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-orange-400/10 to-transparent animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/30 via-emerald-400/30 to-yellow-400/30 blur-sm animate-pulse" />
              
              <div className="relative z-10 text-center">
                {/* Cyberpunk Loading Animation */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="relative w-20 h-20 mx-auto"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-orange-500/40" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 border-r-red-400" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-20 h-20 mx-auto"
                  >
                    <div className="absolute inset-2 rounded-full border-2 border-emerald-400/60" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-20 h-20 mx-auto"
                  >
                    <Atom className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent"
                  animate={{ 
                    opacity: [0.6, 1, 0.6],
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Cybernetic Systems Loading...
                </motion.p>
                
                <div className="mt-6 flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.8, 1], 
                        opacity: [0.4, 1, 0.4],
                        boxShadow: ['0 0 5px rgba(251,146,60,0.5)', '0 0 20px rgba(251,146,60,0.8)', '0 0 5px rgba(251,146,60,0.5)']
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-emerald-500/5 to-yellow-500/5" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.4)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-900/60 via-slate-800/60 to-gray-900/60 backdrop-blur-2xl border border-orange-400/40 shadow-2xl max-w-lg mx-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-orange-400/10 to-transparent animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/30 via-emerald-400/30 to-yellow-400/30 blur-sm animate-pulse" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-8"
                >
                  <div className="relative">
                    <Diamond className="h-20 w-20 text-gray-400 mx-auto" />
                    <motion.div 
                      className="absolute inset-0 h-20 w-20 text-orange-400/60 mx-auto"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Diamond className="h-20 w-20" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-300 via-orange-300 to-gray-400 bg-clip-text text-transparent">Data Nexus Empty</h2>
                <p className="text-gray-300 leading-relaxed text-lg">Activate your cybernetic modules to populate the analytics matrix with real-time data streams.</p>
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      {/* Neon Cyberpunk Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-emerald-500/8 to-yellow-500/8" />
        
        {/* Animated Cyberpunk Grid */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.3)_1px,transparent_1px)] bg-[size:120px_120px]" />
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.25)_1px,transparent_1px)] bg-[size:80px_80px]"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
        
        {/* Floating Energy Orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/12 to-red-500/12 rounded-full blur-3xl"
          animate={{ 
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-r from-emerald-500/12 to-teal-500/12 rounded-full blur-3xl"
          animate={{ 
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 0.7, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-16 relative"
        >
          {/* Cyberpunk Header */}
          <div className="relative mb-10">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6"
            >
              <Star className="h-10 w-10 text-yellow-400/40" />
            </motion.div>
            
            <motion.h1 
              className="text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent bg-[length:300%_100%]"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
                textShadow: ['0 0 30px rgba(251,146,60,0.3)', '0 0 60px rgba(251,146,60,0.6)', '0 0 30px rgba(251,146,60,0.3)']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              NEXUS ANALYTICS
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '300px' }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-orange-400 via-emerald-400 to-transparent mx-auto mb-8 rounded-full"
            />
          </div>
          
          <motion.p 
            className="text-2xl text-gray-200 max-w-4xl mx-auto mb-16 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Advanced AI-powered insights into your digital consciousness and productivity matrix
          </motion.p>
          
          {/* Cyberpunk Time Range Selector */}
          <motion.div 
            className="flex justify-center gap-6"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
          >
            {(['week', 'month', 'year'] as const).map((range, index) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`relative px-10 py-5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-400 ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white shadow-lg shadow-orange-500/30 border border-orange-400/50' 
                    : 'bg-gray-900/60 text-gray-300 hover:text-white hover:bg-gray-800/70 border border-orange-400/20 hover:border-orange-400/40'
                }`}
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  boxShadow: timeRange === range ? '0 0 40px rgba(251,146,60,0.6)' : '0 0 20px rgba(251,146,60,0.3)'
                }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.15 }}
              >
                {timeRange === range && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/25 via-red-400/25 to-yellow-400/25 blur-lg"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  {range === 'week' && <Waves className="h-5 w-5" />}
                  {range === 'month' && <Gem className="h-5 w-5" />}
                  {range === 'year' && <Crown className="h-5 w-5" />}
                  {range}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Cyberpunk Overview Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            whileHover={{ y: -15, rotateX: 8, scale: 1.02 }}
            className="group perspective-1000"
          >
            <div className="relative">
              {/* Cyberpunk Financial Card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/70 via-slate-800/70 to-gray-900/70 backdrop-blur-2xl border border-orange-400/40 shadow-2xl overflow-hidden">
                {/* Neon Circuit Pattern */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-3 left-3 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(251,146,60,0.4)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>
                
                {/* Enhanced Neon Glow Effects */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/40 via-red-400/40 to-orange-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-400/30 via-red-400/30 to-orange-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-orange-400/10 via-red-400/10 to-orange-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-xs font-bold text-orange-400/90 uppercase tracking-widest mb-2">Financial Core</div>
                      <div className="text-lg font-medium text-gray-200">Net Revenue</div>
                    </div>
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-orange-500/25 to-red-500/25 border border-orange-400/40"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <DollarSign className="h-7 w-7 text-orange-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value Display */}
                  <div className="mb-6">
                    <motion.div 
                      className={`text-5xl font-bold mb-3 ${
                        netIncome >= 0 ? 'text-orange-400' : 'text-red-400'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 250 }}
                    >
                      ${Math.abs(netIncome).toLocaleString()}
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        {netIncome >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-orange-400" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-400" />
                        )}
                      </motion.div>
                      <span className="text-sm text-gray-300 font-medium">
                        {netIncome >= 0 ? 'System Profit' : 'Revenue Loss'} • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cyberpunk Progress Bar */}
                  <div className="relative">
                    <div className="h-3 bg-gray-800/60 rounded-full overflow-hidden border border-orange-400/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-400"
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
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{ y: -15, rotateX: 8, scale: 1.02 }}
            className="group perspective-1000"
          >
            <div className="relative">
              {/* Cyberpunk Fitness Card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/70 via-slate-800/70 to-gray-900/70 backdrop-blur-2xl border border-emerald-400/40 shadow-2xl overflow-hidden">
                {/* Neon Circuit Pattern */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-3 left-3 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.4)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>
                
                {/* Enhanced Neon Glow Effects */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/40 via-teal-400/40 to-emerald-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-emerald-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.3 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-emerald-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.8 }}
                />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-xs font-bold text-emerald-400/90 uppercase tracking-widest mb-2">Fitness Core</div>
                      <div className="text-lg font-medium text-gray-200">Training Sessions</div>
                    </div>
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border border-emerald-400/40"
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <Activity className="h-7 w-7 text-emerald-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value Display */}
                  <div className="mb-6">
                    <motion.div 
                      className="text-5xl font-bold mb-3 text-emerald-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 250 }}
                    >
                      {analyticsData.fitness.totalWorkouts}
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Target className="h-5 w-5 text-emerald-400" />
                      </motion.div>
                      <span className="text-sm text-gray-300 font-medium">
                        {fitnessGoalProgress.toFixed(0)}% System Goal • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cyberpunk Progress Bar */}
                  <div className="relative">
                    <div className="h-3 bg-gray-800/60 rounded-full overflow-hidden border border-emerald-400/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(fitnessGoalProgress, 100)}%` }}
                        transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-3 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            whileHover={{ y: -15, rotateX: 8, scale: 1.02 }}
            className="group perspective-1000"
          >
            <div className="relative">
              {/* Cyberpunk Tasks Card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/70 via-slate-800/70 to-gray-900/70 backdrop-blur-2xl border border-yellow-400/40 shadow-2xl overflow-hidden">
                {/* Neon Circuit Pattern */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-3 left-3 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(234,179,8,0.4)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>
                
                {/* Enhanced Neon Glow Effects */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400/40 via-amber-400/40 to-yellow-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-yellow-400/30 via-amber-400/30 to-yellow-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-yellow-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-xs font-bold text-yellow-400/90 uppercase tracking-widest mb-2">Task Core</div>
                      <div className="text-lg font-medium text-gray-200">Completion Matrix</div>
                    </div>
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/25 to-amber-500/25 border border-yellow-400/40"
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <Award className="h-7 w-7 text-yellow-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value Display */}
                  <div className="mb-6">
                    <motion.div 
                      className="text-5xl font-bold mb-3 text-yellow-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 250 }}
                    >
                      {analyticsData.tasks.completionRate.toFixed(0)}%
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.7 }}
                      >
                        <Target className="h-5 w-5 text-yellow-400" />
                      </motion.div>
                      <span className="text-sm text-gray-300 font-medium">
                        {analyticsData.tasks.completedTasks} of {analyticsData.tasks.totalTasks} • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cyberpunk Progress Bar */}
                  <div className="relative">
                    <div className="h-3 bg-gray-800/60 rounded-full overflow-hidden border border-yellow-400/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${analyticsData.tasks.completionRate}%` }}
                        transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-3 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ y: -15, rotateX: 8, scale: 1.02 }}
            className="group perspective-1000"
          >
            <div className="relative">
              {/* Cyberpunk Energy Card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/70 via-slate-800/70 to-gray-900/70 backdrop-blur-2xl border border-purple-400/40 shadow-2xl overflow-hidden">
                {/* Neon Circuit Pattern */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-3 left-3 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.4)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>
                
                {/* Enhanced Neon Glow Effects */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/40 via-fuchsia-400/40 to-purple-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.7 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-400/30 via-fuchsia-400/30 to-purple-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-400/20 to-purple-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.7 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-400/10 via-fuchsia-400/10 to-purple-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2.2 }}
                />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-xs font-bold text-purple-400/90 uppercase tracking-widest mb-2">Energy Core</div>
                      <div className="text-lg font-medium text-gray-200">Daily Nutrition</div>
                    </div>
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-purple-500/25 to-fuchsia-500/25 border border-purple-400/40"
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <Utensils className="h-7 w-7 text-purple-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value Display */}
                  <div className="mb-6">
                    <motion.div 
                      className="text-5xl font-bold mb-3 text-purple-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 250 }}
                    >
                      {analyticsData.meals.avgCalories.toLocaleString()}
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.9 }}
                      >
                        <Target className="h-5 w-5 text-purple-400" />
                      </motion.div>
                      <span className="text-sm text-gray-300 font-medium">
                        {analyticsData.meals.avgProtein.toFixed(0)}g protein • {timeRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cyberpunk Progress Bar */}
                  <div className="relative">
                    <div className="h-3 bg-gray-800/60 rounded-full overflow-hidden border border-purple-400/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((analyticsData.meals.avgCalories / 2000) * 100, 100)}%` }}
                        transition={{ delay: 1.6, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <motion.div 
                      className="absolute top-0 left-0 h-3 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.2 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Cyberpunk Financial Interface */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: -25 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <div className="relative">
              <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-gray-900/80 backdrop-blur-2xl border border-orange-400/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(251,146,60,0.3)_1px,transparent_1px)] bg-[size:35px_35px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-400/20 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-5 mb-10"
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    <motion.div
                      className="p-5 rounded-xl bg-gradient-to-r from-orange-500/25 to-red-500/25 border border-orange-400/40"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <DollarSign className="h-9 w-9 text-orange-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                        Financial Nexus
                      </h3>
                      <p className="text-gray-300 text-base font-medium">Cybernetic wealth analysis • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <motion.div 
                      className="relative p-8 rounded-3xl bg-gradient-to-br from-orange-900/40 to-amber-900/30 border border-orange-400/40 backdrop-blur-lg shadow-2xl shadow-orange-500/20"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-400/40 to-amber-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-400/30 to-amber-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-orange-400/20 to-amber-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-orange-400/10 to-amber-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
                      />
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-orange-300/90 uppercase tracking-widest mb-3">Income Nexus</div>
                        <div className="text-4xl font-black text-orange-300 mb-3 drop-shadow-lg">
                          ${analyticsData.finance.totalIncome.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-orange-300" />
                          <span className="text-sm text-gray-300 font-medium">
                            +{((analyticsData.finance.totalIncome / 5000) * 100).toFixed(1)}% vs target
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-8 rounded-3xl bg-gradient-to-br from-red-900/40 to-pink-900/30 border border-red-400/40 backdrop-blur-lg shadow-2xl shadow-red-500/20"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-400/40 to-pink-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.7 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.2 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-400/10 to-pink-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.7 }}
                      />
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-red-300/90 uppercase tracking-widest mb-3">Expense Core</div>
                        <div className="text-4xl font-black text-red-300 mb-3 drop-shadow-lg">
                          ${analyticsData.finance.totalExpenses.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingDown className="h-5 w-5 text-red-300" />
                          <span className="text-sm text-gray-300 font-medium">
                            {((analyticsData.finance.totalExpenses / analyticsData.finance.totalIncome) * 100).toFixed(1)}% of income
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-8 rounded-3xl bg-gradient-to-br from-teal-900/40 to-cyan-900/30 border border-teal-400/40 backdrop-blur-lg shadow-2xl shadow-teal-500/20"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-400/40 to-cyan-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.4 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-400/30 to-cyan-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.9 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-teal-400/20 to-cyan-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.4 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-teal-400/10 to-cyan-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.9 }}
                      />
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-teal-300/90 uppercase tracking-widest mb-3">Savings Matrix</div>
                        <div className="text-4xl font-black text-teal-300 mb-3 drop-shadow-lg">
                          ${(analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-teal-300" />
                          <span className="text-sm text-gray-300 font-medium">
                            {(((analyticsData.finance.totalIncome - analyticsData.finance.totalExpenses) / analyticsData.finance.totalIncome) * 100).toFixed(1)}% rate
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-orange-400/30 pt-8">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-orange-300 text-xl">
                      <BarChart3 className="h-6 w-6" />
                      Expense Categories Matrix
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {analyticsData.finance.topCategories.slice(0, 3).map((category, index) => (
                        <motion.div 
                          key={category.category} 
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/40 border border-orange-400/30 backdrop-blur-lg shadow-xl shadow-orange-500/10"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.08, y: -4 }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="capitalize font-bold text-gray-200 text-lg">{category.category}</span>
                            <span className="font-black text-orange-300 text-xl">${category.amount.toLocaleString()}</span>
                          </div>
                          <motion.div 
                            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
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
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-green-800/25 backdrop-blur-xl border border-emerald-400/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20 blur-xl"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-5 mb-10"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <motion.div
                      className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 shadow-lg shadow-emerald-500/20"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Activity className="h-10 w-10 text-emerald-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent drop-shadow-lg">
                        Fitness Nexus
                      </h3>
                      <p className="text-gray-300 text-base font-medium">Biometric enhancement system • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <motion.div 
                      className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-400/40 backdrop-blur-lg shadow-2xl shadow-emerald-500/20"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/40 to-teal-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.7 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.2 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-400/10 to-teal-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.7 }}
                      />
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-emerald-300/90 uppercase tracking-widest mb-3">Duration Core</div>
                        <div className="text-4xl font-black text-emerald-300 mb-3 drop-shadow-lg">
                          {Math.floor(analyticsData.fitness.totalDuration / 60)}h
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-emerald-300" />
                          <span className="text-sm text-gray-300 font-medium">
                            Total training time
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative p-8 rounded-3xl bg-gradient-to-br from-red-900/40 to-orange-900/30 border border-red-400/40 backdrop-blur-lg shadow-2xl shadow-red-500/20"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-400/40 to-orange-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.4 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-400/30 to-orange-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.9 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-red-400/20 to-orange-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.4 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-400/10 to-orange-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.9 }}
                      />
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-red-300/90 uppercase tracking-widest mb-3">Burn Matrix</div>
                        <div className="text-4xl font-black text-red-300 mb-3 drop-shadow-lg">
                          {analyticsData.fitness.totalCalories.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <Flame className="h-5 w-5 text-red-300" />
                          <span className="text-sm text-gray-300 font-medium">
                            Calories burned
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-emerald-400/30 pt-8">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-emerald-300 text-xl">
                      <Target className="h-6 w-6" />
                      Activity Types Matrix
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {analyticsData.fitness.activityTypes.map((activity, index) => (
                        <motion.div 
                          key={activity.type} 
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/40 border border-emerald-400/30 backdrop-blur-lg shadow-xl shadow-emerald-500/10"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.08, y: -4 }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="capitalize font-bold text-gray-200 text-lg">{activity.type}</span>
                            <span className="font-black text-emerald-300 text-xl">{activity.count} sessions</span>
                          </div>
                          <motion.div 
                            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
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
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <div className="relative">
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-fuchsia-800/25 backdrop-blur-xl border border-purple-400/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3)_1px,transparent_1px)] bg-[size:28px_28px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-400/30 via-violet-400/30 to-fuchsia-400/30 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-fuchsia-400/20 blur-xl"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-purple-400/15 via-violet-400/15 to-fuchsia-400/15 blur-2xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-5 mb-10"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <motion.div
                      className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 border border-purple-400/40 shadow-lg shadow-purple-500/20"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <BarChart3 className="h-10 w-10 text-purple-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-lg">
                        Productivity Nexus
                      </h3>
                      <p className="text-gray-300 text-base font-medium">Task optimization matrix • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 border border-purple-400/40 backdrop-blur-lg shadow-2xl shadow-purple-500/20 mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <motion.div 
                      className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-400/40 to-fuchsia-400/40 blur-sm"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                    />
                    <motion.div 
                      className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-400/30 to-fuchsia-400/30 blur-lg"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.7 }}
                    />
                    <motion.div 
                      className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 blur-xl"
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2.2 }}
                    />
                    <motion.div 
                      className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 blur-2xl"
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 2.7 }}
                    />
                    <div className="relative z-10">
                      <div className="text-5xl font-black text-purple-300 mb-3 drop-shadow-lg">
                        {analyticsData.tasks.completionRate.toFixed(0)}%
                      </div>
                      <div className="text-lg font-bold text-gray-300 mb-4">Completion Matrix</div>
                      <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-4 rounded-full shadow-lg shadow-purple-500/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${analyticsData.tasks.completionRate}%` }}
                          transition={{ delay: 1.3, duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="border-t border-purple-400/30 pt-8">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-purple-300 text-xl">
                      <Award className="h-6 w-6" />
                      Priority Distribution Matrix
                    </h4>
                    <div className="space-y-4">
                      {analyticsData.tasks.priorityDistribution.map((priority, index) => (
                        <motion.div 
                          key={priority.priority} 
                          className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/40 border border-purple-400/30 backdrop-blur-lg shadow-xl shadow-purple-500/10"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.05, x: 10 }}
                        >
                          <span className="capitalize font-bold text-gray-200 text-lg flex items-center gap-3">
                            {priority.priority === 'high' ? '🔴' : priority.priority === 'medium' ? '🟡' : '🟢'}
                            {priority.priority}
                          </span>
                          <span className="font-black text-purple-300 text-xl">{priority.count} tasks</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calendar Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="relative">
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-indigo-800/25 backdrop-blur-xl border border-cyan-400/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(34,211,238,0.3)_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>
                
                <motion.div 
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-indigo-400/30 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 blur-xl"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-400/15 via-blue-400/15 to-indigo-400/15 blur-2xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center gap-5 mb-10"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                  >
                    <motion.div
                      className="p-5 rounded-3xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Calendar className="h-10 w-10 text-cyan-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                        Schedule Nexus
                      </h3>
                      <p className="text-gray-300 text-base font-medium">Event coordination matrix • {timeRange}</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <motion.div 
                      className="text-center p-8 rounded-3xl bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border border-cyan-400/40 backdrop-blur-lg shadow-2xl shadow-cyan-500/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400/40 to-blue-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.3 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.3 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.8 }}
                      />
                      <div className="relative z-10">
                        <div className="text-4xl font-black text-cyan-300 mb-3 drop-shadow-lg">
                          {analyticsData.events.totalEvents}
                        </div>
                        <div className="text-lg font-bold text-gray-300">Total Events</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-blue-900/30 border border-indigo-400/40 backdrop-blur-lg shadow-2xl shadow-indigo-500/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-400/40 to-blue-400/40 blur-sm"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                      />
                      <motion.div 
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-400/30 to-blue-400/30 blur-lg"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                      />
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-indigo-400/20 to-blue-400/20 blur-xl"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
                      />
                      <motion.div 
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-400/10 to-blue-400/10 blur-2xl"
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 3 }}
                      />
                      <div className="relative z-10">
                        <div className="text-4xl font-black text-indigo-300 mb-3 drop-shadow-lg">
                          {analyticsData.events.upcomingEvents}
                        </div>
                        <div className="text-lg font-bold text-gray-300">Upcoming</div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-cyan-400/30 pt-8">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-cyan-300 text-xl">
                      <Clock className="h-6 w-6" />
                      Event Types Matrix
                    </h4>
                    <div className="space-y-4">
                      {analyticsData.events.eventTypes.map((eventType, index) => (
                        <motion.div 
                          key={eventType.type} 
                          className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/40 border border-cyan-400/30 backdrop-blur-lg shadow-xl shadow-cyan-500/10"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.05, x: 10 }}
                        >
                          <span className="capitalize font-bold text-gray-200 text-lg">{eventType.type}</span>
                          <span className="font-black text-cyan-300 text-xl">{eventType.count} events</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals and Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="relative"
        >
          <motion.div 
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-2xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <div className="relative z-10 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/60 border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Target className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">
                    Goals & Nexus
                  </h3>
                  <p className="text-gray-400 text-lg font-medium">AI-powered optimization matrix</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/40 to-green-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.1 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-400/30 to-green-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.6 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2.1 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2.6 }}
                />
                <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/60 border border-emerald-400/30 backdrop-blur-lg shadow-xl shadow-emerald-500/10">
                  <h4 className="font-black text-emerald-300 mb-4 flex items-center gap-3 text-xl">
                    💪 Fitness Core
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    You're {fitnessGoalProgress.toFixed(0)}% towards your monthly workout goal. 
                    {fitnessGoalProgress < 75 ? 'Keep pushing! You\'re doing great!' : 'Excellent progress! You\'re crushing it!'}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400/40 to-blue-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.3 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2.3 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2.8 }}
                />
                <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/60 border border-cyan-400/30 backdrop-blur-lg shadow-xl shadow-cyan-500/10">
                  <h4 className="font-black text-cyan-300 mb-4 flex items-center gap-3 text-xl">
                    💰 Financial Matrix
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {netIncome >= 0 
                      ? 'Your finances are looking great! Consider investing the surplus for long-term growth.' 
                      : 'Review your expenses and identify areas to optimize your financial position.'}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/40 to-pink-400/40 blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                />
                <motion.div 
                  className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
                <motion.div 
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-2xl"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 3 }}
                />
                <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/60 border border-purple-400/30 backdrop-blur-lg shadow-xl shadow-purple-500/10">
                  <h4 className="font-black text-purple-300 mb-4 flex items-center gap-3 text-xl">
                    ✅ Productivity Nexus
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {analyticsData.tasks.completionRate >= 80 
                      ? 'Outstanding task completion rate! Your productivity system is working excellently.' 
                      : 'Try breaking down large tasks into smaller, manageable chunks for better completion rates.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}