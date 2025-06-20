'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, PiggyBank, Target, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BudgetItem {
  _id: string
  category: string
  budgetAmount: number
  spentAmount: number
  type: 'income' | 'expense'
  month: string
  year: number
}

interface MonthlyBudget {
  _id: string
  month: string
  year: number
  totalIncomeBudget: number
  totalExpenseBudget: number
  actualIncome: number
  actualExpenses: number
  items: BudgetItem[]
}

const EXPENSE_CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare',
  'Entertainment', 'Shopping', 'Education', 'Insurance', 'Savings', 'Other'
]

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investments', 'Rental', 'Other'
]

export default function BudgetPage() {
  const { data: session } = useSession()
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: '',
    budgetAmount: '',
    type: 'expense' as const
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    if (session?.user) {
      fetchBudgets()
    }
  }, [session, selectedMonth, selectedYear])

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budget?month=${selectedMonth}&year=${selectedYear}`)
      if (response.ok) {
        const data = await response.json()
        setBudgets(Array.isArray(data) ? data : [data].filter(Boolean))
      } else {
        setBudgets([])
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
      setBudgets([])
    }
  }

  const createBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBudgetItem.category || !newBudgetItem.budgetAmount) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBudgetItem,
          budgetAmount: parseFloat(newBudgetItem.budgetAmount),
          month: months[selectedMonth],
          year: selectedYear
        })
      })

      if (response.ok) {
        await fetchBudgets()
        setNewBudgetItem({ category: '', budgetAmount: '', type: 'expense' })
        toast({ title: 'Budget item added successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to add budget item', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBudgetItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/budget/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchBudgets()
        toast({ title: 'Budget item deleted successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete budget item', variant: 'destructive' })
    }
  }

  const currentBudget = budgets.find(b => 
    b.month === months[selectedMonth] && b.year === selectedYear
  )

  const totalIncomeBudget = currentBudget?.items
    ?.filter(item => item.type === 'income')
    ?.reduce((sum, item) => sum + item.budgetAmount, 0) || 0

  const totalExpenseBudget = currentBudget?.items
    ?.filter(item => item.type === 'expense')
    ?.reduce((sum, item) => sum + item.budgetAmount, 0) || 0

  const totalActualIncome = currentBudget?.actualIncome || 0
  const totalActualExpenses = currentBudget?.actualExpenses || 0

  const budgetBalance = totalIncomeBudget - totalExpenseBudget
  const actualBalance = totalActualIncome - totalActualExpenses

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900 dark:to-teal-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center max-w-md mx-4"
          >
            <PiggyBank className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 gradient-text">Monthly Budget</h2>
            <p className="text-muted-foreground">Please sign in to view and manage your monthly budget planning.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900 dark:to-teal-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Monthly Budget Planner</h1>
          <p className="text-xl text-muted-foreground">Plan and track your monthly income and expenses</p>
        </motion.div>

        {/* Month/Year Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 justify-center items-center"
        >
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planned Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalIncomeBudget.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Monthly budget</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planned Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalExpenseBudget.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Monthly budget</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Balance</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  budgetBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${budgetBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Planned surplus/deficit</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actual Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  actualBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${actualBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Add New Budget Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Budget Item
              </CardTitle>
              <CardDescription>
                Set budget amounts for different income and expense categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createBudgetItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newBudgetItem.type} 
                      onValueChange={(value: 'income' | 'expense') => 
                        setNewBudgetItem({ ...newBudgetItem, type: value, category: '' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newBudgetItem.category} 
                      onValueChange={(value) => setNewBudgetItem({ ...newBudgetItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newBudgetItem.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Budget Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newBudgetItem.budgetAmount}
                      onChange={(e) => setNewBudgetItem({ ...newBudgetItem, budgetAmount: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Adding...' : 'Add Item'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Items List */}
        {currentBudget?.items && currentBudget.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Budget Items for {months[selectedMonth]} {selectedYear}</CardTitle>
                <CardDescription>
                  Track your planned vs actual spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBudget.items.map((item, index) => {
                    const progressPercentage = item.budgetAmount > 0 
                      ? Math.min((item.spentAmount / item.budgetAmount) * 100, 100) 
                      : 0
                    const isOverBudget = item.spentAmount > item.budgetAmount
                    
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              item.type === 'income' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                            }`}>
                              {item.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.category}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">${item.spentAmount.toFixed(2)} / ${item.budgetAmount.toFixed(2)}</p>
                              <p className={`text-sm ${
                                isOverBudget ? 'text-red-500' : 'text-muted-foreground'
                              }`}>
                                {isOverBudget ? 'Over budget' : 'Within budget'}
                              </p>
                            </div>
                            {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBudgetItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {item.type === 'expense' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={progressPercentage} 
                              className={`h-2 ${
                                isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'
                              }`}
                            />
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {(!currentBudget?.items || currentBudget.items.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center py-12"
          >
            <PiggyBank className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Budget Items Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start planning your monthly budget by adding income and expense categories above.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}