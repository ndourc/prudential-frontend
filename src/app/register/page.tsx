"use client";
import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import apiClient from "@/lib/apiClient";

const slidingTexts = [
  "Secure compliance management for your organization",
  "Streamline regulatory reporting and oversight",
  "Real-time monitoring and risk assessment",
  "Comprehensive audit trails and documentation",
];

function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("ACCOUNTANT");
  const [smiId, setSmiId] = useState("");
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
    try {
      await apiClient.post("/api/auth/register/", {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        confirm_password: password2,
        role,
        smi_id: smiId || undefined,
      });
      router.push(next);
      router.refresh();
    } catch (e: any) {
      console.error("Registration error:", e);
      const errorMessage =
        e?.payload?.error ||
        e?.payload?.detail ||
        (typeof e?.payload === "string" ? e.payload : null) ||
        e.message ||
        "Registration failed";
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
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Join us to manage your compliance efficiently
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
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
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                    placeholder="Last name"
                    required
                  />
                </div>
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
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="password2"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                >
                  <option value="PRINCIPAL_OFFICER">Principal Officer</option>
                  <option value="ACCOUNTANT">SMI Data Entry</option>
                  <option value="COMPLIANCE_OFFICER">SMI Data Entry</option>
                  <option value="COMMISSION_ANALYST">Commission Analyst</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="smiId"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Company (SMI) ID{" "}
                  <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  id="smiId"
                  type="text"
                  value={smiId}
                  onChange={(e) => setSmiId(e.target.value)}
                  placeholder="SMI UUID"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-slate-900 hover:text-slate-700 font-medium underline"
              >
                Sign in
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
              Join Prudential Today
            </h2>
            <div className="h-28 relative">
              {slidingTexts.map((text, index) => (
                <p
                  key={index}
                  className={`text-xl text-white absolute inset-0 transition-all duration-700 ${
                    index === currentTextIndex
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
                <h3 className="font-semibold text-white mb-1">Quick Setup</h3>
                <p className="text-sm text-white">
                  Get started in minutes with our intuitive onboarding
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
                  Expert Support
                </h3>
                <p className="text-sm text-white">
                  24/7 support from our compliance experts
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
                  Scalable Solution
                </h3>
                <p className="text-sm text-white">
                  Grows with your organization&apos;s needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-4 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded w-60 mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
