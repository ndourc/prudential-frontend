import React from "react";

export default function RiskAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Uses main layout to handle structure
  return (
    <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {children}
    </div>
  );
}
