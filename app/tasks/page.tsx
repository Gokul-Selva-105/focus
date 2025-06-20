'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, CheckSquare, Clock, Trash2, Target, Calendar, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Task {
  _id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchTasks()
    }
  }, [session])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      } else {
        console.error('Failed to fetch tasks:', response.statusText)
        setTasks([])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setTasks([])
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([...tasks, task])
        setNewTask({ title: '', description: '', priority: 'medium' })
        toast({ title: 'Task created successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to create task', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, completed } : task
        ))
      }
    } catch (error) {
      toast({ title: 'Failed to update task', variant: 'destructive' })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId))
        toast({ title: 'Task deleted successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete task', variant: 'destructive' })
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
            <Target className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 gradient-text">Task Management</h2>
            <p className="text-muted-foreground">Please sign in to view and manage your tasks.</p>
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
      
      <div className="relative z-10 p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Task Management</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Organize your workflow, track progress, and achieve your goals with our intuitive task management system</p>
        </motion.div>

        {/* Create Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Plus className="h-5 w-5" />
                </div>
                Create New Task
              </CardTitle>
              <CardDescription>Add a new task to your workflow and stay organized</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createTask} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Priority
                    </Label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full p-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    className="glass-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-premium w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold gradient-text">Your Tasks</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                {tasks.filter(t => t.completed).length} completed
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {tasks.filter(t => !t.completed).length} pending
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit mx-auto mb-4">
                      <CheckSquare className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground">Create your first task above to get started!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className={`glass-card hover-lift transition-all duration-300 cursor-pointer ${
                    task.completed ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.02]'
                  }`}
                    onClick={() => toggleTask(task._id, !task.completed)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="mt-1">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={(checked) => {
                                // Prevent event bubbling
                                event?.stopPropagation()
                                toggleTask(task._id, checked as boolean)
                              }}
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-lg mb-2 transition-all duration-300 ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`mb-3 leading-relaxed transition-all duration-300 ${
                                task.completed ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                                task.completed ? 'opacity-60' : ''
                              } ${
                                task.priority === 'high' 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                task.priority === 'medium' 
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {task.priority === 'high' ? '🔴 High' : 
                                 task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                              </span>
                              <span className={`text-xs flex items-center gap-1 transition-all duration-300 ${
                                task.completed ? 'text-muted-foreground/50' : 'text-muted-foreground'
                              }`}>
                                <Calendar className="h-3 w-3" />
                                {new Date(task.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              {task.completed && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full font-medium flex items-center gap-1">
                                  <CheckSquare className="h-3 w-3" />
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task._id)
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}