"use client";
import React from "react";
import { useAuditLogs } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/types/core";

export default function AuditLogsPage() {
  const { data, isLoading } = useAuditLogs(1);
  const items =
    (Array.isArray(data) ? data : data?.results) || ([] as AuditLog[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Timestamp</th>
                <th className="p-2">User</th>
                <th className="p-2">IP/Agent</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: AuditLog) => (
                <tr key={String(it.id)} className="border-t">
                  <td className="p-2">{it.timestamp}</td>
                  <td className="p-2">{it.user}</td>
                  <td className="p-2">{it.ip_address || it.user_agent}</td>
                  <td className="p-2">
                    <Link href={`/core/audit-logs/${it.id}`}>
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
