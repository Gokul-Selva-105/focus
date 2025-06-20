import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: Date
  recurring?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
  }
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  dueDate: {
    type: Date,
    default: null
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Indexes for better query performance
TaskSchema.index({ userId: 1, createdAt: -1 })
TaskSchema.index({ userId: 1, completed: 1 })
TaskSchema.index({ userId: 1, dueDate: 1 })

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)