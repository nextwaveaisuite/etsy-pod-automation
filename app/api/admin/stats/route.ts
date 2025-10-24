import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const stats = { totalUsers: 1, activeUsers: 1, pendingRequests: 0, availableCodes: 2, newUsersThisWeek: 0 };
  return NextResponse.json({ success: true, stats });
}
