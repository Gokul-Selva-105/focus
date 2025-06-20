import mongoose, { Document, Schema } from 'mongoose'

export interface IMeal extends Document {
  name: string
  description?: string
  mealTime: 'morning' | 'afternoon' | 'evening' | 'snack'
  foods: {
    name: string
    quantity?: string
    calories?: number
  }[]
  totalCalories?: number
  date: Date
  time: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MealSchema = new Schema<IMeal>({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
    maxlength: [100, 'Meal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  mealTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'snack'],
    required: [true, 'Meal time is required']
  },
  foods: [{
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [100, 'Food name cannot exceed 100 characters']
    },
    quantity: {
      type: String,
      trim: true,
      maxlength: [50, 'Quantity cannot exceed 50 characters']
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    }
  }],
  totalCalories: {
    type: Number,
    min: [0, 'Total calories cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  time: {
    type: String,
    required: [true, 'Time is required']
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
MealSchema.index({ userId: 1, date: -1 })
MealSchema.index({ userId: 1, mealTime: 1 })

export default mongoose.models.Meal || mongoose.model<IMeal>('Meal', MealSchema)