import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
  
  // In production, verify JWT token
  // For demo, return mock admin user
  return NextResponse.json({
    success: true,
    user: {
      id: 'admin-001',
      email: 'admin@etsypodbuilder.com',
      name: 'Admin User',
      role: 'admin'
    }
  });
}
