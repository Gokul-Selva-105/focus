'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckSquare, DollarSign, UtensilsCrossed, Activity, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  currentBalance: number
  todayMeals: number
  weeklyActivities: number
  upcomingEvents: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    currentBalance: 0,
    todayMeals: 0,
    weeklyActivities: 0,
    upcomingEvents: 0
  })

  useEffect(() => {
    if (session?.user) {
      fetchDashboardStats()
    }
  }, [session])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to Self Development App</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track your tasks, manage finances, monitor health, and achieve your goals
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: 'Tasks',
      description: 'Manage your daily tasks',
      icon: CheckSquare,
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      subtext: 'completed today',
      href: '/tasks',
      color: 'text-blue-600'
    },
    {
      title: 'Finance',
      description: 'Track income and expenses',
      icon: DollarSign,
      value: `$${stats.currentBalance.toFixed(2)}`,
      subtext: 'current balance',
      href: '/finance',
      color: 'text-green-600'
    },
    {
      title: 'Meals',
      description: 'Log your daily nutrition',
      icon: UtensilsCrossed,
      value: stats.todayMeals.toString(),
      subtext: 'meals logged today',
      href: '/meals',
      color: 'text-orange-600'
    },
    {
      title: 'Fitness',
      description: 'Track physical activities',
      icon: Activity,
      value: stats.weeklyActivities.toString(),
      subtext: 'activities this week',
      href: '/fitness',
      color: 'text-red-600'
    },
    {
      title: 'Calendar',
      description: 'Manage events and reminders',
      icon: Calendar,
      value: stats.upcomingEvents.toString(),
      subtext: 'upcoming events',
      href: '/calendar',
      color: 'text-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View your progress',
      icon: TrendingUp,
      value: 'View',
      subtext: 'detailed insights',
      href: '/analytics',
      color: 'text-indigo-600'
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Welcome back, {session.user?.name || 'User'}!</h1>
        <p className="text-muted-foreground">Here's your personal development overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={card.href}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.subtext}</p>
                    <CardDescription className="mt-2">{card.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}