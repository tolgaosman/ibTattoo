import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Per-request CSP nonce (see https://nextjs.org/docs/app/guides/content-security-policy).
 * Generated here rather than in next.config.ts because a nonce must be
 * unique per response — a value baked into the build-time config would be
 * the same for every visitor and defeat the point of using one at all.
 *
 * Next auto-applies this nonce to the scripts *it* renders (its own
 * `/_next/static` bootstrap chunks, `<Script>` components, ...) but only by
 * reading the CSP header back off the *incoming request* — not the
 * response. That's why this is set on `requestHeaders` below, in addition
 * to the response: setting only the response header (what CSP conceptually
 * is) leaves Next's own scripts un-nonced and the whole app fails to load,
 * blocked by 'strict-dynamic' below. app/layout.tsx also applies this same
 * nonce explicitly to the one inline script this app renders itself (the
 * JSON-LD block), via the `x-nonce` request header.
 *
 * No `strict-dynamic`: verified locally that with it, Next/React 19's own
 * `preinit()` call for at least one shared/client-reference-manifest chunk
 * doesn't thread the nonce through (a Next 16.3.4 internals gap, not
 * anything in this app's code) — and strict-dynamic's whole point is to
 * *disable* the `'self'` fallback for host-based allowlisting, so that one
 * un-nonced, parser-inserted <script> gets flat-out blocked and the app
 * fails to boot. Keeping `'self'` alongside the nonce (without
 * strict-dynamic) still blocks any externally-hosted or purely-injected
 * script that isn't served from this origin, which is what actually matters
 * against XSS here; it just also tolerates this one same-origin edge case.
 */
function buildCsp(nonce: string, storageOrigin: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
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
  const csp = buildCsp(nonce, storageOrigin);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // The login page itself must stay reachable without a session, or no one
    // could ever sign in.
    if (pathname === '/admin/login') {
      return withCsp(NextResponse.next({ request: { headers: requestHeaders } }), csp);
    }

    const session = request.cookies.get('admin_session');

    if (!session) {
      // Redirect unauthenticated users to the login page
      return withCsp(
        NextResponse.redirect(new URL('/admin/login?expired=1', request.url)),
        csp,
      );
    }
  }

  return withCsp(NextResponse.next({ request: { headers: requestHeaders } }), csp);
}

function withCsp(response: NextResponse, csp: string) {
  response.headers.set('Content-Security-Policy', csp);
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
