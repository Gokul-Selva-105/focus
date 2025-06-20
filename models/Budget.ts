import mongoose from 'mongoose'

const BudgetItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budgetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  spentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
}, {
  timestamps: true
})

const BudgetSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11
  },
  year: {
    type: Number,
    required: true
  },
  totalIncomeBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  totalExpenseBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  actualIncome: {
    type: Number,
    default: 0,
    min: 0
  },
  actualExpenses: {
    type: Number,
    default: 0,
    min: 0
  },
  items: [BudgetItemSchema]
}, {
  timestamps: true
})

// Create compound index for efficient querying
BudgetSchema.index({ userEmail: 1, month: 1, year: 1 }, { unique: true })

// Virtual for budget balance
BudgetSchema.virtual('budgetBalance').get(function() {
  return this.totalIncomeBudget - this.totalExpenseBudget
})

// Virtual for actual balance
BudgetSchema.virtual('actualBalance').get(function() {
  return this.actualIncome - this.actualExpenses
})

// Virtual for budget vs actual variance
BudgetSchema.virtual('variance').get(function() {
  return this.actualBalance - this.budgetBalance
})

// Method to calculate budget utilization percentage
BudgetSchema.methods.getBudgetUtilization = function() {
  if (this.totalExpenseBudget === 0) return 0
  return (this.actualExpenses / this.totalExpenseBudget) * 100
}

// Method to get over-budget categories
BudgetSchema.methods.getOverBudgetCategories = function() {
  return this.items.filter(item => 
    item.type === 'expense' && item.spentAmount > item.budgetAmount
  )
}

// Method to get remaining budget by category
BudgetSchema.methods.getRemainingBudget = function() {
  return this.items.map(item => ({
    category: item.category,
    type: item.type,
    budgetAmount: item.budgetAmount,
    spentAmount: item.spentAmount,
    remaining: item.type === 'expense' 
      ? Math.max(0, item.budgetAmount - item.spentAmount)
      : item.budgetAmount - item.spentAmount,
    percentageUsed: item.budgetAmount > 0 
      ? (item.spentAmount / item.budgetAmount) * 100 
      : 0
  }))
}

const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)

export default Budget