import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import Review from '@/lib/models/review.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { freelancerId: string } }
) {
  try {
    await dbConnect();
    
    const freelancerId = params.freelancerId;
    console.log('=== Reviews API Debug ===');
    console.log('Fetching reviews for freelancer:', freelancerId);
    
    // Get all completed orders for this freelancer
    const orders = await Order.find({ 
      freelancerId, 
      status: 'completed' 
    });
    
    console.log('Found completed orders:', orders.length);
    console.log('Orders:', orders.map(o => ({ id: o._id, status: o.status })));
    
    if (orders.length === 0) {
      console.log('No completed orders found, returning empty array');
      return NextResponse.json([]);
    }
    
    const orderIds = orders.map(order => order._id);
    console.log('Order IDs for review lookup:', orderIds);
    
    // Get reviews for these orders
    const reviews = await Review.find({ 
      orderId: { $in: orderIds } 
    }).populate([
      {
        path: 'orderId',
        select: 'gigId clientId',
        populate: [
          { path: 'clientId', select: 'name' },
          { path: 'gigId', select: 'title' }
        ]
      }
    ]);
    
    console.log('Found reviews:', reviews.length);
    console.log('Reviews data:', reviews.map(r => ({ 
      id: r._id, 
      rating: r.rating, 
      orderId: r.orderId,
      hasOrderData: !!r.orderId 
    })));
    
    // Transform the response to match frontend expectations
    const transformedReviews = reviews.map(review => ({
      ...review.toObject(),
      id: review._id,
      order: review.orderId ? {
        client: review.orderId.clientId,
        gig: review.orderId.gigId
      } : null
    }));
    
    console.log('Transformed reviews:', transformedReviews.length);
    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error('Get freelancer reviews error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
