import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import User from '@/lib/models/user.model';
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

    // Find order
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== user._id.toString() && 
      order.freelancerId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { message: 'Not authorized to approve cancellation for this order' },
        { status: 403 }
      );
    }
    
    // Verify cancellation was not requested by current user
    if (order.cancellationRequestedBy && order.cancellationRequestedBy.toString() === user._id.toString()) {
      return NextResponse.json(
        { message: 'Cannot approve your own cancellation request' },
        { status: 400 }
      );
    }
    
    // Check if order has a cancellation request
    if (order.status !== 'cancellation_requested') {
      return NextResponse.json(
        { message: 'No cancellation request to approve' },
        { status: 400 }
      );
    }
      // Update order
    order.status = 'cancelled';
    order.cancellationApproved = true;
    await order.save();
    
    // Return funds to client
    await User.findByIdAndUpdate(order.clientId, { $inc: { balance: order.price } });
    
    const updatedOrder = await Order.findById(params.id)
      .populate('gigId', 'title', 'Gig')
      .populate('clientId', 'name', 'User')
      .populate('freelancerId', 'name', 'User')
      .populate('review');

    // Transform the response to match frontend expectations
    const transformedOrder = {
      ...updatedOrder.toObject(),
      id: updatedOrder._id,
      gig: updatedOrder.gigId, // Map gigId to gig for frontend
      client: updatedOrder.clientId, // Map clientId to client for frontend
      freelancer: updatedOrder.freelancerId, // Map freelancerId to freelancer for frontend
      gigId: updatedOrder.gigId?._id, // Keep the ID reference
      clientId: updatedOrder.clientId?._id, // Keep the ID reference
      freelancerId: updatedOrder.freelancerId?._id // Keep the ID reference
    };
    
    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Approve cancellation error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
