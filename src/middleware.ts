import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define the security perimeter based on your Sidebar routes
const protectedRoutes = ['/dashboard', '/map-studio', '/fleet', '/staff', '/user-management', '/settings'];
const authRoutes = ['/auth', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. THE FIX: Read the actual JWT cookie, not a fake UI status
  const tokenCookie = request.cookies.get('echonav_token');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 2. Unauthenticated user attempting to breach the perimeter
  if (isProtectedRoute && !tokenCookie) {
    const loginUrl = new URL('/auth?tab=login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated user attempting to view the login page
  if (isAuthRoute && tokenCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// 4. Optimize execution to prevent the proxy from running on static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$).*)',
  ],
};