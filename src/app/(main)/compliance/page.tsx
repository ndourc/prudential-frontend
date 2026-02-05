"use client";

import { useEffect, useState } from "react";
import {
  ComplianceIndex,
  ComplianceAssessment,
  ComplianceViolation,
  ComplianceRequirement,
  complianceService,
} from "@/service/compliance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "assessments" | "violations" | "requirements"
  >("overview");
  const [loading, setLoading] = useState(true);
  const [indices, setIndices] = useState<ComplianceIndex[]>([]);
  const [assessments, setAssessments] = useState<ComplianceAssessment[]>([]);
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indicesRes, assessmentsRes, violationsRes, requirementsRes] =
          await Promise.all([
            complianceService.getComplianceIndices(),
            complianceService.getAssessments(),
            complianceService.getViolations(),
            complianceService.getRequirements(),
          ]);

        setIndices(indicesRes.results || []);
        setAssessments(assessmentsRes.results || []);
        setViolations(violationsRes.results || []);
        setRequirements(requirementsRes.results || []);
      } catch (error) {
        console.error("Failed to fetch compliance data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestIndex = indices[0];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
      case "critical":
        return "destructive";
      case "medium":
        return "warning"; // Assuming warning variant exists, else default/secondary
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
      case "completed":
        return "default"; // usually primary/greenish depending on theme
      case "non-compliant":
      case "failed":
        return "destructive";
      case "pending":
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Compliance Overview
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor regulatory compliance, assessments, and violations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "assessments" ? "default" : "outline"}
            onClick={() => setActiveTab("assessments")}
          >
            Assessments
          </Button>
          <Button
            variant={activeTab === "violations" ? "default" : "outline"}
            onClick={() => setActiveTab("violations")}
          >
            Violations
          </Button>
          <Button
            variant={activeTab === "requirements" ? "default" : "outline"}
            onClick={() => setActiveTab("requirements")}
          >
            Requirements
          </Button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestIndex?.overall_compliance_score?.toFixed(1) || "N/A"}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest assessment period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Violations
                </CardTitle>
                <ShieldAlert className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{violations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assessments
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total assessments conducted
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Requirements Met
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requirements.filter((r) => r.is_compliant).length} /{" "}
                  {requirements.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Regulatory requirements
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violations.slice(0, 5).map((violation) => (
                    <div key={violation.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {violation.violation_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {violation.description}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge
                          variant={getSeverityColor(violation.severity) as any}
                        >
                          {violation.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {violations.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent violations found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.slice(0, 5).map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {assessment.assessment_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            assessment.assessment_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(assessment.status) as any}>
                        {assessment.status}
                      </Badge>
                    </div>
                  ))}
                  {assessments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No assessments found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "assessments" && (
        <Card>
          <CardHeader>
            <CardTitle>All Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Scope
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Risk Rating
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {assessments.map((assessment) => (
                    <tr
                      key={assessment.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {assessment.assessment_type}
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(
                          assessment.assessment_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">{assessment.scope}</td>
                      <td className="p-4 align-middle">
                        {assessment.risk_rating}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={getStatusColor(assessment.status) as any}
                        >
                          {assessment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "violations" && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date Identified
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Severity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {violations.map((violation) => (
                    <tr
                      key={violation.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {violation.violation_type}
                      </td>
                      <td className="p-4 align-middle">
                        {violation.description}
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(
                          violation.date_identified
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={getSeverityColor(violation.severity) as any}
                        >
                          {violation.severity}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {violation.investigation_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "requirements" && (
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Priority
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {requirements.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {req.title}
                      </td>
                      <td className="p-4 align-middle">
                        {req.requirement_type}
                      </td>
                      <td className="p-4 align-middle">{req.priority}</td>
                      <td className="p-4 align-middle">
                        {req.due_date
                          ? new Date(req.due_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={req.is_compliant ? "default" : "destructive"}
                        >
                          {req.is_compliant ? "Compliant" : "Non-Compliant"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
