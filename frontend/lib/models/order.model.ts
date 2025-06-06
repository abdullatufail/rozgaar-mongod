import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  gigId: string;
  clientId: string;
  freelancerId: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'cancellation_requested' | 'late';
  price: number;
  requirements: string;
  dueDate?: Date;
  isLate: boolean;
  deliveryFile?: string;
  deliveryNotes?: string;
  cancellationReason?: string;
  cancellationApproved: boolean;
  cancellationRequestedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  gig?: any;
  client?: any;
  freelancer?: any;
  review?: any;
}

const orderSchema = new Schema<IOrder>({  gigId: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'Gig',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'in_progress',
      'delivered',
      'completed',
      'cancelled',
      'cancellation_requested',
      'late'
    ],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  isLate: {
    type: Boolean,
    default: false
  },
  deliveryFile: {
    type: String
  },
  deliveryNotes: {
    type: String
  },
  cancellationReason: {
    type: String
  },
  cancellationApproved: {
    type: Boolean,
    default: false
  },  cancellationRequestedBy: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for related data
orderSchema.virtual('gig', {
  ref: 'Gig',
  localField: 'gigId',
  foreignField: '_id',
  justOne: true
});

orderSchema.virtual('client', {
  ref: 'User',
  localField: 'clientId',
  foreignField: '_id',
  justOne: true
});

orderSchema.virtual('freelancer', {
  ref: 'User',
  localField: 'freelancerId',
  foreignField: '_id',
  justOne: true
});

// Virtual for review
orderSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'orderId',
  justOne: true
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
