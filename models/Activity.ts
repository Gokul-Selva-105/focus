import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  name: string
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other'
  duration: number // in minutes
  intensity: 'low' | 'medium' | 'high'
  caloriesBurned?: number
  notes?: string
  date: Date
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true,
    maxlength: [100, 'Activity name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    required: [true, 'Activity type is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, 'Intensity is required']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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
ActivitySchema.index({ userId: 1, date: -1 })
ActivitySchema.index({ userId: 1, type: 1 })

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)