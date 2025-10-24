import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, query database for system settings
    // const db = await connectToDatabase();
    // const result = await db.query('SELECT setting_value FROM system_settings WHERE setting_key = ?', ['invite_only']);
    // const inviteOnly = result[0]?.setting_value === 'true';

    // For demo purposes, return hardcoded settings
    const settings = {
      inviteOnly: true, // Change this to false to allow open registration
      allowRegistration: true,
      requireEmailVerification: false
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

