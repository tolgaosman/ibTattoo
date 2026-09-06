import { NextResponse } from "next/server";

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

  // TODO: e-posta gönderimi (Resend) — henüz backend yok, talep şimdilik loglanıyor.
  console.log("[randevu] yeni talep:", payload);

  return NextResponse.json({ ok: true });
}
