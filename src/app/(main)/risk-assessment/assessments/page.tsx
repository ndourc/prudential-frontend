"use client";
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useAssessments,
  useCreateAssessment,
  useDeleteAssessment,
} from "@/hooks/useRiskAssessment";
import {
  Loader2,
  AlertCircle,
 
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AssessmentForm from "@/components/risk-assessment/riskAssessmentForm";
import type { RiskAssessment } from "@/types/riskAssessment";
import { getRiskStyles } from "../page";
 

export default function RiskAssessmentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, isError, error } = useAssessments(1);
  const createAssessment = useCreateAssessment();
  const deleteAssessment = useDeleteAssessment();

  const items: RiskAssessment[] = useMemo(
    () => (Array.isArray(data) ? data : data?.results) || [],
    [data]
  );

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete assessment ${id}?`)) {
      try {
        await deleteAssessment.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete assessment:", err);
        // In a real app, use a toast/alert component here
      }
    }
  };

  const handleCreate = async (payload: Partial<RiskAssessment>) => {
    try {
      // NOTE: SMI ID is required by the backend, must be provided in payload
      await createAssessment.mutateAsync({
        ...payload,
        smi_id: payload.smi_id || "MOCK-SMI-ID-123",
      } as RiskAssessment);
      setCreateOpen(false);
    } catch (err) {
      console.error("Failed to create assessment:", err);
      throw err; // Re-throw for form to handle
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
          <p className="text-muted-foreground">Loading risk assessments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Risk Assessments</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load risk assessments"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Risk Assessments</h1>
        <div className="flex gap-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 gap-2">
                <Plus className="w-4 h-4" />
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Risk Assessment</DialogTitle>
                <DialogDescription>
                  Enter details for the new institutional risk assessment.
                </DialogDescription>
              </DialogHeader>
              <AssessmentForm
                onCancel={() => setCreateOpen(false)}
                onSave={handleCreate}
                isSubmitting={createAssessment.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-red-300">
        <div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No risk assessments found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create the first risk assessment for an SMI.
              </p>
              <Button onClick={() => setCreateOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">SMI ID</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Period</th>
                    <th className="p-2">Risk Level</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((ra: RiskAssessment) => {
                    const styles = getRiskStyles(ra.risk_level || "LOW");
                    return (
                      <tr
                        key={ra.id}
                        className="border-t hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <td className="p-2">{ra.smi_id}</td>
                        <td className="p-2">{ra.assessment_date}</td>
                        <td className="p-2">{ra.assessment_period}</td>
                        <td className="p-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              styles.badge
                            )}
                          >
                            {ra.risk_level?.replace("_", " ") ?? "N/A"}
                          </span>
                        </td>
                        <td className="p-2 font-semibold">
                          {ra.overall_risk_score?.toFixed(1) ?? "N/A"}
                        </td>
                        <td className="p-2">{ra.status}</td>
                        <td className="p-2 flex gap-2">
                          <Link href={`/risk-assessment/assessments/${ra.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(ra.id!)}
                            className="gap-1"
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
          )}
        </div>
      </Card>
    </div>
  );
}
