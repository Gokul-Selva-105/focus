import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

// Import the transactions array from the main route
// In a real app, this would be handled by the database
let transactions: any[] = []

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

    // Find the transaction index
    const transactionIndex = transactions.findIndex(
      transaction => transaction._id === id && transaction.userEmail === session.user.email
    )

    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Remove the transaction
    transactions.splice(transactionIndex, 1)
    
    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Transaction DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}