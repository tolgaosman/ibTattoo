import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";
const ADMIN_COOKIE = "admin_session";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || res.statusText;
  } catch {
    return res.statusText;
  }
}

/**
 * How long a public read may block a server render. Without this, an
 * unresponsive API holds the request open until the platform's own timeout —
 * a dead backend was making the home page take ~18s before erroring. Failing
 * fast lets `getContent()` fall back to bundled content instead.
 *
 * Placed before the spread so a caller can still pass its own `signal`.
 */
const READ_TIMEOUT_MS = 5000;

/** Public, unauthenticated calls to the Laravel API. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let locale = "tr";
  try {
    locale = await getLocale();
  } catch {
    // Might fail during static generation outside a request
  }
  
  const separator = path.includes('?') ? '&' : '?';
  const url = `${API_URL}${path}${separator}locale=${locale}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  return res.json() as Promise<T>;
}

/** Authenticated admin calls — attaches the Sanctum token from the httpOnly cookie. */
export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  const separator = path.includes('?') ? '&' : '?';
  const url = `${API_URL}/admin${path}${separator}admin=1`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    cookieStore.delete(ADMIN_COOKIE);
    redirect("/admin/login?expired=1");
  }

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export { API_URL };
