import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Logging for debugging purposes
  console.log('Token:', token);
  console.log('Pathname:', pathname);

  // Allow unauthenticated access to login and register pages
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/api/auth')) {
    if (token && (pathname === '/login' || pathname === '/register')) {
      // Redirect authenticated users trying to access login or register
      console.log('Redirecting to home because user is authenticated');
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access any other route
  if (!token) {
    console.log('Redirecting to login because user is not authenticated');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/messages/:path*', '/api/:path*', '/groups/:path*', '/browse', '/creategroup', '/addfriends', '/settings'],
};
