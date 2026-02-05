"use client";
import React, { useState } from "react";
import { useSMIs, useCreateSMI } from "@/hooks/useCoreSMIs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SMIForm from "@/components/core/SMIForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SMIsPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error } = useSMIs(1);
  const createSMI = useCreateSMI();

  const items = (Array.isArray(data) ? data : data?.results) || [];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading SMIs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">SMIs</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load SMIs"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-50 rounded-md">
            <span className="text-amber-600 font-bold">SMI</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">SMIs</h1>
            <p className="text-sm text-muted-foreground">
              Manage supervised market intermediaries
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                New SMI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New SMI</DialogTitle>
                <DialogDescription>
                  Create a supervised market intermediary
                </DialogDescription>
              </DialogHeader>
              <SMIForm
                onCancel={() => setOpen(false)}
                onSave={async (payload) => {
                  try {
                    await createSMI.mutateAsync(payload as any);
                    setOpen(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                isSubmitting={createSMI.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Company</th>
                <th className="p-2">License</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.company_name}</td>
                  <td className="p-2">{s.license_number}</td>
                  <td className="p-2">
                    <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <Link href={`/core/smis/${s.id}`}>
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
      </Card>
    </div>
  );
}
