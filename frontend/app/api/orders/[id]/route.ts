import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import User from '@/lib/models/user.model';
import { requireAuth } from '@/lib/auth-utils';

// GET /api/orders/[id] - Get single order by ID
export async function GET(
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
    
    const order = await Order.findById(params.id)
      .populate('gigId', 'title', 'Gig')
      .populate('clientId', 'name', 'User')
      .populate('freelancerId', 'name', 'User')
      .populate('review', null, 'Review');
    
    if (!order) {
      return new Response(
        JSON.stringify({ message: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user is associated with the order
    if (
      order.clientId._id.toString() !== user._id.toString() && 
      order.freelancerId._id.toString() !== user._id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: 'Not authorized to view this order' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if order is late
    const currentDate = new Date();
    if (order.status === 'in_progress' && order.dueDate && new Date(order.dueDate) < currentDate) {
      order.isLate = true;
      order.status = 'late';
      await order.save();
    }
      // Transform the response to match frontend expectations
    const transformedOrder = {
      ...order.toObject(),
      id: order._id,
      gig: order.gigId, // Map gigId to gig for frontend
      client: order.clientId, // Map clientId to client for frontend
      freelancer: order.freelancerId, // Map freelancerId to freelancer for frontend
      gigId: order.gigId?._id, // Keep the ID reference
      clientId: order.clientId?._id, // Keep the ID reference
      freelancerId: order.freelancerId?._id // Keep the ID reference
    };

    return new Response(
      JSON.stringify(transformedOrder),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get order error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
