"use client";
import React, { useState } from "react";
import {
  useFinancialStatements,
  useCreateFinancialStatement,
} from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FinancialStatementForm from "@/components/core/FinancialStatementForm";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { FinancialStatement } from "@/types/core";

export default function FinancialStatementsPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error } = useFinancialStatements(1);
  const createFS = useCreateFinancialStatement();
  const items =
    (Array.isArray(data) ? data : data?.results) ||
    ([] as FinancialStatement[]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading financial statements...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Financial Statements</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load records"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Financial Statements</h1>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Financial Statement</DialogTitle>
                <DialogDescription>Create a new statement</DialogDescription>
              </DialogHeader>
              <FinancialStatementForm
                onCancel={() => setOpen(false)}
                onSave={async (payload) => {
                  try {
                    await createFS.mutateAsync(payload as any);
                    setOpen(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                isSubmitting={createFS.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        <div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No financial statements found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first financial statement.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Add Statement
              </Button>
            </div>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">SMI</th>
                  <th className="p-2">Period</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((fs: FinancialStatement) => (
                  <tr key={String(fs.id)} className="border-t">
                    <td className="p-2">{fs.smi?.company_name}</td>
                    <td className="p-2">{fs.period}</td>
                    <td className="p-2">{fs.statement_type}</td>
                    <td className="p-2">
                      <Link href={`/core/financial-statements/${fs.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
