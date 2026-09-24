import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Per-request CSP nonce (see https://nextjs.org/docs/app/guides/content-security-policy).
 * Generated here rather than in next.config.ts because a nonce must be
 * unique per response — a value baked into the build-time config would be
 * the same for every visitor and defeat the point of using one at all. Next
 * automatically applies this nonce to the inline scripts it renders itself
 * once it's forwarded as the `x-nonce` request header and referenced in the
 * response's CSP; app/layout.tsx also applies it explicitly to the one
 * inline script this app renders itself (the JSON-LD block).
 */
function buildCsp(nonce: string, storageOrigin: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src 'self' data: blob: ${storageOrigin}`,
    `connect-src 'self' ${storageOrigin}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

// Mirrors next.config.ts's own derivation of the Laravel origin — duplicated
// rather than imported because next.config.ts is a build-time-only module.
let storageOrigin = 'http://127.0.0.1:8000';
try {
  const apiUrl = new URL(process.env.API_URL || 'http://127.0.0.1:8000/api');
  storageOrigin = `${apiUrl.protocol}//${apiUrl.host}`;
} catch {
  // keep the default above
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = crypto.randomUUID().replace(/-/g, '');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // The login page itself must stay reachable without a session, or no one
    // could ever sign in.
    if (pathname === '/admin/login') {
      return withSecurityHeaders(
        NextResponse.next({ request: { headers: requestHeaders } }),
        nonce,
      );
    }

    const session = request.cookies.get('admin_session');

    if (!session) {
      // Redirect unauthenticated users to the login page
      return withSecurityHeaders(
        NextResponse.redirect(new URL('/admin/login?expired=1', request.url)),
        nonce,
      );
    }
  }

  return withSecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    nonce,
  );
}

function withSecurityHeaders(response: NextResponse, nonce: string) {
  response.headers.set('Content-Security-Policy', buildCsp(nonce, storageOrigin));
  return response;
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - _next (static files, image optimization)
  // - api, auth, randevu-api (API routes — not HTML, and they set their own
  //   minimal CSP via next.config.ts's headers())
  // - files with extensions (e.g. .jpg, .png, .svg)
  matcher: ['/((?!api|auth|randevu-api|_next|.*\\..*).*)'],
};
