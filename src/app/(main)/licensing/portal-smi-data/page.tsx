"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { usePortalSMIData } from "@/hooks/usePortalSMIData";

export default function PortalSMIDataPage() {
  const { data, isLoading } = usePortalSMIData(1);
  const items = (data && (data as any).results) || (data as any) || [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Portal SMI Data</h1>
      <Card>
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No synced data available. Go to <a href="/licensing/portal-integration" className="text-primary underline">Portal Integrations</a> to sync data.
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Portal ID</th>
                <th className="p-3">SMI</th>
                <th className="p-3">Portal status</th>
                <th className="p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{it.portal_id}</td>
                  <td className="p-3">{it.smi?.company_name || it.smi_id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${it.portal_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {it.portal_status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {it.last_updated_from_portal ? new Date(it.last_updated_from_portal).toLocaleDateString() : 'N/A'}
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
