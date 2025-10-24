import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/request-invite',
    '/auth/forgot-password',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/request-invite',
    '/api/auth/settings',
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token (in production, verify JWT signature)
  try {
    // For now, just check if token exists
    // In production, decode and verify JWT
    
    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
      // Verify admin role (implement proper JWT verification)
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          'Cookie': `auth_token=${token}`
        }
      });

      const data = await response.json();

      if (!data.user || data.user.role !== 'admin') {
        // Redirect non-admin users away from admin routes
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

