"use client";

import { useEffect, useState } from "react";
import { ComplianceAssessment, complianceService } from "@/service/compliance";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function ComplianceAssessmentsPage() {
    const [assessments, setAssessments] = useState<ComplianceAssessment[]>([]);
    const [smis, setSmis] = useState<SMI[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSmi, setSelectedSmi] = useState("");
    const [assessmentType, setAssessmentType] = useState("REGULAR");
    const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split("T")[0]);
    const [scope, setScope] = useState("");
    const [findings, setFindings] = useState("");
    const [riskRating, setRiskRating] = useState("MEDIUM");
    const [status, setStatus] = useState("PENDING");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assessmentsRes, smisRes] = await Promise.all([
                complianceService.getAssessments(),
                coreAPI.listSMIs(),
            ]);
            setAssessments(assessmentsRes.results || []);
            setSmis(smisRes.results || []);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await complianceService.createAssessment({
                smi_id: selectedSmi,
                assessment_date: assessmentDate,
                assessment_type: assessmentType,
                scope,
                findings,
                risk_rating: riskRating,
                status,
            } as any);
            setShowForm(false);
            loadData();
            // Reset form
            setSelectedSmi("");
            setScope("");
            setFindings("");
        } catch (error: any) {
            console.error("Failed to create assessment:", error);
            alert("Failed to create assessment: " + (error.payload ? JSON.stringify(error.payload) : error.message));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "default";
            case "in_progress":
                return "secondary";
            case "pending":
                return "warning";
            case "escalated":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "low":
                return "secondary";
            case "medium":
                return "warning";
            case "high":
            case "critical":
                return "destructive";
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
        <div className="p-8 space-y-6 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Assessments</h1>
                    <p className="text-gray-500 mt-2">Manage and track compliance assessments for SMIs.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Assessment"}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select SMI *
                                    </label>
                                    <select
                                        required
                                        value={selectedSmi}
                                        onChange={(e) => setSelectedSmi(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select Company...</option>
                                        {smis.map((smi) => (
                                            <option key={smi.id} value={smi.id}>
                                                {smi.company_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assessment Type *
                                    </label>
                                    <select
                                        value={assessmentType}
                                        onChange={(e) => setAssessmentType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="REGULAR">Regular Assessment</option>
                                        <option value="POST_INSPECTION">Post-Inspection Assessment</option>
                                        <option value="TRIGGERED">Triggered Assessment</option>
                                        <option value="FOLLOW_UP">Follow-up Assessment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assessment Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={assessmentDate}
                                        onChange={(e) => setAssessmentDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Risk Rating *
                                    </label>
                                    <select
                                        value={riskRating}
                                        onChange={(e) => setRiskRating(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="LOW">Low Risk</option>
                                        <option value="MEDIUM">Medium Risk</option>
                                        <option value="HIGH">High Risk</option>
                                        <option value="CRITICAL">Critical Risk</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Scope *
                                </label>
                                <textarea
                                    required
                                    value={scope}
                                    onChange={(e) => setScope(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    placeholder="Describe the assessment scope..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Findings *
                                </label>
                                <textarea
                                    required
                                    value={findings}
                                    onChange={(e) => setFindings(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                    placeholder="Document assessment findings..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Assessment
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        All Assessments ({assessments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {assessments.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No assessments found. Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Company
                                        </th>
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
                                        <tr key={assessment.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {assessment.smi?.company_name || "N/A"}
                                            </td>
                                            <td className="p-4 align-middle">{assessment.assessment_type}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(assessment.assessment_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle max-w-md truncate">
                                                {assessment.scope}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getRiskColor(assessment.risk_rating) as any}>
                                                    {assessment.risk_rating}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(assessment.status) as any}>
                                                    {assessment.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
