"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import riskAssessmentAPI from "@/service/riskAssessment";
import type { StressTest } from "@/types/riskAssessment";
import { cn } from "@/lib/utils";

export default function StressTestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  // Mocking single item retrieval from a list using a direct API call (better to have a dedicated hook)
  const {
    data: test,
    isLoading,
    isError,
    error,
  } = useQuery<StressTest | null>({
    queryKey: ["stress-test", id],
    queryFn: () =>
      riskAssessmentAPI.listStressTests(1).then((data) => {
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
          Failed to load stress test details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!test) {
    return <div>Stress Test Not Found</div>;
  }

  const impactColor = test.threshold_breach ? "text-red-600" : "text-green-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Activity className="w-6 h-6 mr-2 text-red-600" />
          Scenario: {test.scenario_name}
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
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Test Date:</strong> {test.test_date}
            </div>
            <div>
              <strong>SMI ID:</strong> {test.smi_id?.substring(0, 8)}...
            </div>
            <div>
              <strong>Test Type:</strong> {test.test_type}
            </div>
            <div>
              <strong>Passed:</strong>
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  test.passed
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                )}
              >
                {test.passed ? "YES" : "NO"}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <strong>Scenario Description:</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {test.scenario_description || "No description provided."}
            </p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h3 className="text-lg font-semibold">Impact Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">CAR Impact</p>
                <p className={cn("text-xl font-bold", impactColor)}>
                  {test.capital_adequacy_impact?.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Liquidity Impact
                </p>
                <p className={cn("text-xl font-bold", impactColor)}>
                  {test.liquidity_impact?.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Profitability Impact
                </p>
                <p className={cn("text-xl font-bold", impactColor)}>
                  {test.profitability_impact?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <strong>Recommendations:</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {test.recommendations || "No recommendations provided."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
