import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { extractErrorMessage } from "@/lib/utils";

export default async function ComplianceIndex() {
  try {
    const res = await fetch("/api/compliance/index", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!json) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Compliance Index</h1>
          <p className="text-red-600">Empty response</p>
        </div>
      );
    }

    if (json.ok === false) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Compliance Index</h1>
      <p className="text-red-600">{extractErrorMessage(json) ?? "Unknown error"}</p>
        </div>
      );
    }

    const data = json.data;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Compliance Index</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data, null, 2)}</pre> : <div>No data</div>}
          </CardContent>
        </Card>
      </div>
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Compliance Index</h1>
        <p className="text-red-600">Error loading index: {message}</p>
      </div>
    );
  }
}
