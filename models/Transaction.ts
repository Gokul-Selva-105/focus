import mongoose, { Document, Schema } from 'mongoose'

export interface ITransaction extends Document {
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: Date
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
TransactionSchema.index({ userId: 1, date: -1 })
TransactionSchema.index({ userId: 1, type: 1 })
TransactionSchema.index({ userId: 1, category: 1 })

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)