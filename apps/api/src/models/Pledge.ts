import mongoose, { Schema } from 'mongoose';

export interface IPledge {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  amount: number;
  message?: string;

  // وسيلة الدفع (cash, online...)
  paymentMethod: 'received' | 'pledged';

  // حالة التعهد
  pledgeStatus: 'received' | 'pending' | 'confirmed' | 'rejected';

  createdAt?: Date;
  updatedAt?: Date;
}


const pledgeSchema = new Schema<IPledge>({
  fullName: {
    type: String,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phoneNumber: {
    required: [true, 'Contact phone is required'],
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1'],
  },
  email: {
    type: String,
    trim: true,
    maxlength: [100, 'Email cannot exceed 100 characters']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    // التبرعات المقبوضة والتبرعات الغير مقبوضة 
    enum: ['received', 'pledged',],
    default: 'pledged'
  },
  pledgeStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
}, { timestamps: { createdAt: true, updatedAt: true } });

// Indexes for performance
pledgeSchema.index({ pledgeStatus: 1 });
pledgeSchema.index({ createdAt: -1 });
pledgeSchema.index({ amount: -1 });
pledgeSchema.index({ paymentMethod: 1 });


export const Pledge = mongoose.model<IPledge>('Pledge', pledgeSchema);

