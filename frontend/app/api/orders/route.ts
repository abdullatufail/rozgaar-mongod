import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import Gig from '@/lib/models/gig.model';
import User from '@/lib/models/user.model';
import { requireRole, requireAuth } from '@/lib/auth-utils';

// GET /api/orders - Get all orders for current user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireAuth(request);
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    let orders;
    
    if (user.role === 'client') {
      // Clients see their orders
      orders = await Order.find({ clientId: user._id })
        .populate('gigId', 'title', 'Gig')
        .populate('clientId', 'name', 'User')
        .populate('freelancerId', 'name', 'User')
        .populate('review', null, 'Review');
    } else if (user.role === 'freelancer') {
      // Freelancers see orders assigned to them
      orders = await Order.find({ freelancerId: user._id })
        .populate('gigId', 'title', 'Gig')
        .populate('clientId', 'name', 'User')
        .populate('freelancerId', 'name', 'User')
        .populate('review', null, 'Review');
    }
      // Check orders for late status
    const currentDate = new Date();
    if (orders) {
      for (let order of orders) {
        if (order.status === 'in_progress' && order.dueDate && new Date(order.dueDate) < currentDate) {
          order.isLate = true;
          order.status = 'late';
          await order.save();
        }
      }    }
      // Transform the response to match frontend expectations
    const transformedOrders = orders?.map((order: any) => ({
      ...order.toObject(),
      id: order._id,
      gig: order.gigId, // Map gigId to gig for frontend
      client: order.clientId, // Map clientId to client for frontend
      freelancer: order.freelancerId, // Map freelancerId to freelancer for frontend
      gigId: order.gigId?._id, // Keep the ID reference
      clientId: order.clientId?._id, // Keep the ID reference
      freelancerId: order.freelancerId?._id // Keep the ID reference
    })) || [];

    return new Response(
      JSON.stringify(transformedOrders),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get orders error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireRole(request, 'client');
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    const body = await request.json();
    const { gigId, requirements } = body;
    
    // Validate required fields
    if (!gigId || !requirements) {
      return new Response(
        JSON.stringify({ message: 'Please provide all required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Find the gig
    let gig;
    try {
      gig = await Gig.findById(gigId);
    } catch (error: any) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return new Response(
          JSON.stringify({ 
            message: 'Invalid gig ID format. MongoDB requires a valid 24-character hex string.',
            error: 'INVALID_ID_FORMAT'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
    
    if (!gig) {
      return new Response(
        JSON.stringify({ message: 'Gig not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify client has enough balance
    const client = await User.findById(user._id);
    if (!client || client.balance < gig.price) {
      return new Response(
        JSON.stringify({ 
          message: 'Insufficient balance',
          required: gig.price,
          current: client?.balance || 0
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + gig.durationDays);
    
    // Create order
    const order = await Order.create({
      gigId,
      clientId: user._id,
      freelancerId: gig.freelancerId,
      status: 'pending',
      price: gig.price,
      requirements,
      dueDate
    });
    
    // Deduct client balance
    await User.findByIdAndUpdate(user._id, { $inc: { balance: -gig.price } });
    
    // Populate relevant fields
    const populatedOrder = await Order.findById(order._id)
      .populate('gigId', 'title', 'Gig')
      .populate('clientId', 'name', 'User')
      .populate('freelancerId', 'name', 'User');
    
    return new Response(
      JSON.stringify(populatedOrder),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
