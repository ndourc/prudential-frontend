"use client";
import React, { useEffect, useState } from "react";
import { extractErrorMessage } from "@/lib/utils";
import useRole from "@/hooks/useRole";
import { AssessmentCreateRoles, isRole } from "@/config/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Assessment = { id: string; title: string; details?: string };

export default function AssessmentsClient() {
  const role = useRole();
  const [items, setItems] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allowedCreateRoles = AssessmentCreateRoles;
  const canCreate = role && isRole(role) ? allowedCreateRoles.includes(role) : false;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    if (filter) params.set("q", filter);

    fetch(`/api/compliance/assessments?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (!json) {
          setError("Empty response from server");
          return;
        }
        if (json.ok === false) {
          setError(extractErrorMessage(json, "Error fetching assessments") ?? "Error fetching assessments");
          return;
        }
        setItems(Array.isArray(json.data) ? json.data : json.data?.results ?? []);
      })
      .catch((e) => setError(e?.message || String(e)))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [page, pageSize, filter]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Assessments</CardTitle>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search assessments" value={filter} onChange={(e) => setFilter(e.target.value)} />
          {canCreate ? (
            <Button asChild>
              <a href="/compliance/assessments/new">Create</a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="You don't have permission to create assessments">Create</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid gap-3">
            {items.length === 0 && <div className="text-muted-foreground">No assessments found.</div>}
            {items.map((it) => (
              <div key={it.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{it.title}</div>
                  {it.details && <div className="text-sm text-muted-foreground">{it.details}</div>}
                </div>
                <div>
                  <a className="text-blue-600" href={`/compliance/reports/${it.id}`}>View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <div>Page {page}</div>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
