/**
 * Same-origin check for the app's own Route Handlers (`app/auth/login`,
 * `app/randevu-api`). Unlike Server Actions, Route Handlers get no automatic
 * Origin validation from Next.js, so a plain `<form>` or `fetch` on any other
 * site could otherwise POST to them cross-site using the visitor's cookies.
 *
 * Compares the request's `Origin` header against its own `Host` — not against
 * a hardcoded site URL, so it keeps working across local dev, previews and
 * production without extra config. A same-site request always sends a
 * same-origin `Origin` header for state-changing methods in every browser
 * this app supports, so a missing header (a same-site request never omits it;
 * only cross-origin no-cors requests can, and those don't carry this cookie)
 * is treated as a mismatch, not an exemption.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Carries the visitor's real IP from this server's own incoming request
 * onward to a `fetch()` this route makes to the Laravel API. Without it, the
 * API sees every request as coming from this container's own address —
 * nginx's `real_ip` module (docker/nginx/default.conf) has already resolved
 * `x-forwarded-for` to the true client by the time it reaches here, so
 * relaying it verbatim (not appending to it) is safe: it isn't
 * attacker-controlled at this point.
 */
export function forwardedForHeader(request: Request): Record<string, string> {
  const ip = request.headers.get("x-forwarded-for");
  return ip ? { "X-Forwarded-For": ip } : {};
}
