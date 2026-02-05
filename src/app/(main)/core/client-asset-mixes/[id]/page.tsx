"use client";
import React from "react";
import { useClientAssetMix } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function ClientAssetMixPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: item, isLoading } = useClientAssetMix(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Asset Mix</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : item ? (
          <div className="space-y-2">
            <div>
              <strong>SMI:</strong> {item.smi?.company_name}
            </div>
            <div>
              <strong>Period:</strong> {item.period}
            </div>
            <div>
              <strong>Asset Class:</strong> {item.asset_class}
            </div>
            <div>
              <strong>Allocation %:</strong> {item.allocation_percentage}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
