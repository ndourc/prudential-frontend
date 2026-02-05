"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  AlertCircle,

  Plus,

} from "lucide-react";
import Link from "next/link";
import {
  useIndicators,
  useIndicatorAlerts,
  useCreateIndicator,
} from "@/hooks/useRiskAssessment";
import { cn } from "@/lib/utils";
import RiskIndicatorForm from "@/components/risk-assessment/riskIndicatorForm";
import type { RiskIndicator } from "@/types/riskAssessment";

const getAlertStyles = (alertLevel: string) => {
  switch (alertLevel) {
    case "CRITICAL":
      return { badge: "bg-red-500 text-white", text: "text-red-600" };
    case "HIGH":
      return { badge: "bg-orange-500 text-white", text: "text-orange-600" };
    case "MEDIUM":
      return { badge: "bg-amber-500 text-white", text: "text-amber-600" };
    case "LOW":
    default:
      return { badge: "bg-green-500 text-white", text: "text-green-600" };
  }
};

export default function IndicatorsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    data: indicatorsData,
    isLoading: isLoadingIndicators,
    isError: isErrorIndicators,
    error: errorIndicators,
  } = useIndicators(1);
  const {
    data: alertsData,
    isLoading: isLoadingAlerts,
    isError: isErrorAlerts,
  } = useIndicatorAlerts(1);
  const createIndicator = useCreateIndicator();

  const indicators: RiskIndicator[] = useMemo(
    () =>
      (Array.isArray(indicatorsData)
        ? indicatorsData
        : indicatorsData?.results) || [],
    [indicatorsData]
  );
  const alerts: RiskIndicator[] = useMemo(
    () => (Array.isArray(alertsData) ? alertsData : alertsData?.results) || [],
    [alertsData]
  );

  if (isLoadingIndicators || isLoadingAlerts) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Risk Indicators & Alerts</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 gap-2"
            >
              <Plus className="w-4 h-4" />
              New Indicator
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Risk Indicator</DialogTitle>
              <DialogDescription>
                Add a new risk indicator to track important metrics
              </DialogDescription>
            </DialogHeader>
            <RiskIndicatorForm
              onCancel={() => setCreateOpen(false)}
              onSave={async (data) => {
                try {
                  await createIndicator.mutateAsync(data as RiskIndicator);
                  setCreateOpen(false);
                } catch (err) {
                  console.error("Failed to create indicator:", err);
                  throw err;
                }
              }}
              isSubmitting={createIndicator.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(isErrorIndicators || isErrorAlerts) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load data: Check indicator and alert APIs.
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            Critical Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">
              No pending alerts. All clear!
            </p>
          ) : (
            alerts.slice(0, 3).map((alert: RiskIndicator) => {
              const styles = getAlertStyles(alert.alert_level || "LOW");
              return (
                <div
                  key={alert.id}
                  className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {alert.indicator_name}
                    </p>
                    <p className="text-xs text-red-600">
                      SMI: {alert.smi_id?.substring(0, 8)}... | Value:{" "}
                      {alert.current_value} (Threshold: {alert.threshold_value})
                    </p>
                  </div>
                  <Link
                    href={`/risk-assessment/indicators/${alert.id}`}
                    passHref
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-red-200 text-red-700 hover:bg-red-300"
                    >
                      Investigate
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Indicators List */}
      <Card>
        <CardHeader>
          <CardTitle>All Risk Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                  <th className="p-2">Name</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Threshold</th>
                  <th className="p-2">Breached</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((indicator: RiskIndicator) => {
                  const styles = getAlertStyles(indicator.alert_level || "LOW");
                  return (
                    <tr
                      key={indicator.id}
                      className="border-t hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-2 font-medium">
                        {indicator.indicator_name}
                      </td>
                      <td className="p-2">{indicator.indicator_type}</td>
                      <td className="p-2">{indicator.current_value}</td>
                      <td className="p-2">{indicator.threshold_value}</td>
                      <td className="p-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            indicator.is_breached
                              ? styles.badge
                              : "bg-green-100 text-green-800"
                          )}
                        >
                          {indicator.is_breached ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="p-2">
                        <Link
                          href={`/risk-assessment/indicators/${indicator.id}`}
                          passHref
                        >
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
