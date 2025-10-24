import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, settings: { inviteOnly: true, allowRegistration: true } });
}

export async function POST(request: NextRequest) {
  const { inviteOnly } = await request.json();
  return NextResponse.json({ success: true, settings: { inviteOnly } });
}
