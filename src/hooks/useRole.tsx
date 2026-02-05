"use client";
import { useEffect, useState } from "react";

export function parseRoleFromCookie(cookieString?: string) {
  const cookies = cookieString ?? (typeof document !== 'undefined' ? document.cookie : '');
  const match = cookies.match(/(?:^|; )role=([^;]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export default function useRole() {
  const [role, setRole] = useState<string | null>(() => parseRoleFromCookie());

  useEffect(() => {
    setRole(parseRoleFromCookie());
    // no listener for cookie changes; if you need realtime updates, call setRole manually after login/logout
  }, []);

  return role;
}
