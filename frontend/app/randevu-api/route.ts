import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { forwardedForHeader, isSameOrigin } from "@/lib/security";

interface AppointmentPayload {
  name: string;
  contact: string;
  idea: string;
  placement: string;
  size: string;
  reference?: string;
  dates?: string;
  // Honeypot — real visitors never see this field. Never forwarded to the API.
  website?: string;
}

const REQUIRED_FIELDS: Array<keyof AppointmentPayload> = ["name", "contact", "idea", "placement", "size"];

// Mirrors the backend's own limits (StoreAppointmentRequest) — checked here
// too so an oversized submission is rejected before it even reaches the API,
// and so this route only ever forwards the fields it knows about.
const MAX_LENGTHS: Partial<Record<keyof AppointmentPayload, number>> = {
  name: 255,
  contact: 255,
  idea: 5000,
  placement: 255,
  size: 255,
  reference: 2000,
  dates: 255,
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 403 });
  }

  let payload: Partial<AppointmentPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  // Bot trap: a real visitor never fills this hidden field. Respond as if
  // the submission succeeded so an automated sender has no signal to react
  // to, but never write anything.
  if (payload.website && String(payload.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const missing = REQUIRED_FIELDS.filter(
    (key) => !payload[key] || String(payload[key]).trim() === "",
  );
  if (missing.length > 0) {
    return NextResponse.json({ error: "Eksik alanlar var.", missing }, { status: 400 });
  }

  const tooLong = (Object.keys(MAX_LENGTHS) as Array<keyof AppointmentPayload>).filter(
    (key) => typeof payload[key] === "string" && payload[key]!.length > MAX_LENGTHS[key]!,
  );
  if (tooLong.length > 0) {
    return NextResponse.json({ error: "Bir alan çok uzun.", tooLong }, { status: 400 });
  }

  // Forward only the known, validated fields — never the raw client payload.
  const forwarded = {
    name: payload.name,
    contact: payload.contact,
    idea: payload.idea,
    placement: payload.placement,
    size: payload.size,
    reference: payload.reference,
    dates: payload.dates,
  };

  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Passed through so the API's own per-IP rate limiting (throttle:5,1)
      // and the `ip` column it stores key on the actual visitor — nginx's
      // real_ip module resolves this to the true client before it ever
      // reaches this server (docker/nginx/default.conf), not this
      // container's own address.
      ...forwardedForHeader(request),
    },
    body: JSON.stringify(forwarded),
  });

  if (!res.ok) {
    // Only the API's own validation messages (422, produced by our own
    // rules) are safe to relay verbatim — anything else (5xx, rate limit,
    // ...) gets a generic message instead of whatever the backend returned.
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json({ error: body.message || "Geçersiz veri." }, { status: 422 });
    }

    return NextResponse.json({ error: "Randevu kaydedilemedi." }, { status: res.status === 429 ? 429 : 502 });
  }

  return NextResponse.json({ ok: true });
}
