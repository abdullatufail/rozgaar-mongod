import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/gig.model';
import { requireRole } from '@/lib/auth-utils';

// GET /api/gigs/my - Get my gigs (for logged-in freelancer)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireRole(request, 'freelancer');
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
      // Find all gigs by the logged-in freelancer
    const gigs = await Gig.find({ freelancerId: user._id }).populate({
      path: 'freelancerId',
      select: 'name',
      model: 'User'
    });    // Transform gigs to match frontend expectations
    const transformedGigs = gigs.map((gig: any) => ({
      ...gig.toObject(),
      id: gig._id,
      freelancer: gig.freelancerId, // Map freelancerId to freelancer
      freelancerId: gig.freelancerId._id // Keep the ID reference
    }));
    
    return new Response(
      JSON.stringify(transformedGigs),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get my gigs error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
