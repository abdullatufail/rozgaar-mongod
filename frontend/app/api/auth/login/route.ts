import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/lib/models/user.model';

// Generate JWT token
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please provide email and password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user and token
    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
