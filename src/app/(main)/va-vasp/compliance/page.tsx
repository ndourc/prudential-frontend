"use client";

import { useEffect, useState } from "react";
import { VASPCompliance, VAVASP, vaVaspService } from "@/service/vaVasp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Calendar } from "lucide-react";

export default function VASPCompliancePage() {
    const [compliance, setCompliance] = useState<VASPCompliance[]>([]);
    const [vasps, setVasps] = useState<VAVASP[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedVasp, setSelectedVasp] = useState("");
    const [complianceArea, setComplianceArea] = useState("LICENSING");
    const [complianceStatus, setComplianceStatus] = useState("PENDING");
    const [lastAuditDate, setLastAuditDate] = useState("");
    const [nextAuditDate, setNextAuditDate] = useState("");
    const [findings, setFindings] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [complianceRes, vaspsRes] = await Promise.all([
                vaVaspService.getCompliance(),
                vaVaspService.getVAVASPs(),
            ]);
            const complianceData = Array.isArray(complianceRes) ? complianceRes : complianceRes.results || [];
            const vaspsData = Array.isArray(vaspsRes) ? vaspsRes : vaspsRes.results || [];
            setCompliance(complianceData);
            setVasps(vaspsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await vaVaspService.createComplianceRecord({
                va_vasp_analysis: selectedVasp,
                compliance_area: complianceArea,
                compliance_status: complianceStatus,
                // Map frontend fields to backend model fields
                assessment_date: lastAuditDate || undefined,
                target_compliance_date: nextAuditDate || null,
                requirements: findings || "",
            });
            setShowForm(false);
            loadData();
            setSelectedVasp("");
            setLastAuditDate("");
            setNextAuditDate("");
            setFindings("");
        } catch (error: any) {
            console.error("Failed to create compliance record:", error);
            const raw = error.payload && error.payload.__raw ? error.payload.__raw : null;
            const payloadText = raw || (error.payload ? JSON.stringify(error.payload) : error.message);
            alert("Failed to create compliance record: " + payloadText);
        }
    };

    const getStatusColor = (status?: string) => {
        if (!status) return "outline";
        const s = String(status).toLowerCase();
        switch (s) {
            case "compliant": return "default";
            case "pending": return "secondary";
            case "non_compliant": return "destructive";
            case "partial": return "warning";
            default: return "outline";
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">VASP Compliance</h1>
                    <p className="text-gray-500 mt-2">Monitor VASP compliance across regulatory areas.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Compliance Record"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{compliance.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Compliant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {compliance.filter(c => c.compliance_status === "COMPLIANT").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {compliance.filter(c => c.compliance_status === "NON_COMPLIANT").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Audits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {compliance.filter(c => {
                                if (!c.next_audit_date) return false;
                                const nextAudit = new Date(c.next_audit_date);
                                const now = new Date();
                                const thirtyDaysFromNow = new Date();
                                thirtyDaysFromNow.setDate(now.getDate() + 30);
                                return nextAudit >= now && nextAudit <= thirtyDaysFromNow;
                            }).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Compliance Record</CardTitle>
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
                                        Compliance Area *
                                    </label>
                                    <select
                                        value={complianceArea}
                                        onChange={(e) => setComplianceArea(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        {/* <option value="AML_KYC">AML/KYC</option>
                                        <option value="CYBERSECURITY">Cybersecurity</option>
                                        <option value="CUSTOMER_PROTECTION">Customer Protection</option>
                                        <option value="MARKET_CONDUCT">Market Conduct</option>
                                        <option value="REPORTING">Reporting Requirements</option>
                                        <option value="RECORD_KEEPING">Record Keeping</option>
                                        <option value="TRAVEL_RULE">Travel Rule</option> */}
                                        <option value="LICENSING">Licensing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Compliance Status *
                                    </label>
                                    <select
                                        value={complianceStatus}
                                        onChange={(e) => setComplianceStatus(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="PENDING">Pending Review</option>
                                        <option value="COMPLIANT">Compliant</option>
                                        <option value="NON_COMPLIANT">Non-Compliant</option>
                                        <option value="PARTIAL">Partial Compliance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Audit Date
                                    </label>
                                    <input
                                        type="date"
                                        value={lastAuditDate}
                                        onChange={(e) => setLastAuditDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Next Audit Date
                                    </label>
                                    <input
                                        type="date"
                                        value={nextAuditDate}
                                        onChange={(e) => setNextAuditDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Findings
                                </label>
                                <textarea
                                    value={findings}
                                    onChange={(e) => setFindings(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                    placeholder="Document audit findings, compliance notes, or action items..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Record
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        All Compliance Records ({compliance.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {compliance.length === 0 ? (
                        <div className="text-center py-10">
                            <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No compliance records found.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Compliance Area</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assessment Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Requirements</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {compliance.map((record) => (
                                        <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{record.compliance_area}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(record.compliance_status) as any}>
                                                    {record.compliance_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {record.assessment_date
                                                    ? new Date(record.assessment_date).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {record.target_compliance_date ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        {new Date(record.target_compliance_date).toLocaleDateString()}
                                                    </div>
                                                ) : "—"}
                                            </td>
                                            <td className="p-4 align-middle max-w-md truncate text-gray-600">
                                                {record.requirements || "—"}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(record.created_at).toLocaleDateString()}
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
