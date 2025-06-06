import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import dbConnect from './db';
import User, { IUser } from './models/user.model';

export interface AuthenticatedRequest extends NextRequest {
  user: IUser;
}

export async function verifyToken(token: string): Promise<IUser | null> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
      await dbConnect();
    const user = await (User as any).findById(decoded.id);
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return await verifyToken(token);
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function requireAuth(request: NextRequest): Promise<IUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return createAuthResponse('Authorization required');
  }
  
  return user;
}

export async function requireRole(request: NextRequest, ...roles: string[]): Promise<IUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return createAuthResponse('Authorization required');
  }
  
  if (!roles.includes(user.role)) {
    return createAuthResponse('Access denied', 403);
  }
  
  return user;
}
