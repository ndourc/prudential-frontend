"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createAssessmentSchema, type CreateAssessmentInput } from "@/schema/compliance";
import { extractErrorMessage } from "@/lib/utils";
import type { ProxyResponse, ComplianceAssessment } from "@/types/compliance";
import { isProxySuccess } from "@/types/compliance";

export default function NewAssessmentPage() {
  const [loading, setLoading] = useState(false);
  // result holds the created assessment or a raw object returned by the proxy
  const [result, setResult] = useState<ComplianceAssessment | Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAssessmentInput>({ title: "", details: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const parsed = createAssessmentSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      // zod's ZodError exposes `issues` (array of ZodIssue)
      parsed.error.issues.forEach((issue) => {
        if (issue.path && issue.path.length > 0) errs[String(issue.path[0])] = issue.message;
      });
      setFieldErrors(errs);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/compliance/assessments/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = (await res.json().catch(() => null)) as unknown | null;
      const resp = json as ProxyResponse<ComplianceAssessment> | null;

      // If the HTTP response code indicates failure, try to extract an error from the body
      if (!res.ok) {
        const message = resp && !isProxySuccess(resp) ? extractErrorMessage(resp) ?? String(json) : res.statusText ?? "Failed to create assessment";
        setError(message);
        return;
      }

      // If backend returned a proxy-shaped error
      if (resp && !isProxySuccess(resp)) {
        setError(extractErrorMessage(resp, "Failed to create assessment") ?? "Failed to create assessment");
        return;
      }

      const data = resp && isProxySuccess(resp) ? resp.data : (json as Record<string, unknown> | null);
      setResult(data ?? null);
      setForm({ title: "", details: "" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Assessment</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          {fieldErrors.title && <div className="text-sm text-red-600">{fieldErrors.title}</div>}
        </div>
        <div>
          <Label>Details</Label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={form.details}
            onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
          />
          {fieldErrors.details && <div className="text-sm text-red-600">{fieldErrors.details}</div>}
        </div>
        <div>
          <Button disabled={loading} type="submit">
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-medium">Created</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
