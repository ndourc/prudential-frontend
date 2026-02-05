"use client";
import React from "react";
import { useFinancialStatement } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function FinancialStatementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: fs, isLoading } = useFinancialStatement(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Financial Statement</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : fs ? (
          <div className="space-y-2">
            <div>
              <strong>SMI:</strong> {fs.smi?.company_name}
            </div>
            <div>
              <strong>Period:</strong> {fs.period}
            </div>
            <div>
              <strong>Type:</strong> {fs.statement_type}
            </div>
            <div>
              <strong>Submitted:</strong> {fs.created_at}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
