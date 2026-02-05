"use client";

import { useEffect, useState } from "react";
import { ComplianceReport, complianceService } from "@/service/compliance";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function ComplianceReportsPage() {
    const [reports, setReports] = useState<ComplianceReport[]>([]);
    const [smis, setSmis] = useState<SMI[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSmi, setSelectedSmi] = useState("");
    const [reportType, setReportType] = useState("REGULAR");
    const [title, setTitle] = useState("");
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [reportsRes, smisRes] = await Promise.all([
                complianceService.getReports(),
                coreAPI.listSMIs(),
            ]);
            setReports(reportsRes.results || []);
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
            await complianceService.createReport({
                smi_id: selectedSmi,
                report_type: reportType,
                title,
                period_start: periodStart,
                period_end: periodEnd,
                report_date: new Date().toISOString().split("T")[0],
                executive_summary: "To be completed",
                findings: "To be documented",
                recommendations: "To be provided",
                status: "DRAFT",
            } as any);
            setShowForm(false);
            loadData();
            // Reset form
            setSelectedSmi("");
            setTitle("");
            setPeriodStart("");
            setPeriodEnd("");
        } catch (error: any) {
            console.error("Failed to create report:", error);
            alert("Failed to create report: " + (error.payload ? JSON.stringify(error.payload) : error.message));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "draft":
                return "secondary";
            case "review":
                return "warning";
            case "approved":
                return "default";
            case "submitted":
                return "default";
            case "archived":
                return "outline";
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Reports</h1>
                    <p className="text-gray-500 mt-2">Generate and manage compliance reports for SMIs.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Report"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.status === "DRAFT").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.status === "APPROVED").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.status === "SUBMITTED").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Report</CardTitle>
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
                                        Report Type *
                                    </label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="REGULAR">Regular Report</option>
                                        <option value="INCIDENT">Incident Report</option>
                                        <option value="VIOLATION">Violation Report</option>
                                        <option value="REMEDIATION">Remediation Report</option>
                                        <option value="ANNUAL">Annual Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Period Start *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={periodStart}
                                        onChange={(e) => setPeriodStart(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Period End *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={periodEnd}
                                        onChange={(e) => setPeriodEnd(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="e.g., Q4 2024 Compliance Review"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Report
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Reports ({reports.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {reports.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No reports found. Create one to get started.</p>
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
                                            Title
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Type
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Period
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Report Date
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {report.smi?.company_name || "N/A"}
                                            </td>
                                            <td className="p-4 align-middle max-w-md truncate font-medium">
                                                {report.title}
                                            </td>
                                            <td className="p-4 align-middle">{report.report_type}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(report.report_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(report.status) as any}>
                                                    {report.status}
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
