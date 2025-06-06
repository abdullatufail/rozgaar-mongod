import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/gig.model';
import { requireRole } from '@/lib/auth-utils';

// GET /api/gigs - Get all gigs with filters and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build filter object
    const filter: any = {};
    
    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Build sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
      // Find gigs
    const gigs = await Gig.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'freelancerId',
        select: 'name',
        model: 'User'
      });
    
    // Transform gigs to match frontend expectations
    const transformedGigs = gigs.map(gig => ({
      ...gig.toObject(),
      id: gig._id,
      freelancer: gig.freelancerId, // Map freelancerId to freelancer
      freelancerId: gig.freelancerId._id // Keep the ID reference
    }));
    
    // Count total gigs for pagination
    const total = await Gig.countDocuments(filter);
    
    return new Response(
      JSON.stringify({
        gigs: transformedGigs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get gigs error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/gigs - Create a new gig
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireRole(request, 'freelancer');
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    const body = await request.json();
    const { title, description, price, category, image, durationDays } = body;
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return new Response(
        JSON.stringify({ message: 'Please provide all required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create gig
    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      image: image || 'https://placehold.co/600x400',
      durationDays: durationDays || 7,
      freelancerId: user._id
    });
    
    // Populate freelancer info
    const populatedGig = await Gig.findById(gig._id).populate({
      path: 'freelancerId',
      select: 'name',
      model: 'User'
    });
    
    return new Response(
      JSON.stringify(populatedGig),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create gig error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
