import React, { useEffect, useState } from "react";
import type { ClientAssetMix } from "@/types/core";
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

export default function ClientAssetMixForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: ClientAssetMix;
  onCancel?: () => void;
  onSave?: (data: Partial<ClientAssetMix>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<ClientAssetMix>>(
    initial || {
      smi_id: "",
      period: "",
      asset_class: "EQUITIES",
      allocation_percentage: "",
    }
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
        <Label>SMI</Label>
        <Select
          value={form.smi_id ? String(form.smi_id) : ""}
          onValueChange={(val) => update("smi_id", val)}
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
        <Label>Period</Label>
        <Input
          type="date"
          value={form.period as string}
          onChange={(e) => update("period", e.target.value)}
        />
      </div>
      <div>
        <Label>Asset Class</Label>
        <Select
          value={form.asset_class ? String(form.asset_class) : "EQUITIES"}
          onValueChange={(val) => update("asset_class", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Asset Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EQUITIES">Equities</SelectItem>
            <SelectItem value="FIXED_INCOME">Fixed Income</SelectItem>
            <SelectItem value="ALTERNATIVES">Alternatives</SelectItem>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
            <SelectItem value="COMMODITIES">Commodities</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Allocation %</Label>
        <Input
          value={form.allocation_percentage as any}
          onChange={(e) => update("allocation_percentage", e.target.value)}
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
