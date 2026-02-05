
import React, { useState, useEffect } from "react";
import type { Shareholder } from "@/types/licensing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSMIs } from "@/hooks/useCoreSMIs";

export default function ShareholderForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Shareholder;
  onCancel?: () => void;
  onSave?: (data: Partial<Shareholder>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<Shareholder>>(
    initial || {
      smi_id: "",
      name: "",
      shareholder_type: "INDIVIDUAL",
      ownership_percentage: "0",
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
        <Label>Shareholder Type</Label>
        <Select
          value={form.shareholder_type ? String(form.shareholder_type) : "INDIVIDUAL"}
          onValueChange={(val) => update("shareholder_type", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
            <SelectItem value="CORPORATE">Corporate</SelectItem>
            <SelectItem value="GOVERNMENT">Government</SelectItem>
            <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
            <SelectItem value="FOREIGN">Foreign Entity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Nationality / Origin</Label>
        <Input
          value={form.nationality}
          onChange={(e) => update("nationality", e.target.value)}
        />
      </div>

      <div>
        <Label>Ownership Percentage (%)</Label>
        <Input
          type="number"
          step="0.01"
          max="100"
          value={form.ownership_percentage}
          onChange={(e) => update("ownership_percentage", e.target.value)}
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
