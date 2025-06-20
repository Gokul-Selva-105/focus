import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { deleteMeal } from '@/lib/meals-data'

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

    // Delete the meal using shared data store
    const deleted = deleteMeal(id, session.user.email)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Meal DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}