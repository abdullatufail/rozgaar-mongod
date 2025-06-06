import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    
    if (userOrResponse instanceof Response) {
      return userOrResponse;
    }
    
    const user = userOrResponse;
    
    return new Response(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}