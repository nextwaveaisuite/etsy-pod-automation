import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin role from auth token
    // const user = await requireAdmin();

    // In production, query database
    // const db = await getDatabase();
    // const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    // Demo data
    const users = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@etsypodbuilder.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

