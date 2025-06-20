'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Trash2, Edit, Filter, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CalendarEvent {
  _id: string
  title: string
  description?: string
  date: string
  time: string
  location?: string
  type: 'meeting' | 'appointment' | 'reminder' | 'personal' | 'work'
  createdAt: string
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'personal' as const
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchEvents()
    }
  }, [session])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterType])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(Array.isArray(data) ? data : data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast({ title: 'Failed to fetch events', variant: 'destructive' })
    }
  }

  const filterEvents = () => {
    let filtered = events
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time)
      const dateB = new Date(b.date + 'T' + b.time)
      return dateA.getTime() - dateB.getTime()
    })
    
    setFilteredEvents(filtered)
  }

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        const event = await response.json()
        setEvents([...events, event])
        setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'personal' })
        setShowEventForm(false)
        toast({ title: 'Event created successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to create event', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const updateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent || !newEvent.title || !newEvent.date || !newEvent.time) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setEvents(events.map(e => e._id === editingEvent._id ? updatedEvent : e))
        setEditingEvent(null)
        setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'personal' })
        setShowEventForm(false)
        toast({ title: 'Event updated successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to update event', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEvents(events.filter(e => e._id !== eventId))
        toast({ title: 'Event deleted successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete event', variant: 'destructive' })
    }
  }

  const startEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      location: event.location || '',
      type: event.type
    })
    setShowEventForm(true)
  }

  const cancelEdit = () => {
    setEditingEvent(null)
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'personal' })
    setShowEventForm(false)
  }

  const getTypeColor = (type: string) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-800',
      appointment: 'bg-green-100 text-green-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      personal: 'bg-purple-100 text-purple-800',
      work: 'bg-red-100 text-red-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
  }

  const isEventPast = (event: CalendarEvent) => {
    const eventDateTime = new Date(event.date + 'T' + event.time)
    return eventDateTime < new Date()
  }

  const upcomingEvents = filteredEvents.filter(event => !isEventPast(event)).slice(0, 3)
  const pastEvents = filteredEvents.filter(event => isEventPast(event))

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your calendar.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar & Events</h1>
          <p className="text-gray-600">Manage your schedule and upcoming events</p>
        </div>
        
        <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editingEvent ? updateEvent : createEvent} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter location (optional)"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description (optional)"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="appointment">Appointments</SelectItem>
            <SelectItem value="reminder">Reminders</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(event.time)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(event)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteEvent(event._id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No events found. Create your first event!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      isEventPast(event) ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${
                            isEventPast(event) ? 'text-gray-600' : 'text-gray-900'
                          }`}>{event.title}</h3>
                          <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                          {isEventPast(event) && (
                            <Badge variant="secondary">Past</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(event.time)}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => startEdit(event)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteEvent(event._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}