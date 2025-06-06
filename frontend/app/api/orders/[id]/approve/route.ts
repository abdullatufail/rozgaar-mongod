import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import User from '@/lib/models/user.model';
import { requireAuth } from '@/lib/auth-utils';

// POST /api/orders/[id]/approve - Approve delivery
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
    
    // Find order
    const order = await Order.findById(params.id);
    if (!order) {
      return new Response(
        JSON.stringify({ message: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify user is the client
    if (user._id.toString() !== order.clientId.toString()) {
      return new Response(
        JSON.stringify({ message: 'Only the client can approve this delivery' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if order is delivered
    if (order.status !== 'delivered') {
      return new Response(
        JSON.stringify({ message: 'Cannot approve delivery for an order that has not been delivered' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update order status
    order.status = 'completed';
    await order.save();
    
    // Transfer payment to freelancer
    await User.findByIdAndUpdate(order.freelancerId, { $inc: { balance: order.price } });
    
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
    console.error('Approve delivery error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
