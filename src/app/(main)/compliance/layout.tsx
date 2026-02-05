import React from "react";

export const metadata = {
  title: "Compliance",
  description:
    "Compliance module — manage assessments, requirements, violations and reports",
};

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <main className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Compliance</h1>
              <p className="text-sm text-muted-foreground">
                Manage compliance assessments, requirements, violations and
                reports.
              </p>
            </div>
          </div>
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
}
