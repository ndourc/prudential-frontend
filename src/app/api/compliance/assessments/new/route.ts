import { NextRequest, NextResponse } from "next/server";
import { ProxyErrorResponse, ProxySuccessResponse } from "@/types/compliance";

export async function POST(req: NextRequest) {
  function getAuthHeader(r: NextRequest): string {
    let auth = r.headers.get("authorization") || "";
    if (!auth) {
      const token = r.cookies.get("access")?.value || r.cookies.get("token")?.value;
      if (token) auth = `Bearer ${token}`;
    }
    return auth;
  }

  function normalizeErrorResponse(status: number, body: unknown): { message: string } {
    const errorObj = body as Record<string, unknown> | null;
    const message = (errorObj?.detail as string) || (errorObj?.error as string) || (errorObj?.message as string) || "Unknown error";
    return { message };
  }

  try {
    const body = await req.json().catch(() => null);
    const backend = process.env.BACKEND_URL || "http://localhost:8000";
    const auth = getAuthHeader(req);

    const res = await fetch(`${backend}/compliance/assessments/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let json: unknown = null;
    try { json = JSON.parse(text); } catch {}

    if (res.ok) {
      const successResp: ProxySuccessResponse = { ok: true, status: res.status, data: json ?? null };
      return NextResponse.json(successResp, { status: res.status });
    }
    const errorResp: ProxyErrorResponse = { ok: false, status: res.status, error: normalizeErrorResponse(res.status, json) };
    return NextResponse.json(errorResp, { status: res.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Proxy error";
    const errorResp: ProxyErrorResponse = { ok: false, status: 500, error: { message } };
    return NextResponse.json(errorResp, { status: 500 });
  }
}
