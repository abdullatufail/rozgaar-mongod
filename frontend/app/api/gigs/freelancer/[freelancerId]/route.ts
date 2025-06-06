import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/gig.model';
import User from '@/lib/models/user.model';

// GET /api/gigs/freelancer/[freelancerId] - Get all gigs by freelancer
export async function GET(
  _request: NextRequest,
  { params }: { params: { freelancerId: string } }
) {
  try {
    await dbConnect();
    
    const freelancerId = params.freelancerId;
    
    // Check if freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== 'freelancer') {
      return new Response(
        JSON.stringify({ message: 'Freelancer not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
      // Find all gigs by freelancer
    const gigs = await Gig.find({ freelancerId }).populate({
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
    console.error('Get freelancer gigs error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
