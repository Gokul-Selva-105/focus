'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Activity, Clock, Flame, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FitnessActivity {
  _id: string
  name: string
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other'
  duration: number // in minutes
  caloriesBurned: number
  notes?: string
  date: string
  createdAt: string
}

export default function FitnessPage() {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<FitnessActivity[]>([])
  const [newActivity, setNewActivity] = useState({
    name: '',
    type: 'cardio' as const,
    customType: '',
    duration: '',
    caloriesBurned: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchActivities()
    }
  }, [session])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const createActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newActivity.name || !newActivity.duration) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newActivity,
          type: newActivity.type === 'other' ? newActivity.customType : newActivity.type,
          duration: parseInt(newActivity.duration),
          caloriesBurned: parseInt(newActivity.caloriesBurned) || 0
        })
      })

      if (response.ok) {
        const activity = await response.json()
        setActivities([activity, ...activities])
        setNewActivity({ name: '', type: 'cardio', customType: '', duration: '', caloriesBurned: '', notes: '' })
        toast({ title: 'Activity logged successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to log activity', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteActivity = async (activityId: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setActivities(activities.filter(a => a._id !== activityId))
        toast({ title: 'Activity deleted successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete activity', variant: 'destructive' })
    }
  }

  const thisWeekActivities = activities.filter(activity => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const activityDate = new Date(activity.date)
    return activityDate >= weekStart
  })

  const totalDuration = thisWeekActivities.reduce((sum, activity) => sum + activity.duration, 0)
  const totalCalories = thisWeekActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0)
  const workoutCount = thisWeekActivities.length

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
            <Activity className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 gradient-text">Fitness Tracker</h2>
            <p className="text-muted-foreground">Please sign in to track your fitness activities and workouts.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Fitness Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Track your physical activities and achieve your fitness goals</p>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Workouts</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{workoutCount}</div>
              <p className="text-xs text-muted-foreground mt-1">this week</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
              <p className="text-xs text-muted-foreground mt-1">this week</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <Flame className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalCalories}</div>
              <p className="text-xs text-muted-foreground mt-1">burned this week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Activity Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Plus className="h-5 w-5" />
                </div>
                Log Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createActivity} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Activity Name</Label>
                    <Input
                      id="name"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                      placeholder="e.g., Morning Run, Gym Workout"
                      className="glass-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">Activity Type</Label>
                    <select
                      id="type"
                      value={newActivity.type}
                      onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other' })}
                      className="w-full p-3 glass-input rounded-xl"
                    >
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength Training</option>
                      <option value="flexibility">Flexibility/Yoga</option>
                      <option value="sports">Sports</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {newActivity.type === 'other' && (
                    <div className="md:col-span-2">
                      <Label htmlFor="customType" className="text-sm font-medium">Specify Activity Type</Label>
                      <Input
                        id="customType"
                        value={newActivity.customType}
                        onChange={(e) => setNewActivity({ ...newActivity, customType: e.target.value })}
                        placeholder="e.g., Dancing, Rock Climbing"
                        className="glass-input"
                        required={newActivity.type === 'other'}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                      placeholder="30"
                      className="glass-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="caloriesBurned" className="text-sm font-medium">Calories Burned</Label>
                    <Input
                      id="caloriesBurned"
                      type="number"
                      value={newActivity.caloriesBurned}
                      onChange={(e) => setNewActivity({ ...newActivity, caloriesBurned: e.target.value })}
                      placeholder="200"
                      className="glass-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    placeholder="How did it feel? Any observations?"
                    className="glass-input"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="btn-premium w-full">
                  {isLoading ? 'Logging...' : 'Log Activity'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                Recent Activities
              </CardTitle>
              <CardDescription className="text-muted-foreground">Your latest fitness activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No activities logged yet</h3>
                  <p className="text-muted-foreground">Start tracking your workouts above to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 10).map((activity, index) => (
                    <motion.div
                      key={activity._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover-lift"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          activity.type === 'cardio' ? 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30' :
                          activity.type === 'strength' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30' :
                          activity.type === 'flexibility' ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' :
                          activity.type === 'sports' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30' :
                          'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30'
                        }`}>
                          <Activity className={`h-5 w-5 ${
                            activity.type === 'cardio' ? 'text-red-600' :
                            activity.type === 'strength' ? 'text-blue-600' :
                            activity.type === 'flexibility' ? 'text-green-600' :
                            activity.type === 'sports' ? 'text-yellow-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {activity.type.replace('_', ' ')} • {activity.duration} min
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {activity.caloriesBurned} cal
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                          {activity.notes && (
                            <p className="text-xs text-muted-foreground mt-2 italic bg-white/30 dark:bg-white/10 rounded-lg p-2">
                              "{activity.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteActivity(activity._id)}
                        className="glass-card border-red-200/50 hover:border-red-300/50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}