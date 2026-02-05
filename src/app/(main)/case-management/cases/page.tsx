"use client";

import { useEffect, useState } from "react";
import { Case, caseManagementService } from "@/service/caseManagement";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [smis, setSmis] = useState<SMI[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [caseType, setCaseType] = useState("INVESTIGATION");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSmi, setSelectedSmi] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [casesRes, smisRes] = await Promise.all([
                caseManagementService.getCases(),
                coreAPI.listSMIs(),
            ]);
            const casesData = Array.isArray(casesRes) ? casesRes : casesRes.results || [];
            const smisData = Array.isArray(smisRes) ? smisRes : smisRes.results || [];
            setCases(casesData);
            setSmis(smisData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                case_type: caseType,
                title,
                description,
                status: "OPEN",
                priority,
                opened_date: new Date().toISOString().split("T")[0],
            };

            // Only include smi_id if a valid SMI is selected
            if (selectedSmi) {
                payload.smi_id = selectedSmi;
            }

            // Only include due_date if set
            if (dueDate) {
                payload.due_date = dueDate;
            }

            await caseManagementService.createCase(payload);
            setShowForm(false);
            loadData();
            setTitle("");
            setDescription("");
            setSelectedSmi("");
            setDueDate("");
        } catch (error: any) {
            console.error("Failed to create case:", error);
            alert("Failed to create case: " + (error.payload ? JSON.stringify(error.payload) : error.message));
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "low": return "secondary";
            case "medium": return "warning";
            case "high": return "destructive";
            case "urgent": return "destructive";
            default: return "outline";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "open": return "warning";
            case "in_progress": return "secondary";
            case "resolved": return "default";
            case "closed": return "outline";
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cases</h1>
                    <p className="text-gray-500 mt-2">Manage and track regulatory cases.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Case"}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cases.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Open</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {cases.filter(c => c.status === "OPEN").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {cases.filter(c => c.status === "IN_PROGRESS").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {cases.filter(c => c.status === "RESOLVED").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Case Type *
                                    </label>
                                    <select
                                        value={caseType}
                                        onChange={(e) => setCaseType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="INVESTIGATION">Investigation</option>
                                        <option value="AD_HOC_INSPECTION">Ad-hoc Inspection</option>
                                        <option value="COMPLAINT">Complaint Investigation</option>
                                        <option value="REGULATORY_ACTION">Regulatory Action</option>
                                        <option value="RISK_ESCALATION">Risk Escalation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Associated SMI (Optional)
                                    </label>
                                    <select
                                        value={selectedSmi}
                                        onChange={(e) => setSelectedSmi(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">None</option>
                                        {smis.map((smi) => (
                                            <option key={smi.id} value={smi.id}>
                                                {smi.company_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Case Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Brief title for the case"
                                />
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
                                    placeholder="Detailed description of the case..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Case
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        All Cases ({cases.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cases.length === 0 ? (
                        <div className="text-center py-10">
                            <Folder className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No cases found.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Case #</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SMI</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Opened</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {cases.map((caseItem) => (
                                        <tr key={caseItem.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-mono text-sm">{caseItem.case_number}</td>
                                            <td className="p-4 align-middle font-medium max-w-md truncate">{caseItem.title}</td>
                                            <td className="p-4 align-middle">{caseItem.case_type}</td>
                                            <td className="p-4 align-middle">{caseItem.smi?.company_name || "—"}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getPriorityColor(caseItem.priority) as any}>
                                                    {caseItem.priority}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(caseItem.status) as any}>
                                                    {caseItem.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(caseItem.opened_date).toLocaleDateString()}
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
