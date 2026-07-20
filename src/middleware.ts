import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/map-studio', '/fleet', '/staff', '/user-management', '/settings'];
const authRoutes = ['/auth', '/reset-password'];

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('echonav_token')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Block unauthorized users from protected routes
  if (isProtectedRoute && !tokenCookie) {
    return NextResponse.redirect(new URL('/auth?tab=login', request.url));
  }

  if (tokenCookie) {
    const decoded = parseJwt(tokenCookie);
    
    // THE FIX: RBAC - Block Technicians from the Web Dashboard
    if (isProtectedRoute && decoded?.role === 'TECHNICIAN') {
      // Clear their token and kick them out. They belong on mobile.
      const response = NextResponse.redirect(new URL('/auth?tab=login&error=mobile_only', request.url));
      response.cookies.delete('echonav_token');
      return response;
    }

    // Redirect admins away from auth screens if already logged in
    if (isAuthRoute && decoded?.role !== 'TECHNICIAN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$).*)',
  ],
};