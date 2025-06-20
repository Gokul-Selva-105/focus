'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, PiggyBank, Target, AlertTriangle, Edit3, Copy, BarChart3, Calendar, RefreshCw } from 'lucide-react'
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
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'category' | 'amount' | 'spent' | 'remaining'>('category')
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

  const fetchBudgets = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
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
      toast({ title: 'Failed to fetch budget data', variant: 'destructive' })
    } finally {
      if (showRefresh) setIsRefreshing(false)
    }
  }, [selectedMonth, selectedYear, toast])

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

  const editBudgetItem = async (itemId: string, newAmount: number) => {
    try {
      const response = await fetch(`/api/budget/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetAmount: newAmount })
      })

      if (response.ok) {
        await fetchBudgets()
        setShowEditDialog(false)
        setEditingItem(null)
        toast({ title: 'Budget item updated successfully!' })
      }
    } catch (error) {
      toast({ title: 'Failed to update budget item', variant: 'destructive' })
    }
  }

  const copyBudgetToNextMonth = async () => {
    if (!currentBudget?.items || currentBudget.items.length === 0) {
      toast({ title: 'No budget items to copy', variant: 'destructive' })
      return
    }

    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear

    try {
      for (const item of currentBudget.items) {
        await fetch('/api/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: item.category,
            budgetAmount: item.budgetAmount,
            type: item.type,
            month: months[nextMonth],
            year: nextYear
          })
        })
      }
      toast({ title: `Budget copied to ${months[nextMonth]} ${nextYear}!` })
    } catch (error) {
      toast({ title: 'Failed to copy budget', variant: 'destructive' })
    }
  }

  const handleEditClick = (item: BudgetItem) => {
    setEditingItem(item)
    setEditAmount(item.budgetAmount.toString())
    setShowEditDialog(true)
  }

  const handleEditSubmit = () => {
    if (editingItem && editAmount) {
      editBudgetItem(editingItem._id, parseFloat(editAmount))
    }
  }

  const currentBudget = budgets.find(b => 
    b.month === months[selectedMonth] && b.year === selectedYear
  )

  const filteredAndSortedItems = useMemo(() => {
    if (!currentBudget?.items) return []
    
    let filtered = currentBudget.items
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType)
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.budgetAmount - a.budgetAmount
        case 'spent':
          return b.spentAmount - a.spentAmount
        case 'remaining':
          return (b.budgetAmount - b.spentAmount) - (a.budgetAmount - a.spentAmount)
        default:
          return a.category.localeCompare(b.category)
      }
    })
  }, [currentBudget?.items, filterType, sortBy])

  const budgetSummary = useMemo(() => {
    const items = currentBudget?.items || []
    
    const totalIncomeBudget = items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.budgetAmount, 0)

    const totalExpenseBudget = items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.budgetAmount, 0)

    const totalActualIncome = currentBudget?.actualIncome || 0
    const totalActualExpenses = currentBudget?.actualExpenses || 0

    const budgetBalance = totalIncomeBudget - totalExpenseBudget
    const actualBalance = totalActualIncome - totalActualExpenses
    const savingsRate = totalActualIncome > 0 ? ((totalActualIncome - totalActualExpenses) / totalActualIncome) * 100 : 0
    
    return {
      totalIncomeBudget,
      totalExpenseBudget,
      totalActualIncome,
      totalActualExpenses,
      budgetBalance,
      actualBalance,
      savingsRate,
      overBudgetItems: items.filter(item => item.spentAmount > item.budgetAmount).length
    }
  }, [currentBudget?.items, currentBudget?.actualIncome, currentBudget?.actualExpenses])

  const totalIncomeBudget = budgetSummary.totalIncomeBudget
  const totalExpenseBudget = budgetSummary.totalExpenseBudget
  const totalActualIncome = budgetSummary.totalActualIncome
  const totalActualExpenses = budgetSummary.totalActualExpenses
  const budgetBalance = budgetSummary.budgetBalance
  const actualBalance = budgetSummary.actualBalance

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

        {/* Header with Month/Year Selector and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <PiggyBank className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Monthly Budget Planner
              </h1>
            </div>
            <p className="text-gray-600">Track your income and expenses for {months[selectedMonth]} {selectedYear}</p>
            {budgetSummary.overBudgetItems > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600">
                  {budgetSummary.overBudgetItems} categories over budget
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value)))}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value)))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => fetchBudgets(true)} 
              variant="outline" 
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {currentBudget?.items && currentBudget.items.length > 0 && (
              <Button onClick={copyBudgetToNextMonth} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Next Month
              </Button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-700">${totalActualIncome.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-green-600">Budget: ${totalIncomeBudget.toFixed(2)}</p>
                      {totalActualIncome > totalIncomeBudget && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          +{((totalActualIncome - totalIncomeBudget) / totalIncomeBudget * 100).toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700">${totalActualExpenses.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-red-600">Budget: ${totalExpenseBudget.toFixed(2)}</p>
                      {totalActualExpenses > totalExpenseBudget && (
                        <Badge variant="destructive" className="text-xs">
                          Over by ${(totalActualExpenses - totalExpenseBudget).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">Net Balance</p>
                    <p className={`text-2xl font-bold ${actualBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      ${actualBalance.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-blue-600">Budget: ${budgetBalance.toFixed(2)}</p>
                      <Badge 
                        variant={actualBalance >= budgetBalance ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {actualBalance >= budgetBalance ? "On Track" : "Behind"}
                      </Badge>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-600">Savings Rate</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {budgetSummary.savingsRate.toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-purple-600">{currentBudget?.items?.length || 0} Categories</p>
                      {budgetSummary.savingsRate >= 20 && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          Excellent!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Controls */}
        {currentBudget?.items && currentBudget.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Filter:</span>
                    </div>
                    <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expenses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Sort by:</span>
                    </div>
                    <Select value={sortBy} onValueChange={(value: 'category' | 'amount' | 'spent' | 'remaining') => setSortBy(value)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="amount">Budget Amount</SelectItem>
                        <SelectItem value="spent">Amount Spent</SelectItem>
                        <SelectItem value="remaining">Remaining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedItems.length} of {currentBudget.items.length} items
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add New Budget Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
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
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Budget Items for {months[selectedMonth]} {selectedYear}</CardTitle>
                    <CardDescription>
                      Track your planned vs actual spending by category
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleEditClick(filteredAndSortedItems[0])}
                    variant="outline"
                    size="sm"
                    disabled={filteredAndSortedItems.length === 0}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredAndSortedItems.map((item, index) => {
                      const progressPercentage = item.budgetAmount > 0 
                        ? Math.min((item.spentAmount / item.budgetAmount) * 100, 100) 
                        : 0
                      const isOverBudget = item.spentAmount > item.budgetAmount
                      const remaining = item.budgetAmount - item.spentAmount

                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group p-4 border rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full transition-colors ${
                                item.type === 'income' 
                                  ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
                                  : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                              }`}>
                                {item.type === 'income' ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{item.category}</h4>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                                  {isOverBudget && (
                                    <Badge variant="destructive" className="text-xs">
                                      Over Budget
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                onClick={() => handleEditClick(item)}
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteBudgetItem(item._id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Budget: <span className="text-blue-600">${item.budgetAmount.toFixed(2)}</span></span>
                              <span className="font-medium">Spent: <span className={item.spentAmount > item.budgetAmount ? 'text-red-600' : 'text-green-600'}>${item.spentAmount.toFixed(2)}</span></span>
                            </div>
                            <Progress 
                              value={progressPercentage} 
                              className={`h-3 transition-all duration-300 ${
                                isOverBudget ? 'bg-red-100' : 'bg-gray-100'
                              }`}
                            />
                            <div className="flex justify-between items-center text-sm">
                              <span className={`font-medium ${
                                remaining >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {remaining >= 0 ? 'Remaining' : 'Over budget'}: ${Math.abs(remaining).toFixed(2)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  {progressPercentage.toFixed(1)}%
                                </span>
                                {progressPercentage >= 90 && progressPercentage < 100 && (
                                  <Badge variant="outline" className="text-xs text-amber-600">
                                    Almost Full
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
              <DialogDescription>
                Update the budget amount for {editingItem?.category}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-amount">Budget Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Enter new budget amount"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit}>
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {(!currentBudget?.items || currentBudget.items.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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