import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorMessage(obj: unknown, fallback?: string): string | undefined {
  if (!obj || typeof obj !== "object") return fallback;
  const o = obj as Record<string, any>;
  // Try common shapes: { error: { message } }, { message }, { detail }
  if (o.error && typeof o.error === "object") {
    const m = o.error.message ?? o.error.detail ?? o.error.error;
    if (m != null) return String(m);
  }
  if (o.message) return String(o.message);
  if (o.detail) return String(o.detail);
  return fallback;
}
