import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

interface AppointmentPayload {
  name: string;
  contact: string;
  idea: string;
  placement: string;
  size: string;
  reference?: string;
  dates?: string;
}

const REQUIRED_FIELDS: Array<keyof AppointmentPayload> = ["name", "contact", "idea", "placement", "size"];

export async function POST(request: Request) {
  let payload: Partial<AppointmentPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter(
    (key) => !payload[key] || String(payload[key]).trim() === "",
  );
  if (missing.length > 0) {
    return NextResponse.json({ error: "Eksik alanlar var.", missing }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ error: body.message || "Randevu kaydedilemedi." }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
