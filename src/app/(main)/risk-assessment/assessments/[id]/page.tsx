"use client";
import React from "react";
import { useAssessment } from "@/hooks/useRiskAssessment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { getRiskStyles } from "../../page"; // Import styling helper
import { cn } from "@/lib/utils";

export default function AssessmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: assessment, isLoading, isError, error } = useAssessment(id);
  const router = useRouter();

  const styles = getRiskStyles(assessment?.risk_level || "LOW");

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
          Failed to load assessment details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!assessment) {
    return <div>Assessment Not Found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="w-6 h-6 mr-2 text-red-600" />
          Risk Assessment: {id.substring(0, 8)}...
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
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>SMI ID:</strong> {assessment.smi_id}
            </div>
            <div>
              <strong>Date:</strong> {assessment.assessment_date}
            </div>
            <div>
              <strong>Period:</strong> {assessment.assessment_period}
            </div>
            <div>
              <strong>Status:</strong> {assessment.status}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h3 className="text-lg font-semibold">Risk Scores</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Overall Risk</p>
                <p className={cn("text-2xl font-bold", styles.text)}>
                  {assessment.overall_risk_score?.toFixed(2) ?? "N/A"}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1",
                    styles.badge
                  )}
                >
                  {assessment.risk_level?.replace("_", " ") ?? "N/A"}
                </span>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Inherent Risk</p>
                <p className="text-xl font-bold">
                  {assessment.inherent_risk_score ?? "N/A"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">FSI Score</p>
                <p className="text-xl font-bold">
                  {assessment.fsi_score ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <strong>Notes:</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {assessment.notes || "No additional notes provided."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
