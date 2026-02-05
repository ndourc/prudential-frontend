"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  BarChart3,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import riskAssessmentAPI from "@/service/riskAssessment";
import type { RiskTrend } from "@/types/riskAssessment";
import { cn } from "@/lib/utils";

const getTrendStyles = (trend: string) => {
  switch (trend) {
    case "CRITICAL":
    case "DETERIORATED":
      return { color: "text-red-600", icon: ArrowUp };
    case "IMPROVED":
      return { color: "text-green-600", icon: ArrowDown };
    case "STABLE":
    default:
      return { color: "text-amber-600", icon: BarChart3 };
  }
};

export default function TrendDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  // Mocking single item retrieval from a list (actual API endpoint needed if different)
  const {
    data: trend,
    isLoading,
    isError,
    error,
  } = useQuery<RiskTrend | null>({
    queryKey: ["risk-trend", id],
    queryFn: () =>
      riskAssessmentAPI.listTrends(1).then((data) => {
        const results = Array.isArray(data) ? data : data?.results || [];
        return results.find((t: any) => t.id === id) || null;
      }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load trend details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!trend) {
    return <div>Risk Trend Not Found</div>;
  }

  const styles = getTrendStyles(trend.risk_level_change || "STABLE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          {React.createElement(styles.icon, {
            className: cn("w-6 h-6 mr-2", styles.color),
          })}
          Risk Trend: {trend.period_start} to {trend.period_end}
        </h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>SMI ID:</strong> {trend.smi_id?.substring(0, 8)}...
            </div>
            <div>
              <strong>Period:</strong> {trend.period_start} - {trend.period_end}
            </div>
            <div>
              <strong>Score Change:</strong>
              <span className={cn("ml-2 text-xl font-bold", styles.color)}>
                {trend.risk_score_change > 0 ? "+" : ""}
                {trend.risk_score_change?.toFixed(2)} pts
              </span>
            </div>
            <div>
              <strong>Risk Level Change:</strong>{" "}
              {trend.risk_level_change?.replace("_", " ")}
            </div>
            <div>
              <strong>Financial Performance:</strong>{" "}
              {trend.financial_performance}
            </div>
            <div>
              <strong>Compliance Performance:</strong>{" "}
              {trend.compliance_performance}
            </div>
          </div>

          <div className="border-t pt-4">
            <strong>Key Factors:</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {trend.key_factors || "No key factors documented."}
            </p>
          </div>
          <div className="border-t pt-4">
            <strong>Recommendations:</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {trend.recommendations || "No recommendations provided."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
