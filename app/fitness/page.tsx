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
          duration: parseInt(newActivity.duration),
          caloriesBurned: parseInt(newActivity.caloriesBurned) || 0
        })
      })

      if (response.ok) {
        const activity = await response.json()
        setActivities([activity, ...activities])
        setNewActivity({ name: '', type: 'cardio', duration: '', caloriesBurned: '', notes: '' })
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Please sign in to track your fitness activities.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Fitness</h1>
        <p className="text-muted-foreground">Track your physical activities and workouts</p>
      </motion.div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutCount}</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories}</div>
            <p className="text-xs text-muted-foreground">burned this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Activity Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createActivity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Activity Name</Label>
                <Input
                  id="name"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  placeholder="e.g., Morning Run, Gym Workout"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Activity Type</Label>
                <select
                  id="type"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength Training</option>
                  <option value="flexibility">Flexibility/Yoga</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  placeholder="30"
                  required
                />
              </div>
              <div>
                <Label htmlFor="caloriesBurned">Calories Burned</Label>
                <Input
                  id="caloriesBurned"
                  type="number"
                  value={newActivity.caloriesBurned}
                  onChange={(e) => setNewActivity({ ...newActivity, caloriesBurned: e.target.value })}
                  placeholder="200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={newActivity.notes}
                onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                placeholder="How did it feel? Any observations?"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging...' : 'Log Activity'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest fitness activities</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities logged yet. Start tracking your workouts above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'cardio' ? 'bg-red-100' :
                      activity.type === 'strength' ? 'bg-blue-100' :
                      activity.type === 'flexibility' ? 'bg-green-100' :
                      activity.type === 'sports' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <Activity className={`h-4 w-4 ${
                        activity.type === 'cardio' ? 'text-red-600' :
                        activity.type === 'strength' ? 'text-blue-600' :
                        activity.type === 'flexibility' ? 'text-green-600' :
                        activity.type === 'sports' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{activity.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {activity.type.replace('_', ' ')} • {activity.duration} min
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                        <p className="text-xs text-muted-foreground mt-1 italic">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteActivity(activity._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}