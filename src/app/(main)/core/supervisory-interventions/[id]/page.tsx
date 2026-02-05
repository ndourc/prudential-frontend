"use client";
import React from "react";
import { useSupervisoryIntervention } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function SupervisoryInterventionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: intervention, isLoading } = useSupervisoryIntervention(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Intervention</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : intervention ? (
          <div className="space-y-2">
            <div>
              <strong>SMI:</strong> {intervention.smi?.company_name}
            </div>
            <div>
              <strong>Type:</strong> {intervention.intervention_type}
            </div>
            <div>
              <strong>Status:</strong> {intervention.status}
            </div>
            <div>
              <strong>Assigned:</strong> {intervention.assigned_to}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
