import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Mock database - in a real app, you'd use a proper database
let events: any[] = [
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

    // Filter events by user email
    const userEvents = events.filter(event => event.userEmail === session.user.email)
    
    // Sort by date and time
    userEvents.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time)
      const dateB = new Date(b.date + 'T' + b.time)
      return dateA.getTime() - dateB.getTime()
    })
    
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

    const newEvent = {
      _id: Date.now().toString(),
      title,
      description: description || '',
      date,
      time,
      location: location || '',
      type: type || 'personal',
      createdAt: new Date().toISOString(),
      userEmail: session.user.email
    }

    events.push(newEvent)
    
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Events POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}