import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const dataRaw = form.get('data');
    if (!dataRaw || typeof dataRaw !== 'string') {
      return NextResponse.json({ detail: 'Missing data payload' }, { status: 400 });
    }
    const payload = JSON.parse(dataRaw);

    // Forward Authorization header if present, else try cookie 'token' or 'access'
    let auth = req.headers.get('authorization') || '';
    if (!auth) {
      const cookieToken = req.cookies.get('token')?.value || req.cookies.get('access')?.value;
      if (cookieToken) auth = `Bearer ${cookieToken}`;
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(`${backendUrl}/api/v1/smi-submission/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch {}

    return new NextResponse(json ? JSON.stringify(json) : text, {
      status: res.status,
      headers: { 'Content-Type': json ? 'application/json' : 'text/plain' },
    });
  } catch (e: any) {
    return NextResponse.json({ detail: 'Proxy error', error: e?.message }, { status: 500 });
  }
}


