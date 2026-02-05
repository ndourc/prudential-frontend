import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ProxyResponse, ProxySuccessResponse, ComplianceReport } from "@/types/compliance";
import { isProxySuccess } from "@/types/compliance";
import { extractErrorMessage } from "@/lib/utils";

export default async function ReportDetails({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`/api/compliance/reports/${encodeURIComponent(params.id)}`, { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as unknown | null;
    if (!json) return <div className="p-6">Empty response</div>;

    const resp = json as ProxyResponse<ComplianceReport>;
    if (!isProxySuccess(resp)) {
      const message = extractErrorMessage(resp, "Unknown error") ?? "Unknown error";
      return <div className="p-6 text-red-600">{message}</div>;
    }

    const data = (resp as ProxySuccessResponse<ComplianceReport>).data;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Compliance Report: {params.id}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data, null, 2)}</pre> : <div>No report data</div>}
          </CardContent>
        </Card>
      </div>
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Compliance Report: {params.id}</h1>
        <p className="text-red-600">Error loading report: {message}</p>
      </div>
    );
  }
}
