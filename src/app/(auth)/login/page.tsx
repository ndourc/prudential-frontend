"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import apiClient from "@/lib/apiClient";
import React from "react";

// Define the success data structure to include the user's role
type LoginResponse = {
  access: string;
  role: "sme" | "admin" | string;
};

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  // next is now the default/fallback path if no role matches specific routes
  const defaultNext = search.get("next") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let redirectPath = defaultNext; // Initialize redirect path

    try {
      // Call the real API
      const { data } = await apiClient.post<LoginResponse>("/api/auth/login/", {
        username,
        password,
      });

      if (!data.access) {
        throw new Error("No access token received from server");
      }

      // --- Role-Based Redirection Logic ---
      const smeRoles = ["PRINCIPAL_OFFICER", "ACCOUNTANT", "COMPLIANCE_OFFICER", "SME", "sme"];
      const adminRoles = ["ADMIN", "admin", "SUPERUSER"];

      if (smeRoles.includes(data.role)) {
        redirectPath = "/company";
      } else if (adminRoles.includes(data.role)) {
        redirectPath = "/";
      } else {
        // Fallback for unknown role
        redirectPath = defaultNext;
      }

      localStorage.setItem("token", data.access);
      // Optional: Store the role for client-side use if needed
      localStorage.setItem("userRole", data.role);

      router.push(redirectPath);
      router.refresh();
    } catch (e: any) {
      console.error("Login error:", e);
      // Handle API errors (often nested in e.payload or just e.message)
      const errorMessage = e?.payload?.error || e?.payload?.detail || e.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 border rounded p-6"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-center">
          No account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-4 border rounded p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
