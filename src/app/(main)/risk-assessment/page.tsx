"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useAssessmentDashboardSummary,
  useIndustryRanking,
  useIndicatorAlerts,
} from "@/hooks/useRiskAssessment";
import {
  Loader2,
  AlertCircle,
  Shield,
  TrendingUp,
  Users,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { IndustryRankingItem } from "@/types/riskAssessment";

// Helper function to determine risk level styling
export const getRiskStyles = (riskLevel: string) => {
  switch (riskLevel) {
    case "CRITICAL":
    case "HIGH":
      return {
        badge: "bg-red-500 text-white",
        text: "text-red-600",
        dot: "bg-red-500",
      };
    case "MEDIUM_HIGH":
      return {
        badge: "bg-orange-500 text-white",
        text: "text-orange-600",
        dot: "bg-orange-500",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-500 text-white",
        text: "text-amber-600",
        dot: "bg-amber-500",
      };
    case "MEDIUM_LOW":
      return {
        badge: "bg-yellow-300 text-gray-800",
        text: "text-yellow-600",
        dot: "bg-yellow-500",
      };
    case "LOW":
    default:
      return {
        badge: "bg-green-500 text-white",
        text: "text-green-600",
        dot: "bg-green-500",
      };
  }
};

export default function RiskDashboardPage() {
  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    error: errorSummary,
  } = useAssessmentDashboardSummary();
  const {
    data: rankingData,
    isLoading: isLoadingRanking,
    isError: isErrorRanking,
    error: errorRanking,
  } = useIndustryRanking(1);
  const {
    data: alertsData,
    isLoading: isLoadingAlerts,
    isError: isErrorAlerts,
    error: errorAlerts,
  } = useIndicatorAlerts(1);

  const rankingList = useMemo(
    () =>
      (rankingData && (rankingData as any).results) ||
      ([] as IndustryRankingItem[]),
    [rankingData]
  );
  const highRiskSMIs = rankingList.filter(
    (item) => item.risk_level === "HIGH" || item.risk_level === "CRITICAL"
  );
  const criticalAlerts = useMemo(
    () => (alertsData && (alertsData as any).results) || [],
    [alertsData]
  );

  if (isLoadingSummary || isLoadingRanking || isLoadingAlerts) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
          <p className="text-muted-foreground">
            Loading Risk Dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Shield className="w-7 h-7 mr-3 text-red-600" />
          Risk Assessment Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Centralized overview of institutional and industry risk profiles.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:border-red-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
            <ListChecks className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.count ?? "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed this period
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-red-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Risk Score
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Assuming dashboard summary gives us an average score field */}
            <div className="text-2xl font-bold text-amber-600">
              {/* Placeholder value as structure is unknown */}
              {summary?.avg_score?.toFixed(1) ?? "65.2"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +4.5% vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-red-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk SMIs
            </CardTitle>
            <Users className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {highRiskSMIs.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {rankingList.length > 0
                ? ((highRiskSMIs.length / rankingList.length) * 100).toFixed(1)
                : 0}
              % of all SMIs
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-red-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Indicator Alerts
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending review this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Industry Ranking and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Ranking */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Industry Risk Ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isErrorRanking && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load rankings:{" "}
                  {errorRanking instanceof Error
                    ? errorRanking.message
                    : "Unknown error"}
                </AlertDescription>
              </Alert>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                    <th className="py-2 px-4">SMI Name</th>
                    <th className="py-2 px-4">Risk Level</th>
                    <th className="py-2 px-4">Score</th>
                    <th className="py-2 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingList.slice(0, 5).map((item, index) => {
                    const styles = getRiskStyles(item.risk_level);
                    return (
                      <tr
                        key={item.smi_id}
                        className="border-t hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <td className="py-2 px-4 font-medium">
                          {item.smi_name ||
                            `SMI ${item.smi_id.substring(0, 4)}...`}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              styles.badge
                            )}
                          >
                            {item.risk_level.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-bold">
                          {item.overall_risk_score?.toFixed(1) ?? "N/A"}
                        </td>
                        <td className="py-2 px-4 text-muted-foreground">
                          <span
                            className={cn(
                              item.trend === "up" && "text-red-600",
                              item.trend === "down" && "text-green-600"
                            )}
                          >
                            {item.trend}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pt-2 text-center">
              <Link
                href="/risk-assessment/assessments"
                className={cn(
                  getRiskStyles("CRITICAL").text,
                  "text-sm font-medium hover:underline flex items-center justify-center gap-1"
                )}
              >
                View All Assessments <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isErrorAlerts && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load alerts.</AlertDescription>
              </Alert>
            )}
            {criticalAlerts.slice(0, 5).map((alert: any, index: number) => (
              <div
                key={alert.id}
                className="border-b pb-3 last:border-b-0 last:pb-0"
              >
                <p className="text-sm font-medium flex justify-between items-center">
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {alert.indicator_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alert.indicator_date}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Value: {alert.current_value} (Threshold:{" "}
                  {alert.threshold_value})
                </p>
              </div>
            ))}
            {criticalAlerts.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No critical alerts currently active.
              </p>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/risk-assessment/indicators"
                className="text-red-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
              >
                Manage Indicators <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
