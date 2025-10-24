import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, reason } = await request.json();

    // Validate input
    if (!name || !email || !reason) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already has a pending request
    // In production, query database
    // const existing = await db.query(
    //   'SELECT id FROM invite_requests WHERE email = ? AND status = ?',
    //   [email, 'pending']
    // );

    // Insert invite request
    // In production, insert into database
    // await db.query(
    //   'INSERT INTO invite_requests (name, email, reason, status) VALUES (?, ?, ?, ?)',
    //   [name, email, reason, 'pending']
    // );

    // Send notification to admin (in production)
    // await sendAdminNotification({
    //   type: 'new_invite_request',
    //   name,
    //   email,
    //   reason
    // });

    return NextResponse.json({
      success: true,
      message: 'Your request has been submitted successfully'
    });
  } catch (error: any) {
    console.error('Invite request error:', error);

    return NextResponse.json(
      { success: false, error: 'An error occurred while submitting your request' },
      { status: 500 }
    );
  }
}

