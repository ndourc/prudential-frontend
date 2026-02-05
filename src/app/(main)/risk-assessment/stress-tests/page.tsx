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
  Trash2,
} from "lucide-react";
import {
  useStressTests,
  useCreateStressTest,
  useDeleteStressTest,
} from "@/hooks/useRiskAssessment";
import { cn } from "@/lib/utils";
import StressTestForm from "@/components/risk-assessment/stressTestForm";
import type { StressTest } from "@/types/riskAssessment";

export default function StressTestsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    data: stressTestsData,
    isLoading,
    isError,
    error,
  } = useStressTests(1);
  const createStressTest = useCreateStressTest();
  const deleteStressTest = useDeleteStressTest();

  const stressTests: StressTest[] = useMemo(
    () =>
      (Array.isArray(stressTestsData)
        ? stressTestsData
        : stressTestsData?.results) || [],
    [stressTestsData]
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this stress test?")) {
      try {
        await deleteStressTest.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete stress test:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stress Tests</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 gap-2"
            >
              <Plus className="w-4 h-4" />
              New Stress Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Stress Test</DialogTitle>
              <DialogDescription>
                Run a stress test scenario to evaluate institutional resilience
              </DialogDescription>
            </DialogHeader>
            <StressTestForm
              onCancel={() => setCreateOpen(false)}
              onSave={async (data) => {
                try {
                  await createStressTest.mutateAsync(data as StressTest);
                  setCreateOpen(false);
                } catch (err) {
                  console.error("Failed to create stress test:", err);
                  throw err;
                }
              }}
              isSubmitting={createStressTest.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load stress tests"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stress Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {stressTests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No stress tests yet. Create your first one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase text-muted-foreground border-b">
                    <th className="p-3">Scenario</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">CAR Impact</th>
                    <th className="p-3">Liquidity Impact</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stressTests.map((test: StressTest) => (
                    <tr
                      key={test.id}
                      className="border-t hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-3 font-medium">
                        {test.scenario_name}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {test.test_type === "SMI_LEVEL"
                            ? "SMI"
                            : test.test_type === "INDUSTRY_LEVEL"
                              ? "Industry"
                              : "Scenario"}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {test.test_date}
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "font-semibold",
                            test.capital_adequacy_impact < 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {test.capital_adequacy_impact > 0 ? "+" : ""}
                          {Number(test.capital_adequacy_impact).toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "font-semibold",
                            test.liquidity_impact < 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {test.liquidity_impact > 0 ? "+" : ""}
                          {Number(test.liquidity_impact).toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-semibold",
                            test.passed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {test.passed ? "PASSED" : "FAILED"}
                          {test.threshold_breach && " (Breach)"}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(test.id as string)}
                          disabled={deleteStressTest.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {stressTests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stressTests.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {stressTests.filter((t) => t.passed).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {stressTests.filter((t) => !t.passed).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Breaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {stressTests.filter((t) => t.threshold_breach).length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
