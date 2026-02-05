import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, confirm_password, email, first_name, last_name, role, smi_id, phone_number, department, position } = body || {};
    if (!username || !password) {
      return NextResponse.json({ detail: 'username and password required' }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(`${backend}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirm_password, first_name, last_name, role, smi_id, phone_number, department, position }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    const response = NextResponse.json({ ok: true, user: json?.user }, { status: 201 });
    if (json?.access) {
      response.cookies.set('access', json.access, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 });
    }
    if (json?.refresh) {
      response.cookies.set('refresh', json.refresh, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 });
    }
    const roleCookie = role || json?.user?.role || json?.user?.profile?.role || '';
    if (roleCookie) {
      response.cookies.set('role', roleCookie, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 });
    }
    return response;
  } catch (e: any) {
    return NextResponse.json({ detail: 'Register proxy error', error: e?.message }, { status: 500 });
  }
}


