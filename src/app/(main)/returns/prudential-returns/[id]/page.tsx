"use client";
import React, { useState } from "react";
import { extractErrorMessage } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReturnDetails({ params }: { params: { id: string } }) {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/returns/prudential-returns/${encodeURIComponent(params.id)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        if (j?.ok === false) {
          setError(extractErrorMessage(j, "Error fetching return") ?? "Error fetching return");
          return;
        }
        setData(j?.data ?? j);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [params.id]);

  const action = async (verb: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/returns/prudential-returns/${encodeURIComponent(params.id)}/${verb}`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(extractErrorMessage(json, res.statusText ?? "Action failed") ?? res.statusText ?? "Action failed");
        return;
      }
      setData(json?.data ?? json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Return Details</h2>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div>
              {data ? <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data, null, 2)}</pre> : <div>No data</div>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => action("approve_return")} variant="secondary">Approve</Button>
        <Button onClick={() => action("reject_return")} variant="destructive">Reject</Button>
        <Button onClick={() => action("submit_return")} >Submit</Button>
      </div>
    </div>
  );
}
