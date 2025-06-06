import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/gig.model';
import { requireAuth } from '@/lib/auth-utils';

// GET /api/gigs/[id] - Get single gig by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {  try {
    await dbConnect();
    
    const gig = await Gig.findById(params.id).populate({
      path: 'freelancerId',
      select: 'name profileImage bio',
      model: 'User'
    });
    
    if (!gig) {
      return new Response(
        JSON.stringify({ message: 'Gig not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform the response to match frontend expectations
    const transformedGig = {
      ...gig.toObject(),
      id: gig._id,
      freelancer: gig.freelancerId, // Map freelancerId to freelancer for frontend
      freelancerId: gig.freelancerId._id // Keep the ID reference
    };
    
    return new Response(
      JSON.stringify(transformedGig),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }catch (error) {
    console.error('Get gig error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/gigs/[id] - Update gig
export async function PUT(
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
    const { title, description, price, category, image, durationDays } = body;
    
    // Find gig
    const gig = await Gig.findById(params.id);
    
    if (!gig) {
      return new Response(
        JSON.stringify({ message: 'Gig not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user is owner of gig
    if (gig.freelancerId.toString() !== user._id.toString()) {
      return new Response(
        JSON.stringify({ message: 'Not authorized to update this gig' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update gig fields
    const updatedGig = await Gig.findByIdAndUpdate(
      params.id,
      {
        title: title || gig.title,
        description: description || gig.description,
        price: price || gig.price,
        category: category || gig.category,
        image: image || gig.image,
        durationDays: durationDays || gig.durationDays
      },
      { new: true }
    ).populate({
      path: 'freelancerId',
      select: 'name',
      model: 'User'
    });
    
    return new Response(
      JSON.stringify(updatedGig),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update gig error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/gigs/[id] - Delete gig
export async function DELETE(
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
    
    // Find gig
    const gig = await Gig.findById(params.id);
    
    if (!gig) {
      return new Response(
        JSON.stringify({ message: 'Gig not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user is owner of gig
    if (gig.freelancerId.toString() !== user._id.toString()) {
      return new Response(
        JSON.stringify({ message: 'Not authorized to delete this gig' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Delete gig
    await Gig.findByIdAndDelete(params.id);
    
    return new Response(
      JSON.stringify({ message: 'Gig deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete gig error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
