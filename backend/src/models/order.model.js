import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
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
  },
  cancellationRequestedBy: {
    type: mongoose.Schema.Types.ObjectId,
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

const Order = mongoose.model('Order', orderSchema);

export default Order; 