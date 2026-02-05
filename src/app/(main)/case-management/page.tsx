"use client";

import { useEffect, useState } from "react";
import {
    Case,
    Investigation,
    AdHocInspection,
    caseManagementService,
} from "@/service/caseManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileSearch, Search, ShieldCheck } from "lucide-react";

export default function CaseManagementPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "cases" | "investigations" | "inspections">("overview");
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState<Case[]>([]);
    const [investigations, setInvestigations] = useState<Investigation[]>([]);
    const [inspections, setInspections] = useState<AdHocInspection[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [casesRes, investigationsRes, inspectionsRes] = await Promise.all([
                    caseManagementService.getCases(),
                    caseManagementService.getInvestigations(),
                    caseManagementService.getAdHocInspections(),
                ]);

                setCases(casesRes.results || []);
                setInvestigations(investigationsRes.results || []);
                setInspections(inspectionsRes.results || []);
            } catch (error) {
                console.error("Failed to fetch case management data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "open":
            case "active":
                return "default";
            case "closed":
            case "resolved":
                return "secondary";
            case "pending":
                return "warning";
            default:
                return "outline";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high":
            case "critical":
                return "destructive";
            case "medium":
                return "warning";
            case "low":
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Case Management</h1>
                    <p className="text-gray-500 mt-2">Track cases, investigations, and ad-hoc inspections.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
                        Overview
                    </Button>
                    <Button variant={activeTab === "cases" ? "default" : "outline"} onClick={() => setActiveTab("cases")}>
                        Cases
                    </Button>
                    <Button variant={activeTab === "investigations" ? "default" : "outline"} onClick={() => setActiveTab("investigations")}>
                        Investigations
                    </Button>
                    <Button variant={activeTab === "inspections" ? "default" : "outline"} onClick={() => setActiveTab("inspections")}>
                        Inspections
                    </Button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cases.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    All recorded cases
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Investigations</CardTitle>
                                <FileSearch className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{investigations.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Ongoing investigations
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                                <Search className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {cases.filter(c => c.status.toLowerCase() === 'open').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently open
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {cases.filter(c => c.status.toLowerCase() === 'resolved' || c.status.toLowerCase() === 'closed').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Successfully closed
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Cases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cases.slice(0, 5).map((c) => (
                                        <div key={c.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{c.title}</p>
                                                <p className="text-xs text-muted-foreground">{c.case_number}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getPriorityColor(c.priority) as any}>{c.priority}</Badge>
                                                <Badge variant={getStatusColor(c.status) as any}>{c.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {cases.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No cases found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Investigations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {investigations.slice(0, 5).map((inv) => (
                                        <div key={inv.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{inv.investigation_type}</p>
                                                <p className="text-xs text-muted-foreground">Started: {new Date(inv.start_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {investigations.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No investigations found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "cases" && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Case Number</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Opened Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {cases.map((c) => (
                                        <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{c.case_number}</td>
                                            <td className="p-4 align-middle">{c.title}</td>
                                            <td className="p-4 align-middle">{c.case_type}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getPriorityColor(c.priority) as any}>{c.priority}</Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(c.status) as any}>{c.status}</Badge>
                                            </td>
                                            <td className="p-4 align-middle">{new Date(c.opened_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "investigations" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Investigations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Scope</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Methodology</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Start Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {investigations.map((inv) => (
                                        <tr key={inv.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{inv.investigation_type}</td>
                                            <td className="p-4 align-middle">{inv.scope}</td>
                                            <td className="p-4 align-middle">{inv.methodology}</td>
                                            <td className="p-4 align-middle">{new Date(inv.start_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "inspections" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ad-Hoc Inspections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Trigger Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Scope</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Areas of Focus</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Follow-up Required</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {inspections.map((insp) => (
                                        <tr key={insp.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{insp.trigger_type}</td>
                                            <td className="p-4 align-middle">{insp.inspection_scope}</td>
                                            <td className="p-4 align-middle">{insp.areas_of_focus}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={insp.follow_up_required ? "destructive" : "default"}>
                                                    {insp.follow_up_required ? "Yes" : "No"}
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

