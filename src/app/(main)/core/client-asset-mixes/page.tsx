"use client";
import React, { useState } from "react";
import {
  useClientAssetMixes,
  useCreateClientAssetMix,
} from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import ClientAssetMixForm from "@/components/core/ClientAssetMixForm";
import { Loader2, AlertCircle } from "lucide-react";
import type { ClientAssetMix } from "@/types/core";

export default function ClientAssetMixesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, isError, error } = useClientAssetMixes(1);
  const createMix = useCreateClientAssetMix();
  const items =
    (Array.isArray(data) ? data : data?.results) || ([] as ClientAssetMix[]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading client asset mixes...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Client Asset Mixes</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load mixes"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Asset Mixes</h1>
        <div className="flex gap-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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
                <DialogTitle>New Client Asset Mix</DialogTitle>
                <DialogDescription>
                  Create a new client asset mix record
                </DialogDescription>
              </DialogHeader>
              <ClientAssetMixForm
                onCancel={() => setCreateOpen(false)}
                onSave={async (payload) => {
                  try {
                    await createMix.mutateAsync(payload as any);
                    setCreateOpen(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                isSubmitting={createMix.isPending}
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
                No client asset mixes found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first mix to get started
              </p>
              <Button onClick={() => setCreateOpen(true)} variant="outline">
                Add Mix
              </Button>
            </div>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">SMI</th>
                  <th className="p-2">Period</th>
                  <th className="p-2">Asset Class</th>
                  <th className="p-2">Allocation %</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i: ClientAssetMix) => (
                  <tr key={String(i.id)} className="border-t">
                    <td className="p-2">{i.smi?.company_name}</td>
                    <td className="p-2">{i.period}</td>
                    <td className="p-2">{i.asset_class}</td>
                    <td className="p-2">{i.allocation_percentage}</td>
                    <td className="p-2">
                      <Link href={`/core/client-asset-mixes/${i.id}`}>
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
