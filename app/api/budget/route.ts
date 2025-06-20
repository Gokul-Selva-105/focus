import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectToDatabase } from '@/lib/mongodb'
import Budget from '@/models/Budget'
import Transaction from '@/models/Transaction'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    await connectToDatabase()

    const query: any = { userEmail: session.user.email }
    if (month !== null && year !== null) {
      query.month = parseInt(month)
      query.year = parseInt(year)
    }

    const budgets = await Budget.find(query).sort({ year: -1, month: -1 })

    // Calculate actual spending from transactions for each budget
    for (const budget of budgets) {
      const startDate = new Date(budget.year, budget.month, 1)
      const endDate = new Date(budget.year, budget.month + 1, 0)

      const transactions = await Transaction.find({
        userEmail: session.user.email,
        date: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      })

      // Update actual amounts
      budget.actualIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      budget.actualExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      // Update spent amounts for each budget item
      for (const item of budget.items) {
        const categoryTransactions = transactions.filter(t => 
          t.type === item.type && t.category === item.category
        )
        item.spentAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
      }

      await budget.save()
    }

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category, budgetAmount, type, month, year } = await request.json()

    if (!category || !budgetAmount || !type || !month || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectToDatabase()

    const monthIndex = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(month)

    // Find or create budget for the month/year
    let budget = await Budget.findOne({
      userEmail: session.user.email,
      month: monthIndex,
      year: year
    })

    if (!budget) {
      budget = new Budget({
        userEmail: session.user.email,
        month: monthIndex,
        year: year,
        totalIncomeBudget: 0,
        totalExpenseBudget: 0,
        actualIncome: 0,
        actualExpenses: 0,
        items: []
      })
    }

    // Check if category already exists
    const existingItem = budget.items.find(item => 
      item.category === category && item.type === type
    )

    if (existingItem) {
      return NextResponse.json({ error: 'Budget item for this category already exists' }, { status: 400 })
    }

    // Add new budget item
    budget.items.push({
      category,
      budgetAmount,
      spentAmount: 0,
      type
    })

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
    console.error('Error creating budget item:', error)
    return NextResponse.json({ error: 'Failed to create budget item' }, { status: 500 })
  }
}