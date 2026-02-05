"use client";
import React from "react";
import { useClienteleProfile } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function ClienteleProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: profile, isLoading } = useClienteleProfile(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientele Profile</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : profile ? (
          <div className="space-y-2">
            <div>
              <strong>Company:</strong> {profile.company_name}
            </div>
            <div>
              <strong>License:</strong> {profile.license_number}
            </div>
            <div>
              <strong>Business model:</strong> {profile.business_model}
            </div>
            <div>
              <strong>Status:</strong> {profile.status}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
