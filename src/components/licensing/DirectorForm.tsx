
import React, { useState, useEffect } from "react";
import type { Director } from "@/types/licensing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSMIs } from "@/hooks/useCoreSMIs";

export default function DirectorForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Director;
  onCancel?: () => void;
  onSave?: (data: Partial<Director>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<Director>>(
    initial || {
      smi_id: "",
      name: "",
      director_type: "EXECUTIVE",
      appointment_date: "",
    }
  );

  const { data: smis } = useSMIs(1);
  const smiOptions = (Array.isArray(smis) ? smis : smis?.results) || [];

  const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  return (
    <div className="space-y-4">
      <div>
        <Label>SMI</Label>
        <Select
          value={form.smi_id ? String(form.smi_id) : ""}
          onValueChange={(val) => update("smi_id", val)}
          disabled={!!initial?.id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select SMI" />
          </SelectTrigger>
          <SelectContent>
            {smiOptions.map((s: any) => (
              <SelectItem key={String(s.id)} value={String(s.id)}>
                {s.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div>
        <Label>Director Type</Label>
        <Select
          value={form.director_type ? String(form.director_type) : "EXECUTIVE"}
          onValueChange={(val) => update("director_type", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXECUTIVE">Executive</SelectItem>
            <SelectItem value="NON_EXECUTIVE">Non-Executive</SelectItem>
            <SelectItem value="INDEPENDENT">Independent</SelectItem>
            <SelectItem value="CHAIRMAN">Chairman</SelectItem>
            <SelectItem value="CEO">CEO</SelectItem>
            <SelectItem value="CFO">CFO</SelectItem>
            <SelectItem value="COO">COO</SelectItem>
            <SelectItem value="CRO">CRO</SelectItem>
            <SelectItem value="CCO">CCO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Appointment Date</Label>
        <Input
          type="date"
          value={form.appointment_date}
          onChange={(e) => update("appointment_date", e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={() => onSave?.(form)} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
