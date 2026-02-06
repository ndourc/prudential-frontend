"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import React from "react";

// Define the success data structure to include the user's role
type LoginResponse = {
  access: string;
  role: "sme" | "admin" | string;
};

const slidingTexts = [
  "Secure compliance management for your organization",
  "Streamline regulatory reporting and oversight",
  "Real-time monitoring and risk assessment",
  "Comprehensive audit trails and documentation",
];

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const defaultNext = search.get("next") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % slidingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let redirectPath = defaultNext;

    try {
      const { data } = await apiClient.post<LoginResponse>("/api/auth/login/", {
        username,
        password,
      });

      if (!data.access) {
        throw new Error("No access token received from server");
      }

      const smeRoles = [
        "PRINCIPAL_OFFICER",
        "ACCOUNTANT",
        "COMPLIANCE_OFFICER",
        "SME",
        "sme",
      ];
      const adminRoles = ["ADMIN", "admin", "SUPERUSER"];

      if (smeRoles.includes(data.role)) {
        redirectPath = "/company";
      } else if (adminRoles.includes(data.role)) {
        redirectPath = "/";
      } else {
        redirectPath = defaultNext;
      }

      localStorage.setItem("token", data.access);
      localStorage.setItem("userRole", data.role);

      router.push(redirectPath);
      router.refresh();
    } catch (e: any) {
      console.error("Login error:", e);
      // Backend error response might be in e.payload.error or e.payload.detail
      const errorMessage =
        e?.payload?.error ||
        e?.payload?.detail ||
        (typeof e?.payload === "string" ? e.payload : null) ||
        e.message ||
        "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/seczim.svg"
              alt="Seczim Logo"
              width={240}
              height={80}
              className="h-55 w-auto"
              priority
            />
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="text-sm text-center text-slate-600">
              No account?{" "}
              <a
                href="/register"
                className="text-slate-900 hover:text-slate-700 font-medium underline"
              >
                Create one now
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding with Sliding Text */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#351f03] via-[#573611] to-[#4d310f] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Prudential Compliance Platform
            </h2>
            <div className="h-28 relative">
              {slidingTexts.map((text, index) => (
                <p
                  key={index}
                  className={`text-xl text-white absolute inset-0 transition-all duration-700 ${index === currentTextIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                    }`}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-6 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Advanced Security
                </h3>
                <p className="text-sm text-white">
                  Enterprise-grade encryption and access controls
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Automated Compliance
                </h3>
                <p className="text-sm text-white">
                  Stay compliant with automated reporting and alerts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Real-time Insights
                </h3>
                <p className="text-sm text-white">
                  Monitor your compliance status in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-4 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded w-60 mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
