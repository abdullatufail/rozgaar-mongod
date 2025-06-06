import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import User from '@/lib/models/user.model';
import { requireAuth } from '@/lib/auth-utils';

// PATCH /api/orders/[id]/status - Update order status
export async function PATCH(
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
    const { status } = body;
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ message: 'Invalid status' }),
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
    
    // Check if user is associated with the order
    if (
      order.clientId.toString() !== user._id.toString() && 
      order.freelancerId.toString() !== user._id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: 'Not authorized to update this order' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Apply status change logic
    if (status === 'in_progress' && order.status === 'pending') {
      // Freelancer started working on the order
      if (user._id.toString() !== order.freelancerId.toString()) {
        return new Response(
          JSON.stringify({ message: 'Only the freelancer can start working on the order' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (status === 'cancelled') {
      // Return funds to client if cancelling
      await User.findByIdAndUpdate(order.clientId, { $inc: { balance: order.price } });
    }
    
    // Update order
    order.status = status;
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
    console.error('Update order status error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
