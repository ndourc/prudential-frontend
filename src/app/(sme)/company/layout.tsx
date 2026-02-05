import React from "react";

export const metadata = {
  title: "Institutional Profiling",
  description:
    "Complete and submit your institutional profile for offsite supervision.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Adopted the standard application module layout style
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <main className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                Institutional Profiling
              </h1>
              <p className="text-sm text-muted-foreground">
                Offsite institutional profile submission module for SMEs.
              </p>
            </div>
          </div>
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
}
