import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = [
    '/admin',
    '/my-contests',
    '/mypage',
    '/contests/create',
  ];
  
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  // We check for both access_token and refresh_token
  // If either exists, we allow the request and let api-client handle refresh if needed
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  if (isProtected && !accessToken && !refreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Redirect from login/signup if already authenticated
  if ((pathname === '/login' || pathname === '/signup') && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/my-contests/:path*',
    '/mypage/:path*',
    '/contests/create/:path*',
    '/login',
    '/signup',
  ],
};
