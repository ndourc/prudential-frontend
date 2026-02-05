import React, { useState, useEffect } from "react";
import type { StressTest } from "@/types/riskAssessment";
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

const TEST_TYPES = [
  { value: "SMI_LEVEL", label: "SMI Level" },
  { value: "INDUSTRY_LEVEL", label: "Industry Level" },
  { value: "SCENARIO", label: "Scenario Based" },
];

type SMIOption = {
  id: string | number;
  company_name: string;
};

export default function StressTestForm({
  initial,
  onCancel,
  onSave,
  isSubmitting,
}: {
  initial?: Partial<StressTest>;
  onCancel?: () => void;
  onSave?: (data: Partial<StressTest>) => void;
  isSubmitting?: boolean;
}) {
  const [form, setForm] = useState<Partial<StressTest>>(
    initial || {
      smi_id: "",
      test_date: new Date().toISOString().split("T")[0],
      test_type: "SMI_LEVEL",
      scenario_name: "",
      scenario_description: "",
      capital_adequacy_impact: 0,
      liquidity_impact: 0,
      profitability_impact: 0,
      risk_score_change: 0,
      passed: false,
      threshold_breach: false,
      recommendations: "",
    }
  );

  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof StressTest>(k: K, v: StressTest[K]) => {
    setError(null);
    setForm((s) => ({ ...s, [k]: v }));
  };

  const { data: smis, isLoading: isLoadingSMIs } = useSMIs(1);
  const smiOptions: SMIOption[] =
    ((Array.isArray(smis) ? smis : smis?.results) || [])
      .filter((s) => s.id !== undefined)
      .map((s) => ({
        id: s.id as string | number,
        company_name: s.company_name,
      }));

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (form.test_type !== "INDUSTRY_LEVEL" && !form.smi_id) {
      setError("SMI is required for SMI-level tests");
      return;
    }
    if (!form.scenario_name) {
      setError("Scenario name is required");
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="test_type">Test Type *</Label>
          <Select
            value={form.test_type || "SMI_LEVEL"}
            onValueChange={(value: string) =>
              update("test_type", value as StressTest["test_type"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              {TEST_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="test_date">Test Date</Label>
          <Input
            id="test_date"
            type="date"
            value={form.test_date as string}
            onChange={(e) => update("test_date", e.target.value)}
          />
        </div>
      </div>

      {form.test_type !== "INDUSTRY_LEVEL" && (
        <div>
          <Label htmlFor="smi_id">SMI *</Label>
          <Select
            value={form.smi_id || ""}
            onValueChange={(value: string) => update("smi_id", value)}
            disabled={isLoadingSMIs}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={isLoadingSMIs ? "Loading SMIs..." : "Select SMI"}
              />
            </SelectTrigger>
            <SelectContent>
              {smiOptions.map((s) => (
                <SelectItem key={String(s.id)} value={String(s.id)}>
                  {s.company_name} ({String(s.id).substring(0, 8)}...)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="scenario_name">Scenario Name *</Label>
        <Input
          id="scenario_name"
          type="text"
          placeholder="e.g., Interest Rate Rise, Market Downturn"
          value={form.scenario_name || ""}
          onChange={(e) => update("scenario_name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="scenario_description">Scenario Description</Label>
        <Textarea
          id="scenario_description"
          placeholder="Describe the stress test scenario..."
          value={form.scenario_description || ""}
          onChange={(e) => update("scenario_description", e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Impact Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capital_adequacy_impact">
              CAR Impact (%)
            </Label>
            <Input
              id="capital_adequacy_impact"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.capital_adequacy_impact ?? ""}
              onChange={(e) =>
                update("capital_adequacy_impact", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label htmlFor="liquidity_impact">Liquidity Impact (%)</Label>
            <Input
              id="liquidity_impact"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.liquidity_impact ?? ""}
              onChange={(e) =>
                update("liquidity_impact", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label htmlFor="profitability_impact">
              Profitability Impact (%)
            </Label>
            <Input
              id="profitability_impact"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.profitability_impact ?? ""}
              onChange={(e) =>
                update("profitability_impact", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label htmlFor="risk_score_change">Risk Score Change</Label>
            <Input
              id="risk_score_change"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.risk_score_change ?? ""}
              onChange={(e) =>
                update("risk_score_change", Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Test Results</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              id="passed"
              type="checkbox"
              checked={form.passed || false}
              onChange={(e) => update("passed", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="passed" className="mb-0 cursor-pointer">
              Test Passed
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="threshold_breach"
              type="checkbox"
              checked={form.threshold_breach || false}
              onChange={(e) => update("threshold_breach", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="threshold_breach" className="mb-0 cursor-pointer">
              Threshold Breached
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="recommendations">Recommendations</Label>
        <Textarea
          id="recommendations"
          placeholder="Document any recommendations from this stress test..."
          value={form.recommendations || ""}
          onChange={(e) => update("recommendations", e.target.value)}
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
            `${initial?.id ? "Update" : "Create"} Stress Test`
          )}
        </Button>
      </div>
    </form>
  );
}
