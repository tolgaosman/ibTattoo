import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

const COOKIE_NAME = "admin_session";
const ADMIN_EMAIL = "irmakyamuer2000@gmail.com";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Hatalı şifre" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
