import React, { useState, useEffect } from "react";
import type { RiskAssessment } from "@/types/riskAssessment";
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

const RISK_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM_LOW", label: "Medium Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "MEDIUM_HIGH", label: "Medium High" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const ASSESSMENT_PERIODS = [
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUAL", label: "Annual" },
  { value: "AD_HOC", label: "Ad-Hoc" },
];

export default function AssessmentForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Partial<RiskAssessment>;
  onCancel?: () => void;
  onSave?: (data: Partial<RiskAssessment>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<RiskAssessment>>(
    initial || {
      smi_id: "",
      assessment_date: "",
      assessment_period: "QUARTERLY",
      status: "PENDING",
    }
  );

  const update = (k: keyof RiskAssessment, v: any) =>
    setForm((s) => ({ ...s, [k]: v }));

  const { data: smis, isLoading: isLoadingSMIs } = useSMIs(1);
  const smiOptions = (Array.isArray(smis) ? smis : smis?.results) || [];

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="smi_id">SMI *</Label>
        <Select
          value={form.smi_id}
          onValueChange={(value) => update("smi_id", value)}
          disabled={!!initial?.id || isLoadingSMIs}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoadingSMIs ? "Loading SMIs..." : "Select SMI"}
            />
          </SelectTrigger>
          <SelectContent>
            {smiOptions.map((s: any) => (
              <SelectItem key={String(s.id)} value={String(s.id)}>
                {s.company_name} ({String(s.id).substring(0, 8)}...)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assessment_date">Assessment Date</Label>
          <Input
            id="assessment_date"
            type="date"
            value={form.assessment_date as string}
            onChange={(e) => update("assessment_date", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="assessment_period">Period</Label>
          <Select
            value={form.assessment_period}
            onValueChange={(value) =>
              update(
                "assessment_period",
                value as RiskAssessment["assessment_period"]
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {ASSESSMENT_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Risk Scores (Manually editable or populated by recalculate_scores) */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">
        Risk Scores (0-100)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="inherent_risk_score">Inherent Risk</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.inherent_risk_score}
            onChange={(e) =>
              update("inherent_risk_score", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="operational_risk_score">Operational Risk</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.operational_risk_score}
            onChange={(e) =>
              update("operational_risk_score", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="market_risk_score">Market Risk</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.market_risk_score}
            onChange={(e) =>
              update("market_risk_score", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="credit_risk_score">Credit Risk</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.credit_risk_score}
            onChange={(e) =>
              update("credit_risk_score", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="compliance_score">Compliance Score</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.compliance_score}
            onChange={(e) => update("compliance_score", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="fsi_score">FSI Score</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.fsi_score}
            onChange={(e) => update("fsi_score", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Ratios */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">Key Ratios</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="car">CAR (%)</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={form.car}
            onChange={(e) => update("car", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="liquidity_ratio">Liquidity Ratio</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={form.liquidity_ratio!}
            onChange={(e) => update("liquidity_ratio", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="leverage_ratio">Leverage Ratio</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={form.leverage_ratio!}
            onChange={(e) => update("leverage_ratio", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) =>
            update("status", value as RiskAssessment["status"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {["PENDING", "IN_PROGRESS", "COMPLETED", "REVIEW_REQUIRED"].map(
              (s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
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
            "Save Assessment"
          )}
        </Button>
      </div>
    </form>
  );
}
