/**
 * Proxy route: /api/storage/... -> Laravel public/storage/...
 * Browsers request images relative to the site origin.
 * This route fetches the file from the Laravel backend and streams it back.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  (process.env.API_URL || "http://127.0.0.1:8000/api").replace(/\/api$/, "");

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const filePath = path.join("/");
  const backendUrl = `${BACKEND_URL}/storage/${filePath}`;

  let res: Response;
  try {
    res = await fetch(backendUrl, { cache: "no-store" });
  } catch {
    return new NextResponse("Backend unavailable", { status: 502 });
  }

  if (!res.ok) {
    return new NextResponse("Not found", { status: res.status });
  }

  const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}