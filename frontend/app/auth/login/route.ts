import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { forwardedForHeader, isSameOrigin } from "@/lib/security";

const COOKIE_NAME = "admin_session";
// Must match ADMIN_EMAIL in the backend's own .env — see frontend/.env.example.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "Geçersiz istek." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const password = body?.password;

    if (typeof password !== "string" || password.length === 0 || password.length > 200) {
      return NextResponse.json(
        { success: false, error: "Hatalı e-posta veya şifre." },
        { status: 401 },
      );
    }

    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...forwardedForHeader(request),
      },
      body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600, // 1 hour — matches SANCTUM_EXPIRATION on the backend
      });

      return NextResponse.json({ success: true });
    }

    // 429 here means nginx's own per-IP limit_req on this route tripped, not
    // a credentials error — pass that distinction through rather than
    // implying the password was wrong.
    if (res.status === 429) {
      return NextResponse.json(
        { success: false, error: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 },
      );
    }

    // The backend's own message here is one of ours (bad credentials, or its
    // own IP+email lockout text) — safe to relay as-is.
    return NextResponse.json(
      { success: false, error: data?.errors?.password?.[0] || "Hatalı e-posta veya şifre." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 },
    );
  }
}
