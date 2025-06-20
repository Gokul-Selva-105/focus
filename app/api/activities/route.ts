import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Mock database - in a real app, you'd use a proper database
let activities: any[] = [
  {
    _id: '1',
    name: 'Morning Run',
    type: 'cardio',
    duration: 30,
    caloriesBurned: 300,
    notes: 'Great morning run in the park',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  },
  {
    _id: '2',
    name: 'Weight Training',
    type: 'strength',
    duration: 45,
    caloriesBurned: 250,
    notes: 'Upper body workout',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userEmail: 'user@example.com'
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter activities by user email
    const userActivities = activities.filter(activity => activity.userEmail === session.user.email)
    
    // Sort by date (newest first)
    userActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return NextResponse.json(userActivities)
  } catch (error) {
    console.error('Activities GET error:', error)
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
    const { name, type, duration, caloriesBurned, notes } = body

    if (!name || !type || !duration) {
      return NextResponse.json(
        { error: 'Name, type, and duration are required' },
        { status: 400 }
      )
    }

    const validTypes = ['cardio', 'strength', 'flexibility', 'sports', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid activity type' },
        { status: 400 }
      )
    }

    const newActivity = {
      _id: Date.now().toString(),
      name,
      type,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned) || 0,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      userEmail: session.user.email
    }

    activities.push(newActivity)
    
    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error('Activities POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}