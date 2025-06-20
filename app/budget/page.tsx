'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Save } from 'lucide-react'

interface BudgetItem {
  id: string
  category: string
  budgeted: number
  spent: number
  remaining: number
}

interface Budget {
  id: string
  month: string
  year: number
  items: BudgetItem[]
  totalBudgeted: number
  totalSpent: number
  totalRemaining: number
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [showCreateBudget, setShowCreateBudget] = useState(false)
  const [newItem, setNewItem] = useState({ category: '', budgeted: 0, spent: 0 })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    const currentMonth = months[new Date().getMonth()]
    setSelectedMonth(currentMonth)
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBudgets: Budget[] = [
        {
          id: '1',
          month: 'January',
          year: 2024,
          items: [
            { id: '1', category: 'Housing', budgeted: 1500, spent: 1450, remaining: 50 },
            { id: '2', category: 'Food', budgeted: 600, spent: 580, remaining: 20 },
            { id: '3', category: 'Transportation', budgeted: 300, spent: 250, remaining: 50 },
          ],
          totalBudgeted: 2400,
          totalSpent: 2280,
          totalRemaining: 120
        }
      ]
      
      setBudgets(mockBudgets)
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentBudget = budgets.find(b => b.month === selectedMonth && b.year === selectedYear)

  const createBudget = () => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      month: selectedMonth,
      year: selectedYear,
      items: [],
      totalBudgeted: 0,
      totalSpent: 0,
      totalRemaining: 0
    }
    setBudgets([...budgets, newBudget])
    setShowCreateBudget(false)
  }

  const addBudgetItem = () => {
    if (!currentBudget || !newItem.category || newItem.budgeted <= 0) return
    
    const item: BudgetItem = {
      id: Date.now().toString(),
      category: newItem.category,
      budgeted: newItem.budgeted,
      spent: newItem.spent,
      remaining: newItem.budgeted - newItem.spent
    }
    
    const updatedBudget = {
      ...currentBudget,
      items: [...currentBudget.items, item]
    }
    
    updatedBudget.totalBudgeted = updatedBudget.items.reduce((sum, item) => sum + item.budgeted, 0)
    updatedBudget.totalSpent = updatedBudget.items.reduce((sum, item) => sum + item.spent, 0)
    updatedBudget.totalRemaining = updatedBudget.totalBudgeted - updatedBudget.totalSpent
    
    setBudgets(budgets.map(b => b.id === currentBudget.id ? updatedBudget : b))
    setNewItem({ category: '', budgeted: 0, spent: 0 })
    setShowAddForm(false)
  }

  const deleteBudgetItem = (itemId: string) => {
    if (!currentBudget) return
    
    const updatedBudget = {
      ...currentBudget,
      items: currentBudget.items.filter(item => item.id !== itemId)
    }
    
    updatedBudget.totalBudgeted = updatedBudget.items.reduce((sum, item) => sum + item.budgeted, 0)
    updatedBudget.totalSpent = updatedBudget.items.reduce((sum, item) => sum + item.spent, 0)
    updatedBudget.totalRemaining = updatedBudget.totalBudgeted - updatedBudget.totalSpent
    
    setBudgets(budgets.map(b => b.id === currentBudget.id ? updatedBudget : b))
  }

  const updateBudgetItem = (updatedItem: BudgetItem) => {
    if (!currentBudget) return
    
    const updatedBudget = {
      ...currentBudget,
      items: currentBudget.items.map(item => 
        item.id === updatedItem.id 
          ? { ...updatedItem, remaining: updatedItem.budgeted - updatedItem.spent }
          : item
      )
    }
    
    updatedBudget.totalBudgeted = updatedBudget.items.reduce((sum, item) => sum + item.budgeted, 0)
    updatedBudget.totalSpent = updatedBudget.items.reduce((sum, item) => sum + item.spent, 0)
    updatedBudget.totalRemaining = updatedBudget.totalBudgeted - updatedBudget.totalSpent
    
    setBudgets(budgets.map(b => b.id === currentBudget.id ? updatedBudget : b))
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '0s'}} />
      <div className="absolute top-40 right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}} />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-4 sm:py-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Budget Tracker
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
            Manage your monthly budgets and track expenses
          </p>
        </motion.div>

        {/* Month/Year Selector */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 sm:mb-8 px-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-emerald-400"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full sm:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-emerald-400"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Budget Summary */}
        {currentBudget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 mb-6 sm:mb-8 mx-4 sm:mx-0"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center sm:text-left">
              {selectedMonth} {selectedYear} Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">Total Budgeted</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">${currentBudget.totalBudgeted}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">${currentBudget.totalSpent}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Remaining</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">${currentBudget.totalRemaining}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Budget Items */}
        {currentBudget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden mx-4 sm:mx-0"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Budget Categories
                </h3>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50/80 dark:bg-gray-700/80">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Budgeted
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentBudget.items.map((item) => {
                    const percentage = (item.spent / item.budgeted) * 100
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${item.budgeted}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${item.spent}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${item.remaining}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                              title="Edit item"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteBudgetItem(item.id)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              title="Delete item"
                            >
                               <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* No Budget Message */}
        {!currentBudget && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 mx-4 sm:mx-0"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
                No budget found for {selectedMonth} {selectedYear}
              </p>
              <button
                onClick={createBudget}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 font-semibold text-lg"
              >
                Create Budget
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 sm:py-12 mx-4 sm:mx-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">Loading budgets...</p>
            </div>
          </div>
        )}

        {/* Add Budget Item Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Budget Category
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Housing, Food, Transportation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budgeted Amount
                    </label>
                    <input
                      type="number"
                      value={newItem.budgeted}
                      onChange={(e) => setNewItem({ ...newItem, budgeted: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Already Spent
                    </label>
                    <input
                      type="number"
                      value={newItem.spent}
                      onChange={(e) => setNewItem({ ...newItem, spent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addBudgetItem}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Budget Item Modal */}
        <AnimatePresence>
          {editingItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditingItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Budget Category
                  </h3>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Housing, Food, Transportation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budgeted Amount
                    </label>
                    <input
                      type="number"
                      value={editingItem.budgeted}
                      onChange={(e) => setEditingItem({ ...editingItem, budgeted: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Already Spent
                    </label>
                    <input
                      type="number"
                      value={editingItem.spent}
                      onChange={(e) => setEditingItem({ ...editingItem, spent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateBudgetItem(editingItem)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Update</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}