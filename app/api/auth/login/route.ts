import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyPassword } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Demo user for now — in production, query your DB
    const DEMO_USERS = [
      {
        id: "admin-001",
        email: "admin@etsypodbuilder.com",
        name: "Admin User",
        password_hash:
          "$2b$10$zKqkDZZT7PGGSnJx8ZC/eeD6dAf9K8A6Ba7eH5dbqGnq5prXhYp5u", // bcrypt hash for "Admin123!"
        role: "admin" as const,
      },
    ];

    const user = DEMO_USERS.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ✅ Fix: Type-safe password verification
    if (!user || typeof user.password_hash !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing password hash." },
        { status: 400 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date(),
    });

    // Create success response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set secure cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during login." },
      { status: 500 }
    );
  }
}

