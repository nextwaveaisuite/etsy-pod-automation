import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, inviteCode } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if invite-only mode is enabled
    // In production, query database
    // const settings = await db.query('SELECT setting_value FROM system_settings WHERE setting_key = ?', ['invite_only']);
    const inviteOnly = true; // For demo, assume invite-only is enabled

    if (inviteOnly) {
      if (!inviteCode) {
        return NextResponse.json(
          { success: false, error: 'Invite code is required' },
          { status: 400 }
        );
      }

      // Verify invite code
      // In production, query database
      // const code = await db.query('SELECT * FROM invite_codes WHERE code = ? AND is_used = FALSE', [inviteCode]);
      
      // For demo, check against hardcoded codes
      const VALID_CODES = ['BETA-2025-ABCD', 'BETA-2025-EFGH', 'BETA-2025-IJKL'];
      
      if (!VALID_CODES.includes(inviteCode)) {
        return NextResponse.json(
          { success: false, error: 'Invalid or already used invite code' },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    // In production, query database
    // const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    // For demo, assume email doesn't exist

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    // In production, insert into database
    // const result = await db.query(
    //   'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
    //   [email, name, passwordHash, 'user']
    // );

    // Mark invite code as used
    // In production, update database
    // await db.query(
    //   'UPDATE invite_codes SET is_used = TRUE, used_at = NOW(), used_by = ? WHERE code = ?',
    //   [result.insertId, inviteCode]
    // );

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please log in.'
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Check for duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}

