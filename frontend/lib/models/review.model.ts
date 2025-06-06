import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  order?: any;
}

const reviewSchema = new Schema<IReview>({  orderId: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'Order',
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for order
reviewSchema.virtual('order', {
  ref: 'Order',
  localField: 'orderId',
  foreignField: '_id',
  justOne: true
});

// Update gig rating after saving a review
reviewSchema.post('save', async function() {
  try {
    const Order = mongoose.models.Order || mongoose.model('Order');
    const Gig = mongoose.models.Gig || mongoose.model('Gig');
      // Get the order to find the gig
    const order = await Order.findById((this as any).orderId);
    if (!order) return;
    
    // Get all reviews for the specific gigId
    const gigId = order.gigId;
    const orders = await Order.find({ gigId });
    const orderIds = orders.map((order: any) => order._id);
    
    // Find all reviews for these orders
    const Review = mongoose.models.Review || mongoose.model('Review');
    const reviews = await Review.find({ orderId: { $in: orderIds } });
    
    // Calculate new average rating
    let totalRating = 0;
    reviews.forEach((review: any) => {
      totalRating += review.rating;
    });
    
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    // Update the gig with new rating and review count
    await Gig.findByIdAndUpdate(gigId, {
      rating: averageRating,
      totalReviews: reviews.length
    });
  } catch (err) {
    console.error('Error updating gig rating:', err);
  }
});

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
