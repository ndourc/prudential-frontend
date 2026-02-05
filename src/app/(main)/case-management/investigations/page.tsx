"use client";

import { useEffect, useState } from "react";
import { Investigation, Case, caseManagementService } from "@/service/caseManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export default function InvestigationsPage() {
    const [investigations, setInvestigations] = useState<Investigation[]>([]);
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCase, setSelectedCase] = useState("");
    const [investigationType, setInvestigationType] = useState("REGULATORY");
    const [scope, setScope] = useState("");
    const [methodology, setMethodology] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [investigationsRes, casesRes] = await Promise.all([
                caseManagementService.getInvestigations(),
                caseManagementService.getCases(),
            ]);
            const invData = Array.isArray(investigationsRes) ? investigationsRes : investigationsRes.results || [];
            const casesData = Array.isArray(casesRes) ? casesRes : casesRes.results || [];
            setInvestigations(invData);
            setCases(casesData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await caseManagementService.createInvestigation({
                case: selectedCase,
                investigation_type: investigationType,
                scope,
                methodology,
                preliminary_findings: "To be documented",
                final_findings: "",
                start_date: startDate,
                estimated_completion: null,
                actual_completion: null,
            });
            setShowForm(false);
            loadData();
            setSelectedCase("");
            setScope("");
            setMethodology("");
        } catch (error: any) {
            console.error("Failed to create investigation:", error);
            alert("Failed to create investigation: " + (error.payload ? JSON.stringify(error.payload) : error.message));
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Investigations</h1>
                    <p className="text-gray-500 mt-2">Initiate and track regulatory investigations.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Investigation"}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Investigations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{investigations.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {investigations.filter(i => !i.actual_completion).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {investigations.filter(i => i.actual_completion).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Routine</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {investigations.filter(i => i.investigation_type === "ROUTINE").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Initiate New Investigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Associated Case *
                                    </label>
                                    <select
                                        required
                                        value={selectedCase}
                                        onChange={(e) => setSelectedCase(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select Case...</option>
                                        {cases.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.case_number} - {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Investigation Type *
                                    </label>
                                    <select
                                        value={investigationType}
                                        onChange={(e) => setInvestigationType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="REGULATORY">Regulatory Investigation</option>
                                        <option value="COMPLIANCE">Compliance Investigation</option>
                                        <option value="FINANCIAL">Financial Investigation</option>
                                        <option value="OPERATIONAL">Operational Investigation</option>
                                        <option value="FRAUD">Fraud Investigation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
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
                                    placeholder="Define the investigation scope..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Methodology *
                                </label>
                                <textarea
                                    required
                                    value={methodology}
                                    onChange={(e) => setMethodology(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    placeholder="Describe the investigation methodology..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Initiate Investigation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        All Investigations ({investigations.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {investigations.length === 0 ? (
                        <div className="text-center py-10">
                            <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No investigations found.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Case ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Scope</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Start Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {investigations.map((inv) => (
                                        <tr key={inv.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-mono text-sm">{inv.case}</td>
                                            <td className="p-4 align-middle">{inv.investigation_type}</td>
                                            <td className="p-4 align-middle max-w-md truncate">{inv.scope}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(inv.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {inv.actual_completion ? (
                                                    <span className="text-green-600 font-medium">Completed</span>
                                                ) : (
                                                    <span className="text-blue-600 font-medium">In Progress</span>
                                                )}
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
