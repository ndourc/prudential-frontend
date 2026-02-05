import React, { useState, useEffect } from "react";
import type { BoardMember } from "@/types/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSMIs } from "@/hooks/useCoreSMIs";

export default function BoardMemberForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: BoardMember;
  onCancel?: () => void;
  onSave?: (data: Partial<BoardMember>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<BoardMember>>(
    initial || { name: "", position: "", appointment_date: "", smi_id: "" }
  );

  const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const { data: smis } = useSMIs(1);
  const smiOptions = (Array.isArray(smis) ? smis : smis?.results) || [];

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={form.name as string}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Position</Label>
        <Input
          value={form.position as string}
          onChange={(e) => update("position", e.target.value)}
        />
      </div>
      <div>
        <Label>SMI</Label>
        <Select
          value={form.smi_id as string}
          onValueChange={(value) => update("smi_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select SMI" />
          </SelectTrigger>
          <SelectContent>
            {smiOptions.map((s: any) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Appointment Date</Label>
        <Input
          type="date"
          value={form.appointment_date as string}
          onChange={(e) => update("appointment_date", e.target.value)}
        />
      </div>
      <div>
        <Label>Resignation Date (optional)</Label>
        <Input
          type="date"
          value={(form.resignation_date as any) || ""}
          onChange={(e) => update("resignation_date", e.target.value)}
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
