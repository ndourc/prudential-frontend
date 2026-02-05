"use client";
import React from "react";
import { useAuditLog } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function AuditLogPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: log, isLoading } = useAuditLog(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : log ? (
          <div className="space-y-2">
            <div>
              <strong>User:</strong> {log.user}
            </div>
            <div>
              <strong>Action:</strong> {log.action}
            </div>
            <div>
              <strong>IP:</strong> {log.ip_address}
            </div>
            <div>
              <strong>Time:</strong> {log.timestamp}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
