import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import Review from '@/lib/models/review.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { gigId: string } }
) {
  try {
    await dbConnect();
    
    const gigId = params.gigId;
    console.log('Fetching reviews for gig:', gigId);
      // Get all completed orders for this gig
    const orders = await Order.find({ 
      gigId, 
      status: 'completed' 
    });
    
    console.log(`Found ${orders?.length || 0} completed orders for gig ${gigId}`);
    
    if (!orders || orders.length === 0) {
      console.log('No completed orders found, returning empty array');
      return NextResponse.json([]);
    }
    
    const orderIds = orders.map(order => order._id);
    console.log('Order IDs:', orderIds);
    
    // Get reviews for these orders
    const reviews = await Review.find({ 
      orderId: { $in: orderIds } 
    }).populate({
      path: 'orderId',
      select: 'clientId',
      populate: {
        path: 'clientId',
        model: 'User',
        select: 'name'
      }
    });
    
    console.log(`Found ${reviews?.length || 0} reviews`);
    
    // Format the reviews for the frontend
    const formattedReviews = reviews.map(review => {
      console.log('Processing review:', review._id);
      return {
        id: review._id,
        orderId: review.orderId._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        client: {
          name: review.orderId?.clientId?.name || 'Unknown Client'
        }
      };
    });
    
    console.log('Returning formatted reviews:', formattedReviews.length);
    return NextResponse.json(formattedReviews);  } catch (error) {
    console.error('Get gig reviews error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
