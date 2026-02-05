import React, { useEffect, useState } from "react";
import type { SMI } from "@/types/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SMIForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: SMI;
  onCancel?: () => void;
  onSave?: (data: Partial<SMI>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<SMI>>(
    initial || { company_name: "", license_number: "", status: "ACTIVE" }
  );

  const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Name</Label>
        <Input
          value={form.company_name as string}
          onChange={(e) => update("company_name", e.target.value)}
        />
      </div>
      <div>
        <Label>License Number</Label>
        <Input
          value={form.license_number as string}
          onChange={(e) => update("license_number", e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Input
          value={form.status as string}
          onChange={(e) => update("status", e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={!!isSubmitting}>
          Cancel
        </Button>
        <Button onClick={() => onSave?.(form)} disabled={!!isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
