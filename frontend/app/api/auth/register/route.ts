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
    const { name, email, password, role } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please provide all required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Email is already registered' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    const validRoles = ['client', 'freelancer'];
    if (role && !validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ message: 'Invalid role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client'
    });

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
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
