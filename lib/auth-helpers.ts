import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// Generate a random invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 3;
  const segmentLength = 4;
  
  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }).join('-');
  
  return code;
}

// Hash password (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // For demo purposes - in production, use bcrypt
  // const bcrypt = require('bcrypt');
  // return await bcrypt.hash(password, 10);
  
  // Simple hash for demo (NOT SECURE - use bcrypt in production)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password (in production, use bcrypt.compare)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes - in production, use bcrypt.compare
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Generate JWT token (simplified - in production, use proper JWT library)
export function generateToken(user: User): string {
  // In production, use jsonwebtoken library
  // const jwt = require('jsonwebtoken');
  // return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Simple token for demo (NOT SECURE - use JWT in production)
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    // In production, use jsonwebtoken library
    // const jwt = require('jsonwebtoken');
    // return jwt.verify(token, process.env.JWT_SECRET);
    
    // Simple verification for demo
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
}

// Get current user from request
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return null;
    }
    
    // In production, fetch full user data from database
    // For demo, return basic user info from token
    return {
      id: payload.userId,
      email: payload.email,
      name: '', // Would fetch from DB
      role: payload.role as 'user' | 'admin',
      createdAt: new Date()
    };
  } catch (error) {
    return null;
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Require admin role (throws if not admin)
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }
  
  return user;
}

