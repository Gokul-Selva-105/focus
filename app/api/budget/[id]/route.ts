import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Budget from '@/models/Budget'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { budgetAmount } = await request.json()
    
    if (!budgetAmount || budgetAmount <= 0) {
      return NextResponse.json({ error: 'Valid budget amount is required' }, { status: 400 })
    }

    await connectToDatabase()
    
    const budget = await Budget.findOne({
      'items._id': params.id,
      userEmail: session.user.email
    })

    if (!budget) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }

    // Update the specific budget item
    const itemIndex = budget.items.findIndex((item: any) => item._id.toString() === params.id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }

    budget.items[itemIndex].budgetAmount = budgetAmount
    
    // Update totals
    budget.totalIncomeBudget = budget.items
      .filter((item: any) => item.type === 'income')
      .reduce((sum: number, item: any) => sum + item.budgetAmount, 0)
    
    budget.totalExpenseBudget = budget.items
      .filter((item: any) => item.type === 'expense')
      .reduce((sum: number, item: any) => sum + item.budgetAmount, 0)

    await budget.save()

    return NextResponse.json({ message: 'Budget item updated successfully' })
  } catch (error) {
    console.error('Error updating budget item:', error)
    return NextResponse.json({ error: 'Failed to update budget item' }, { status: 500 })
  }
}

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

    await connectToDatabase()

    // Find the budget that contains the item
    const budget = await Budget.findOne({
      userEmail: session.user.email,
      'items._id': id
    })

    if (!budget) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }

    // Remove the item from the budget
    budget.items = budget.items.filter(item => item._id.toString() !== id)

    // Update totals
    budget.totalIncomeBudget = budget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.budgetAmount, 0)
    
    budget.totalExpenseBudget = budget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.budgetAmount, 0)

    await budget.save()

    return NextResponse.json({ message: 'Budget item deleted successfully' })
  } catch (error) {
    console.error('Error deleting budget item:', error)
    return NextResponse.json({ error: 'Failed to delete budget item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { budgetAmount } = await request.json()

    if (!budgetAmount) {
      return NextResponse.json({ error: 'Budget amount is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Find and update the budget item
    const budget = await Budget.findOne({
      userEmail: session.user.email,
      'items._id': id
    })

    if (!budget) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }

    // Update the specific item
    const itemIndex = budget.items.findIndex(item => item._id.toString() === id)
    if (itemIndex !== -1) {
      budget.items[itemIndex].budgetAmount = budgetAmount
    }

    // Update totals
    budget.totalIncomeBudget = budget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.budgetAmount, 0)
    
    budget.totalExpenseBudget = budget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.budgetAmount, 0)

    await budget.save()

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget item:', error)
    return NextResponse.json({ error: 'Failed to update budget item' }, { status: 500 })
  }
}