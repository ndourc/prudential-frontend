"use client";
import React from "react";
import { useBoardMembers } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import coreAPI from "@/service/core";

export default function BoardMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: bm, isLoading } = useQuery({
    queryKey: ["board-member", id],
    queryFn: async () => coreAPI.getBoardMember(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Board Member</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : bm ? (
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> {bm.name}
            </div>
            <div>
              <strong>Position:</strong> {bm.position}
            </div>
            <div>
              <strong>Appointment:</strong> {bm.appointment_date}
            </div>
            <div>
              <strong>Resignation:</strong> {bm.resignation_date ?? "—"}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
