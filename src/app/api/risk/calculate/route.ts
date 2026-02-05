import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const idRaw = form.get('submissionId');
    if (!idRaw) return NextResponse.json({ detail: 'submissionId required' }, { status: 400 });
    const submissionId = Number(idRaw);
    if (!Number.isFinite(submissionId)) return NextResponse.json({ detail: 'Invalid submissionId' }, { status: 400 });

    let auth = req.headers.get('authorization') || '';
    if (!auth) {
      const token = req.cookies.get('token')?.value || req.cookies.get('access')?.value;
      if (token) auth = `Bearer ${token}`;
    }

    const backend = process.env.BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(`${backend}/api/v1/submissions/${submissionId}/calculate-risk/`, {
      method: 'POST',
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
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


