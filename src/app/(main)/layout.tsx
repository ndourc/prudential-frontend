"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainNav from "@/components/MainNav";
import SectionSidebar from "@/components/SectionSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Top decorative gradient bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />

      {/* Main Navigation */}
      <MainNav />

      {/* Content Container */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Section Sidebar (conditionally rendered) */}
          <SectionSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm min-h-[calc(100vh-10rem)] p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
