import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import Review from '@/lib/models/review.model';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireAuth(req);
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;

    const { rating, comment } = await req.json();
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Please provide a valid rating (1-5)' },
        { status: 400 }
      );
    }
    
    // Find order
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Verify user is the client
    if (user._id.toString() !== order.clientId.toString()) {
      return NextResponse.json(
        { message: 'Only the client can review this order' },
        { status: 403 }
      );
    }
    
    // Check if order is completed
    if (order.status !== 'completed') {
      return NextResponse.json(
        { message: 'Cannot review an order that is not completed' },
        { status: 400 }
      );
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ orderId: order._id });
    if (existingReview) {
      return NextResponse.json(
        { message: 'Order has already been reviewed' },
        { status: 400 }
      );
    }
    
    // Create review
    const review = await Review.create({
      orderId: order._id,
      rating,
      comment
    });
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
