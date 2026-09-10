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
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL('/admin/login?expired=1', request.url));
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - _next (static files, image optimization)
  // - api, auth, randevu-api (API routes)
  // - files with extensions (e.g. .jpg, .png, .svg)
  matcher: ['/((?!api|auth|randevu-api|_next|.*\\..*).*)'],
};
