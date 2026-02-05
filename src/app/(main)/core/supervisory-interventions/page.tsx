"use client";
import React from "react";
import { useSupervisoryInterventions } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SupervisoryIntervention } from "@/types/core";

export default function SupervisoryInterventionsPage() {
  const { data, isLoading } = useSupervisoryInterventions(1);
  const items =
    (Array.isArray(data) ? data : data?.results) ||
    ([] as SupervisoryIntervention[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Supervisory Interventions</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-amber-50 text-amber-700 hover:bg-amber-100"
          >
            New Intervention
          </Button>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">SMI</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: SupervisoryIntervention) => (
                <tr key={String(it.id)} className="border-t">
                  <td className="p-2">{it.smi?.company_name}</td>
                  <td className="p-2">{it.intervention_type}</td>
                  <td className="p-2">{it.status}</td>
                  <td className="p-2">
                    <Link href={`/core/supervisory-interventions/${it.id}`}>
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
