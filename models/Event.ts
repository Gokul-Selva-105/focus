import mongoose, { Document, Schema } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  allDay: boolean
  category: string
  color?: string
  reminder?: {
    enabled: boolean
    time: number // minutes before event
  }
  recurring?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: Date
  }
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  allDay: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  color: {
    type: String,
    default: '#3b82f6' // blue
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 15 // 15 minutes before
    }
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'weekly'
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    endDate: {
      type: Date
    }
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
EventSchema.index({ userId: 1, startDate: 1 })
EventSchema.index({ userId: 1, category: 1 })

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)