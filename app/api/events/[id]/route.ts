import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

// Import the shared events array from the main route
import { events } from '../route'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Find the event index
    const eventIndex = events.findIndex(
      event => event._id === id && event.userEmail === session.user.email
    )

    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Remove the event
    events.splice(eventIndex, 1)
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Event DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, date, time, location, type } = body

    if (!title || !date || !time) {
      return NextResponse.json(
        { error: 'Title, date, and time are required' },
        { status: 400 }
      )
    }

    // Find the event index
    const eventIndex = events.findIndex(
      event => event._id === id && event.userEmail === session.user.email
    )

    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Update the event
    const updatedEvent = {
      ...events[eventIndex],
      title,
      description: description || '',
      date,
      time,
      location: location || '',
      type: type || 'personal'
    }

    events[eventIndex] = updatedEvent
    
    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Event PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}