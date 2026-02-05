"use client";
import React, { useState } from "react";
import { extractErrorMessage } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewReturnPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ title: "", period: "", description: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/returns/prudential-returns/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(extractErrorMessage(json, res.statusText ?? "Failed to create return") ?? res.statusText ?? "Failed to create return");
        return;
      }
      setResult(json?.data ?? json);
      setForm({ title: "", period: "", description: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Prudential Return</h2>
      <form className="space-y-4 max-w-lg" onSubmit={onSubmit}>
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label>Period</Label>
          <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <textarea className="w-full border px-3 py-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-medium">Created</h3>
           <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
