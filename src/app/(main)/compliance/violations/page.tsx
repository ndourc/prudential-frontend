
"use client";

import { useEffect, useState } from "react";
import { ComplianceViolation, ComplianceRequirement, complianceService } from "@/service/compliance";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";

export default function ComplianceViolationsPage() {
    const [violations, setViolations] = useState<ComplianceViolation[]>([]);
    const [smis, setSmis] = useState<SMI[]>([]);
    const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSmi, setSelectedSmi] = useState("");
    const [selectedRequirement, setSelectedRequirement] = useState("");
    const [violationType, setViolationType] = useState("MINOR");
    const [severity, setSeverity] = useState("MEDIUM");
    const [description, setDescription] = useState("");
    const [dateIdentified, setDateIdentified] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [violationsRes, smisRes, requirementsRes] = await Promise.all([
                complianceService.getViolations(),
                coreAPI.listSMIs(),
                complianceService.getRequirements(),
            ]);
            setViolations(violationsRes.results || []);
            setSmis(smisRes.results || []);
            setRequirements(requirementsRes.results || []);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await complianceService.createViolation({
                smi_id: selectedSmi,
                compliance_requirement: selectedRequirement,
                violation_type: violationType,
                severity,
                description,
                date_identified: dateIdentified,
                investigation_status: "OPEN",
            } as any);
            setShowForm(false);
            loadData();
            // Reset form
            setSelectedSmi("");
            setSelectedRequirement("");
            setDescription("");
        } catch (error: any) {
            console.error("Failed to create violation:", error);
            alert("Failed to create violation: " + (error.payload ? JSON.stringify(error.payload) : error.message));
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Violations</h1>
                    <p className="text-gray-500 mt-2">Track and manage compliance violations and remediation efforts.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "Report Violation"}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Report New Violation</CardTitle>
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
                                        Related Requirement *
                                    </label>
                                    <select
                                        required
                                        value={selectedRequirement}
                                        onChange={(e) => setSelectedRequirement(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select Requirement...</option>
                                        {requirements.map((req) => (
                                            <option key={req.id} value={req.id}>
                                                {req.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Violation Type *
                                    </label>
                                    <select
                                        value={violationType}
                                        onChange={(e) => setViolationType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="MINOR">Minor Violation</option>
                                        <option value="MAJOR">Major Violation</option>
                                        <option value="CRITICAL">Critical Violation</option>
                                        <option value="REPEATED">Repeated Violation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Severity *
                                    </label>
                                    <select
                                        value={severity}
                                        onChange={(e) => setSeverity(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="LOW">Low Severity</option>
                                        <option value="MEDIUM">Medium Severity</option>
                                        <option value="HIGH">High Severity</option>
                                        <option value="CRITICAL">Critical Severity</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date Identified *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={dateIdentified}
                                        onChange={(e) => setDateIdentified(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                    placeholder="Describe the violation in detail..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Report Violation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        All Violations ({violations.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {violations.length === 0 ? (
                        <div className="text-center py-10">
                            <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No violations reported.</p>
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
                                            Description
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Date
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
                                        <tr key={violation.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {violation.smi?.company_name || "N/A"}
                                            </td>
                                            <td className="p-4 align-middle">{violation.violation_type}</td>
                                            <td className="p-4 align-middle max-w-md truncate">
                                                {violation.description}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(violation.date_identified).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getSeverityColor(violation.severity) as any}>
                                                    {violation.severity}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">{violation.investigation_status}</td>
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
