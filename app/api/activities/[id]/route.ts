import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

// Import the activities array from the main route
// In a real app, this would be handled by the database
let activities: any[] = []

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

    // Find the activity index
    const activityIndex = activities.findIndex(
      activity => activity._id === id && activity.userEmail === session.user.email
    )

    if (activityIndex === -1) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    // Remove the activity
    activities.splice(activityIndex, 1)
    
    return NextResponse.json({ message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Activity DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}