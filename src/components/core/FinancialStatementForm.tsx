import React, { useEffect, useState } from "react";
import type { FinancialStatement } from "@/types/core";
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

export default function FinancialStatementForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: FinancialStatement;
  onCancel?: () => void;
  onSave?: (data: Partial<FinancialStatement>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<FinancialStatement>>(
    initial || {
      smi_id: "",
      period: "",
      statement_type: "COMPREHENSIVE_INCOME",
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
        <Label>Type</Label>
        <Select
          value={form.statement_type ? String(form.statement_type) : "ANNUAL"}
          onValueChange={(val) => update("statement_type", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANNUAL">Annual</SelectItem>
            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
            <SelectItem value="COMPREHENSIVE_INCOME">Comprehensive Income</SelectItem>
            <SelectItem value="FINANCIAL_POSITION">Financial Position</SelectItem>
            <SelectItem value="CASH_FLOW">Cash Flow</SelectItem>
          </SelectContent>
        </Select>
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
