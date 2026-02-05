import React, { useState, useEffect } from "react";
import type { RiskIndicator } from "@/types/riskAssessment";
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
import { Loader2 } from "lucide-react";

const INDICATOR_TYPES = [
  { value: "FINANCIAL", label: "Financial Indicator" },
  { value: "OPERATIONAL", label: "Operational Indicator" },
  { value: "MARKET", label: "Market Indicator" },
  { value: "REGULATORY", label: "Regulatory Indicator" },
];

const TRENDS = [
  { value: "IMPROVING", label: "Improving" },
  { value: "STABLE", label: "Stable" },
  { value: "DETERIORATING", label: "Deteriorating" },
  { value: "CRITICAL", label: "Critical" },
];

const ALERT_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export default function RiskIndicatorForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Partial<RiskIndicator>;
  onCancel?: () => void;
  onSave?: (data: Partial<RiskIndicator>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<RiskIndicator>>(
    initial || {
      smi_id: "",
      indicator_date: new Date().toISOString().split("T")[0],
      indicator_type: "FINANCIAL",
      indicator_name: "",
      current_value: 0,
      threshold_value: 0,
      trend: "STABLE",
      is_breached: false,
      alert_level: "LOW",
    }
  );

  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof RiskIndicator, v: string | number | boolean | Date) => {
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
    if (!form.indicator_name) {
      setError("Indicator name is required");
      return;
    }
    if (form.current_value === undefined || form.current_value === null) {
      setError("Current value is required");
      return;
    }
    if (form.threshold_value === undefined || form.threshold_value === null) {
      setError("Threshold value is required");
      return;
    }

    // Check if current value breaches threshold
    const isBreached = form.current_value > form.threshold_value;
    const updatedForm = {
      ...form,
      is_breached: isBreached,
    };

    onSave?.(updatedForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="smi_id">SMI *</Label>
        <Select
          value={form.smi_id || ""}
          onValueChange={(value) => update("smi_id", value)}
          disabled={!!initial?.id || isLoadingSMIs}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoadingSMIs ? "Loading SMIs..." : "Select SMI"}
            />
          </SelectTrigger>
          <SelectContent>
            {smiOptions.map((s: { id?: string; company_name: string }) => (
              <SelectItem key={String(s.id ?? "")} value={String(s.id ?? "")}>
                {s.company_name} ({String(s.id ?? "").substring(0, 8)}...)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="indicator_date">Indicator Date</Label>
          <Input
            id="indicator_date"
            type="date"
            value={form.indicator_date as string}
            onChange={(e) => update("indicator_date", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="indicator_type">Indicator Type *</Label>
          <Select
            value={form.indicator_type || "FINANCIAL"}
            onValueChange={(value) => update("indicator_type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {INDICATOR_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="indicator_name">Indicator Name *</Label>
        <Input
          id="indicator_name"
          type="text"
          placeholder="e.g., Capital Adequacy Ratio, Liquidity Coverage Ratio"
          value={form.indicator_name || ""}
          onChange={(e) => update("indicator_name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="current_value">Current Value *</Label>
          <Input
            id="current_value"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.current_value || ""}
            onChange={(e) => update("current_value", Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="threshold_value">Threshold Value *</Label>
          <Input
            id="threshold_value"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.threshold_value || ""}
            onChange={(e) => update("threshold_value", Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trend">Trend</Label>
          <Select
            value={form.trend || "STABLE"}
            onValueChange={(value) => update("trend", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trend" />
            </SelectTrigger>
            <SelectContent>
              {TRENDS.map((trend) => (
                <SelectItem key={trend.value} value={trend.value}>
                  {trend.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="alert_level">Alert Level</Label>
          <Select
            value={form.alert_level || "LOW"}
            onValueChange={(value) => update("alert_level", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select alert level" />
            </SelectTrigger>
            <SelectContent>
              {ALERT_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
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
            `${initial?.id ? "Update" : "Create"} Indicator`
          )}
        </Button>
      </div>
    </form>
  );
}
