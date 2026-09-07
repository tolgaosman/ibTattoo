import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

const COOKIE_NAME = "admin_session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
    } catch {
      // Token invalidation is best-effort — the cookie is cleared regardless.
    }
  }

  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
