import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const codes = [
    { id: '1', code: 'BETA-2025-ABCD', used: false, createdAt: new Date().toISOString() },
    { id: '2', code: 'BETA-2025-EFGH', used: false, createdAt: new Date().toISOString() }
  ];
  return NextResponse.json({ success: true, codes });
}

export async function POST(request: NextRequest) {
  const code = 'BETA-' + Date.now();
  return NextResponse.json({ success: true, code: { id: Date.now().toString(), code, used: false, createdAt: new Date().toISOString() } });
}
