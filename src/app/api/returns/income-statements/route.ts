import { NextRequest, NextResponse } from "next/server";

const getAuthHeader = (req: NextRequest): string => {
  let auth = req.headers.get("authorization") || "";
  if (!auth) {
    const token = req.cookies.get("access")?.value || req.cookies.get("token")?.value;
    if (token) auth = `Bearer ${token}`;
  }
  return auth;
};

function normalizeErrorResponse(status: number, body: unknown): { message: string } {
  const errorObj = (body as Record<string, unknown>) ?? null;
  const message = (errorObj?.detail as string) || (errorObj?.error as string) || (errorObj?.message as string) || "Unknown error";
  return { message };
}

export async function GET(req: NextRequest) {
  try {
    const backend = process.env.BACKEND_URL || "http://localhost:8000";
    const auth = getAuthHeader(req);
    const url = new URL(`${backend}/returns/income-statements`);
    req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), { method: "GET", headers: { ...(auth ? { Authorization: auth } : {}) } });
    const text = await res.text();
    let json: unknown = null;
    try { json = JSON.parse(text); } catch {}

    if (res.ok) return NextResponse.json({ ok: true, status: res.status, data: json ?? text }, { status: res.status });
    return NextResponse.json({ ok: false, status: res.status, error: normalizeErrorResponse(res.status, json) }, { status: res.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Proxy error";
    return NextResponse.json({ ok: false, status: 500, error: { message } }, { status: 500 });
  }
}
