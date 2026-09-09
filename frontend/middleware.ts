import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Exclude the login API and the login page from checks
    if (pathname === '/admin/login' || pathname.startsWith('/api/auth/login')) {
      return NextResponse.next();
    }

    const session = request.cookies.get('admin_session');
    
    if (!session) {
      // Redirect unauthenticated users to the login page, flagging that this
      // is likely a lapsed 1-hour session rather than a rejected password.
      return NextResponse.redirect(new URL('/admin/login?expired=1', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
