export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(opts.headers || {});

  if (token && token !== "undefined" && token !== "null") {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Default to the production backend; override with NEXT_PUBLIC_API_BASE in env
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://prudential.up.railway.app";

  // Normalize base and path to avoid duplicate slashes like '/api//api/...'
  const normalizeBase = (b: string) => b.replace(/\/+$|\s+/g, "");
  const normalizePath = (p: string) => {
    if (!p) return "/";
    // If full URL provided, use as-is
    if (/^https?:\/\//i.test(p)) return p;
    // Ensure single leading slash
    return p.startsWith("/") ? p : `/${p}`;
  };

  const base = normalizeBase(API_BASE);
  const resolved = /^https?:\/\//i.test(path) ? path : `${base}${normalizePath(path)}`;
  const res = await fetch(resolved, { ...opts, headers });

  const contentType = res.headers.get("Content-Type") || "";
  let payload: any = null;
  if (contentType.includes("application/json")) {
    try {
      payload = await res.json();
    } catch (err) {
      // Server claimed JSON but returned invalid JSON (often HTML error page).
      // Fall back to text so callers can see the raw response for debugging.
      try {
        const raw = await res.text();
        payload = { __raw: raw };
      } catch {
        payload = null;
      }
    }
  } else {
    try {
      payload = await res.text();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${res.statusText}`);
    (err as any).status = res.status;
    (err as any).payload = payload;
    throw err;
  }

  return payload;
}

export default apiFetch;
