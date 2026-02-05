"use client";

import { useEffect, useState } from "react";
import { VARiskAssessment, VAVASP, vaVaspService } from "@/service/vaVasp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";

export default function VARiskAssessmentsPage() {
    const [assessments, setAssessments] = useState<VARiskAssessment[]>([]);
    const [vasps, setVasps] = useState<VAVASP[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedVasp, setSelectedVasp] = useState("");
    const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split("T")[0]);
    const [riskLevel, setRiskLevel] = useState("MEDIUM");
    const [amlRiskScore, setAmlRiskScore] = useState("50");
    const [cybersecurityScore, setCybersecurityScore] = useState("50");
    const [operationalRiskScore, setOperationalRiskScore] = useState("50");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assessmentsRes, vaspsRes] = await Promise.all([
                vaVaspService.getRiskAssessments(),
                vaVaspService.getVAVASPs(),
            ]);
            const assessmentsData = Array.isArray(assessmentsRes) ? assessmentsRes : assessmentsRes.results || [];
            const vaspsData = Array.isArray(vaspsRes) ? vaspsRes : vaspsRes.results || [];
            setAssessments(assessmentsData);
            setVasps(vaspsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const overall = ((parseFloat(amlRiskScore) + parseFloat(cybersecurityScore) + parseFloat(operationalRiskScore)) / 3).toFixed(2);

        try {
            await vaVaspService.createRiskAssessment({
                va_vasp_analysis: selectedVasp,
                assessment_date: assessmentDate,
                risk_level: riskLevel,
                aml_risk_score: parseFloat(amlRiskScore),
                cybersecurity_score: parseFloat(cybersecurityScore),
                operational_risk_score: parseFloat(operationalRiskScore),
                overall_risk_score: parseFloat(overall),
            });
            setShowForm(false);
            loadData();
            setSelectedVasp("");
        } catch (error: any) {
            console.error("Failed to create risk assessment:", error);
            const raw = error.payload && error.payload.__raw ? error.payload.__raw : null;
            const payloadText = raw || (error.payload ? JSON.stringify(error.payload) : error.message);
            alert("Failed to create risk assessment: " + payloadText);
        }
    };

    const getRiskColor = (level?: string) => {
        if (!level) return "outline";
        const l = String(level).toLowerCase();
        switch (l) {
            case "low": return "secondary";
            case "medium": return "warning";
            case "high": return "destructive";
            case "critical": return "destructive";
            default: return "outline";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-destructive";
        if (score >= 50) return "text-orange-600";
        if (score >= 25) return "text-yellow-600";
        return "text-green-600";
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">VA Risk Assessments</h1>
                    <p className="text-gray-500 mt-2">Conduct and monitor virtual asset risk assessments.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Assessment"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assessments.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {assessments.filter(a => a.risk_level === "HIGH" || a.risk_level === "CRITICAL").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assessments.length > 0
                                ? (assessments.reduce((sum, a) => sum + (a.overall_risk_score ?? 0), 0) / assessments.length).toFixed(1)
                                : "0.0"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assessments.filter(a => {
                                const date = new Date(a.assessment_date);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Conduct New Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select VASP *
                                    </label>
                                    <select
                                        required
                                        value={selectedVasp}
                                        onChange={(e) => setSelectedVasp(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select VASP...</option>
                                        {vasps.map((vasp) => (
                                            <option key={vasp.id} value={vasp.id}>
                                                {vasp.smi?.company_name || vasp.smi?.name || vasp.id}
                                            </option>
                                        ))}
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
                                        Risk Level *
                                    </label>
                                    <select
                                        value={riskLevel}
                                        onChange={(e) => setRiskLevel(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="LOW">Low Risk</option>
                                        <option value="MEDIUM">Medium Risk</option>
                                        <option value="HIGH">High Risk</option>
                                        <option value="CRITICAL">Critical Risk</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Risk Scores (0-100)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            AML Risk Score *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={amlRiskScore}
                                            onChange={(e) => setAmlRiskScore(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cybersecurity Score *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={cybersecurityScore}
                                            onChange={(e) => setCybersecurityScore(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Operational Risk Score *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={operationalRiskScore}
                                            onChange={(e) => setOperationalRiskScore(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Overall Risk Score:</strong> {((parseFloat(amlRiskScore) + parseFloat(cybersecurityScore) + parseFloat(operationalRiskScore)) / 3).toFixed(2)} (calculated automatically)
                                </p>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Submit Assessment
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        All Risk Assessments ({assessments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {assessments.length === 0 ? (
                        <div className="text-center py-10">
                            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No risk assessments conducted.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assessment Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Risk Level</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">AML Score</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Cybersecurity</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Operational</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Overall</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {assessments.map((assessment) => (
                                        <tr key={assessment.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {new Date(assessment.assessment_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getRiskColor(assessment.risk_level) as any}>
                                                    {assessment.risk_level}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className={`font-semibold ${getScoreColor(assessment.aml_risk_score)}`}>
                                                    {assessment.aml_risk_score}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className={`font-semibold ${getScoreColor(assessment.cybersecurity_score)}`}>
                                                    {assessment.cybersecurity_score}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className={`font-semibold ${getScoreColor(assessment.operational_risk_score)}`}>
                                                    {assessment.operational_risk_score}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className={`font-bold text-lg ${getScoreColor(assessment.overall_risk_score)}`}>
                                                    {(assessment.overall_risk_score ?? 0).toFixed(1)}
                                                </span>
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
