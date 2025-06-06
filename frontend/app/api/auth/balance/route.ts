import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import dbConnect from '@/lib/db';
import User from '@/lib/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userOrResponse = await requireAuth(request);
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    const body = await request.json();
    const { amount } = body;
    
    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ message: 'Please provide a valid amount' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update user balance
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { balance: amount } },
      { new: true }
    );
    
    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        balance: updatedUser.balance,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Add balance error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
