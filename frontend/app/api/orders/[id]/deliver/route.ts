import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order.model';
import { requireAuth } from '@/lib/auth-utils';
import { saveUploadedFile } from '@/lib/upload-utils';

// POST /api/orders/[id]/deliver - Deliver order
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
    
    // Verify user is the freelancer
    if (user._id.toString() !== order.freelancerId.toString()) {
      return new Response(
        JSON.stringify({ message: 'Only the freelancer can deliver this order' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if order is in progress
    if (order.status !== 'in_progress' && order.status !== 'late') {
      return new Response(
        JSON.stringify({ message: `Cannot deliver an order with status: ${order.status}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle form data (for file uploads)
    const formData = await request.formData();
    const notes = formData.get('notes') as string;
    const file = formData.get('file') as File | null;
    
    // Save file if provided
    let deliveryFile = order.deliveryFile;
    if (file && file.size > 0) {
      try {
        const uploadedFile = await saveUploadedFile(file);
        deliveryFile = uploadedFile.path;
      } catch (error: any) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Update order
    order.status = 'delivered';
    order.deliveryFile = deliveryFile;
    order.deliveryNotes = notes || '';
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
    console.error('Deliver order error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
