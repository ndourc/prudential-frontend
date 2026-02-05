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
  BarChart3,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  useTrends,
  useTrendAnalysis,
  useCreateTrend,
  useDeleteTrend,
  useAssessments,
} from "@/hooks/useRiskAssessment";
import TrendForm from "@/components/risk-assessment/trendForm";
import type { RiskTrend, RiskAssessment } from "@/types/riskAssessment";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const getTrendStyles = (trend: string) => {
  switch (trend) {
    case "CRITICAL":
    case "DETERIORATED":
      return { icon: ArrowUp, color: "text-red-600", bg: "bg-red-50" };
    case "IMPROVED":
      return { icon: ArrowDown, color: "text-green-600", bg: "bg-green-50" };
    case "STABLE":
    default:
      return { icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" };
  }
};

export default function TrendsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    data: trendsData,
    isLoading: isLoadingTrends,
    isError: isErrorTrends,
    error: errorTrends,
  } = useTrends(1);
  const { data: analysisData, isLoading: isLoadingAnalysis } =
    useTrendAnalysis(1);

  // Fetch assessments for the chart
  const { data: assessmentsData, isLoading: isLoadingAssessments } =
    useAssessments(1);

  const createTrend = useCreateTrend();
  const deleteTrend = useDeleteTrend();

  const items: RiskTrend[] = useMemo(
    () => (Array.isArray(trendsData) ? trendsData : trendsData?.results) || [],
    [trendsData]
  );
  const analysis: RiskTrend[] = useMemo(
    () =>
      (Array.isArray(analysisData) ? analysisData : analysisData?.results) ||
      [],
    [analysisData]
  );

  const assessments: RiskAssessment[] = useMemo(
    () =>
      (Array.isArray(assessmentsData)
        ? assessmentsData
        : assessmentsData?.results) || [],
    [assessmentsData]
  );

  // Prepare chart data: sorted by date
  const chartData = useMemo(() => {
    return [...assessments]
      .sort(
        (a, b) =>
          new Date(a.assessment_date || "").getTime() -
          new Date(b.assessment_date || "").getTime()
      )
      .map((a) => ({
        date: a.assessment_date,
        score: a.overall_risk_score,
        smi: a.smi_id, // We might want to group by SMI in the future
      }));
  }, [assessments]);

  if (isLoadingTrends || isLoadingAnalysis || isLoadingAssessments) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this trend analysis?")) {
      try {
        await deleteTrend.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete trend:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Risk Trends Analysis</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 gap-2">
              <TrendingUp className="w-4 h-4" />
              New Trend Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Trend Analysis</DialogTitle>
              <DialogDescription>
                Analyze risk trends for an SMI across a reporting period
              </DialogDescription>
            </DialogHeader>
            <TrendForm
              onCancel={() => setCreateOpen(false)}
              onSave={async (data) => {
                try {
                  await createTrend.mutateAsync(data as RiskTrend);
                  setCreateOpen(false);
                } catch (err) {
                  console.error("Failed to create trend analysis:", err);
                  throw err;
                }
              }}
              isSubmitting={createTrend.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isErrorTrends && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load risk trend data:{" "}
            {errorTrends instanceof Error
              ? errorTrends.message
              : "Unknown error"}
          </AlertDescription>
        </Alert>
      )}

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Score History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis padding={{ top: 20, bottom: 20 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#dc2626"
                  activeDot={{ r: 8 }}
                  name="Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Latest Trend Summary Card */}
      {analysis.length > 0 && (
        <Card
          className={cn(
            "border",
            getTrendStyles(analysis[0].risk_level_change || "STABLE").bg
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle
              className={cn(
                "text-xl",
                getTrendStyles(analysis[0].risk_level_change || "STABLE").color
              )}
            >
              Latest Trend ({analysis[0].period_end})
            </CardTitle>
            {React.createElement(
              getTrendStyles(analysis[0].risk_level_change || "STABLE").icon,
              {
                className: cn(
                  "w-6 h-6",
                  getTrendStyles(analysis[0].risk_level_change || "STABLE")
                    .color
                ),
              }
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-4xl font-bold">
              {analysis[0].risk_score_change > 0 ? "+" : ""}
              {analysis[0].risk_score_change?.toFixed(2)} pts
            </p>
            <p className="text-sm font-medium">
              Risk Level: {analysis[0].risk_level_change}
            </p>
            <div className="border-t pt-3">
              <strong>Key Factor:</strong>
              <p className="text-sm text-muted-foreground">
                {analysis[0].key_factors}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Trends List */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Trend Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                  <th className="p-2">SMI ID</th>
                  <th className="p-2">Period End</th>
                  <th className="p-2">Score Change</th>
                  <th className="p-2">Level Change</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((trend: RiskTrend) => {
                  const styles = getTrendStyles(
                    trend.risk_level_change || "STABLE"
                  );
                  return (
                    <tr
                      key={trend.id}
                      className="border-t hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-2">
                        {trend.smi_id?.substring(0, 8)}...
                      </td>
                      <td className="p-2">{trend.period_end}</td>
                      <td className={cn("p-2 font-medium", styles.color)}>
                        {trend.risk_score_change > 0 ? "+" : ""}
                        {trend.risk_score_change?.toFixed(2)}
                      </td>
                      <td className="p-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            styles.color,
                            styles.bg
                          )}
                        >
                          {trend.risk_level_change?.replace("_", " ") ?? "N/A"}
                        </span>
                      </td>
                      <td className="p-2 flex gap-2">
                        <Link
                          href={`/risk-assessment/trends/${trend.id}`}
                          passHref
                        >
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(trend.id as string)}
                          disabled={deleteTrend.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
