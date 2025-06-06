import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import { requireAuth } from '@/lib/auth-utils';

// POST /api/orders/[id]/cancel - Request cancellation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireAuth(request);
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    const body = await request.json();
    const { reason } = body;
    
    if (!reason) {
      return new Response(
        JSON.stringify({ message: 'Please provide a reason for cancellation' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Find order
    const order = await Order.findById(params.id);
    if (!order) {
      return new Response(
        JSON.stringify({ message: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== user._id.toString() && 
      order.freelancerId.toString() !== user._id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: 'Not authorized to request cancellation for this order' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if order can be cancelled
    if (['completed', 'cancelled', 'cancellation_requested'].includes(order.status)) {
      return new Response(
        JSON.stringify({ message: `Cannot request cancellation for an order with status: ${order.status}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update order
    order.status = 'cancellation_requested';
    order.cancellationReason = reason;
    order.cancellationRequestedBy = user._id;
    await order.save();
    
    const updatedOrder = await Order.findById(params.id)
      .populate('gigId', 'title', 'Gig')
      .populate('clientId', 'name', 'User')
      .populate('freelancerId', 'name', 'User')
      .populate('review', null, 'Review');
    
    return new Response(
      JSON.stringify(updatedOrder),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Request cancellation error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
