import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body || {};
    if (!username || !password) {
      return NextResponse.json({ detail: 'username and password required' }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(`${backend}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    // Try to derive role from a /api/auth/me or from login response if available
    // Here we default to no role unless backend augments login payload later
    // You can change this to call /api/auth/me
    const role = json?.user?.role || json?.user?.profile?.role || '';

    const response = NextResponse.json({ ok: true, user: json?.user }, { status: 200 });
    if (json?.access) {
      response.cookies.set('access', json.access, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 });
    }
    if (json?.refresh) {
      response.cookies.set('refresh', json.refresh, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 });
    }
    if (role) {
      response.cookies.set('role', role, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 });
    }
    return response;
  } catch (e: any) {
    return NextResponse.json({ detail: 'Login proxy error', error: e?.message }, { status: 500 });
  }
}


