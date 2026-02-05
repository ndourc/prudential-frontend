import React from "react";

export const metadata = {
  title: "Prudential Returns",
  description:
    "Manage prudential returns, income statements and balance sheets",
};

export default function ReturnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <main className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Prudential Returns</h1>
          <p className="text-sm text-muted-foreground">
            Manage returns, review financial statements and submissions.
          </p>
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
} // The function definition is correctly closed here.
// The duplicate definition has been removed.
