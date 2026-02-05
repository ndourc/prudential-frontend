import React, { useState, useEffect } from "react";
import type { RiskTrend } from "@/types/riskAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSMIs } from "@/hooks/useCoreSMIs";
import { Loader2 } from "lucide-react";

const RISK_LEVELS = [
  { value: "IMPROVED", label: "Improved" },
  { value: "STABLE", label: "Stable" },
  { value: "DETERIORATED", label: "Deteriorated" },
  { value: "CRITICAL", label: "Critical Deterioration" },
];

const PERFORMANCE_OPTIONS = [
  { value: "POSITIVE", label: "Positive" },
  { value: "NEUTRAL", label: "Neutral" },
  { value: "NEGATIVE", label: "Negative" },
];

export default function TrendForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Partial<RiskTrend>;
  onCancel?: () => void;
  onSave?: (data: Partial<RiskTrend>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<RiskTrend>>(
    initial || {
      smi_id: "",
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      period_end: new Date().toISOString().split("T")[0],
      risk_score_change: 0,
      risk_level_change: "STABLE",
      financial_performance: "NEUTRAL",
      compliance_performance: "NEUTRAL",
      key_factors: "",
    }
  );

  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof RiskTrend>(k: K, v: RiskTrend[K]) => {
    setError(null);
    setForm((s) => ({ ...s, [k]: v }));
  };

  const { data: smis, isLoading: isLoadingSMIs } = useSMIs(1);
  const smiOptions = (Array.isArray(smis) ? smis : smis?.results) || [];

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.smi_id) {
      setError("SMI is required");
      return;
    }
    if (!form.period_start) {
      setError("Period start date is required");
      return;
    }
    if (!form.period_end) {
      setError("Period end date is required");
      return;
    }
    if (form.period_end <= form.period_start) {
      setError("Period end date must be after period start date");
      return;
    }

    onSave?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="smi_id">SMI *</Label>
        <Select
          value={form.smi_id || ""}
          onValueChange={(value) => update("smi_id", value as string)}
          disabled={isLoadingSMIs || !!initial?.id}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoadingSMIs ? "Loading SMIs..." : "Select SMI"}
            />
          </SelectTrigger>
          <SelectContent>
            {smiOptions
              .filter((s: { id?: string | number; company_name: string }) => s.id !== undefined)
              .map((s: { id?: string | number; company_name: string }) => (
                <SelectItem key={String(s.id)} value={String(s.id)}>
                  {s.company_name} ({String(s.id).substring(0, 8)}...)
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="period_start">Period Start *</Label>
          <Input
            id="period_start"
            type="date"
            value={form.period_start as string}
            onChange={(e) => update("period_start", e.target.value as string)}
            required
          />
        </div>
        <div>
          <Label htmlFor="period_end">Period End *</Label>
          <Input
            id="period_end"
            type="date"
            value={form.period_end as string}
            onChange={(e) => update("period_end", e.target.value as string)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="risk_score_change">Risk Score Change</Label>
          <Input
            id="risk_score_change"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.risk_score_change || ""}
            onChange={(e) =>
              update("risk_score_change", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="risk_level_change">Risk Level Change</Label>
          <Select
            value={form.risk_level_change || "STABLE"}
            onValueChange={(value) => update("risk_level_change", value as RiskTrend["risk_level_change"])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              {RISK_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Performance Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="financial_performance">
              Financial Performance
            </Label>
            <Select
              value={form.financial_performance || "NEUTRAL"}
              onValueChange={(value) =>
                update("financial_performance", value as RiskTrend["financial_performance"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select performance" />
              </SelectTrigger>
              <SelectContent>
                {PERFORMANCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="compliance_performance">
              Compliance Performance
            </Label>
            <Select
              value={form.compliance_performance || "NEUTRAL"}
              onValueChange={(value) =>
                update("compliance_performance", value as RiskTrend["compliance_performance"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select performance" />
              </SelectTrigger>
              <SelectContent>
                {PERFORMANCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="key_factors">Key Factors Contributing to Changes</Label>
        <Textarea
          id="key_factors"
          placeholder="Document the key factors that contributed to the risk changes..."
          value={form.key_factors || ""}
          onChange={(e) => update("key_factors", e.target.value as string)}
          className="min-h-24"
        />
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={!!isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!!isSubmitting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            `${initial?.id ? "Update" : "Create"} Trend Analysis`
          )}
        </Button>
      </div>
    </form>
  );
}
