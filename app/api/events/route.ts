import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getEventsByUser, addEvent, generateEventId, Event } from '@/lib/events-data'

// Mock database - in a real app, you'd use a proper database
const sampleEvents: Event[] = [
  {
    _id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: 'Conference Room A',
    type: 'meeting',
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  },
  {
    _id: '2',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:30',
    location: 'Medical Center',
    type: 'appointment',
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  },
  {
    _id: '3',
    title: 'Gym Session',
    description: 'Personal training session',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    time: '18:00',
    location: 'Fitness Center',
    type: 'personal',
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get events for the user
    const userEvents = getEventsByUser(session.user.email)
    
    return NextResponse.json(userEvents)
  } catch (error) {
    console.error('Events GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, time, location, type } = body

    if (!title || !date || !time) {
      return NextResponse.json(
        { error: 'Title, date, and time are required' },
        { status: 400 }
      )
    }

    const validTypes = ['meeting', 'appointment', 'reminder', 'personal', 'work']
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const newEvent: Event = {
      _id: generateEventId(),
      title,
      description: description || '',
      date,
      time,
      location: location || '',
      type: type || 'personal',
      createdAt: new Date().toISOString(),
      userEmail: session.user.email
    }

    addEvent(newEvent)
    
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Events POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}