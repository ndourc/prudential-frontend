
import React, { useState, useEffect } from "react";
import type { InstitutionalProfile } from "@/types/licensing";
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

export default function InstitutionalProfileForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: InstitutionalProfile;
  onCancel?: () => void;
  onSave?: (data: Partial<InstitutionalProfile>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<any>>(
    initial || {
      smi_id: "",
      business_model: "",
      competitive_position: "MID_TIER",
      financial_strength: "SATISFACTORY",
      risk_appetite: "MODERATE",
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
          disabled={!!initial?.id} // Disable if editing existing profile
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
        <Label>Business Model</Label>
        <Input
          value={form.business_model}
          onChange={(e) => update("business_model", e.target.value)}
          placeholder="Describe business model"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Competitive Position</Label>
          <Select
            value={form.competitive_position}
            onValueChange={(val) => update("competitive_position", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MARKET_LEADER">Market Leader</SelectItem>
              <SelectItem value="MAJOR_PLAYER">Major Player</SelectItem>
              <SelectItem value="MID_TIER">Mid-Tier</SelectItem>
              <SelectItem value="SMALL_PLAYER">Small Player</SelectItem>
              <SelectItem value="NICHE">Niche Player</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Financial Strength</Label>
          <Select
            value={form.financial_strength}
            onValueChange={(val) => update("financial_strength", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Strength" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXCELLENT">Excellent</SelectItem>
              <SelectItem value="GOOD">Good</SelectItem>
              <SelectItem value="SATISFACTORY">Satisfactory</SelectItem>
              <SelectItem value="WEAK">Weak</SelectItem>
              <SelectItem value="POOR">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Risk Appetite</Label>
        <Select
          value={form.risk_appetite}
          onValueChange={(val) => update("risk_appetite", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Appetite" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONSERVATIVE">Conservative</SelectItem>
            <SelectItem value="MODERATE">Moderate</SelectItem>
            <SelectItem value="AGGRESSIVE">Aggressive</SelectItem>
            <SelectItem value="VERY_AGGRESSIVE">Very Aggressive</SelectItem>
          </SelectContent>
        </Select>
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
