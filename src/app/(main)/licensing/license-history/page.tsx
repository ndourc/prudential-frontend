"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { useLicenseHistory } from "@/hooks/useLicenseHistory";

export default function LicenseHistoryPage() {
  const { data, isLoading } = useLicenseHistory(1);
  const items = (data && (data as any).results) || (data as any) || [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">License History</h1>
      <Card>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="p-2">License Number</th>
                <th className="p-2">Change Type</th>
                <th className="p-2">Change Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2">{it.license_number}</td>
                  <td className="p-2">{it.change_type}</td>
                  <td className="p-2">{it.change_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
