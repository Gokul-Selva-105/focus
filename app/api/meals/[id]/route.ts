import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

// Import the meals array from the main route
// In a real app, this would be handled by the database
let meals: any[] = []

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

    // Find the meal index
    const mealIndex = meals.findIndex(
      meal => meal._id === id && meal.userEmail === session.user.email
    )

    if (mealIndex === -1) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      )
    }

    // Remove the meal
    meals.splice(mealIndex, 1)
    
    return NextResponse.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Meal DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}