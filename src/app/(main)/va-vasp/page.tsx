"use client";

import { useEffect, useState } from "react";
import {
    VAVASP,
    VirtualAsset,
    VARiskAssessment,
    vaVaspService,
} from "@/service/vaVasp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bitcoin, Building2, Globe, Plus } from "lucide-react";
import { coreAPI } from "@/service/core";

export default function VAVASPPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "vasps" | "assets" | "risks">("overview");
    const [loading, setLoading] = useState(true);
    const [vasps, setVasps] = useState<VAVASP[]>([]);
    const [assets, setAssets] = useState<VirtualAsset[]>([]);
    const [risks, setRisks] = useState<VARiskAssessment[]>([]);
    const [showCreateVaspForm, setShowCreateVaspForm] = useState(false);
    const [smis, setSmis] = useState<any[]>([]);
    const [selectedSmi, setSelectedSmi] = useState("");
    const [isVasp, setIsVasp] = useState(true);
    const [analysisDate, setAnalysisDate] = useState<string>(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vaspsRes, assetsRes, risksRes] = await Promise.all([
                    vaVaspService.getVAVASPs(),
                    vaVaspService.getVirtualAssets(),
                    vaVaspService.getRiskAssessments(),
                ]);

                setVasps(vaspsRes.results || []);
                setAssets(assetsRes.results || []);
                setRisks(risksRes.results || []);

                // load SMIs for creating a VA/VASP
                try {
                    const smisRes = await coreAPI.listSMIs();
                    setSmis(smisRes.results || smisRes || []);
                } catch (err) {
                    console.warn("Failed to load SMIs", err);
                }
            } catch (error) {
                console.error("Failed to fetch VA/VASP data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getRiskColor = (level?: string) => {
        if (!level) return "outline";
        const l = String(level).toLowerCase();
        switch (l) {
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

    const getStatusColor = (status?: string) => {
        if (!status) return "outline";
        const s = String(status).toLowerCase();
        switch (s) {
            case "active":
            case "licensed":
                return "default";
            case "revoked":
            case "suspended":
                return "destructive";
            case "pending":
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Virtual Assets / VASP</h1>
                    <p className="text-gray-500 mt-2">Monitor Virtual Asset Service Providers and digital assets.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
                        Overview
                    </Button>
                    <Button variant={activeTab === "vasps" ? "default" : "outline"} onClick={() => setActiveTab("vasps")}>
                        VASPs
                    </Button>
                    <Button variant={activeTab === "assets" ? "default" : "outline"} onClick={() => setActiveTab("assets")}>
                        Virtual Assets
                    </Button>
                    <Button variant={activeTab === "risks" ? "default" : "outline"} onClick={() => setActiveTab("risks")}>
                        Risk Assessments
                    </Button>
                    <Button variant="default" onClick={() => setShowCreateVaspForm(!showCreateVaspForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        {showCreateVaspForm ? "Cancel" : "New VASP"}
                    </Button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Registered VASPs</CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{vasps.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Licensed entities
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Virtual Assets</CardTitle>
                                <Bitcoin className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{assets.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Monitored assets
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">High Risk Entities</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {risks.filter(r => (r.risk_level || '').toLowerCase() === 'high' || (r.risk_level || '').toLowerCase() === 'critical').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Require enhanced due diligence
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Jurisdictions</CardTitle>
                                <Globe className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Set(vasps.map(v => v.smi.business_type)).size}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Business types represented
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {showCreateVaspForm && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Create VA/VASP</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!selectedSmi) {
                                            alert("Please select an SMI before creating a VASP.");
                                            return;
                                        }
                                        try {
                                            await vaVaspService.createVAVASP({
                                                smi_id: selectedSmi,
                                                is_vasp: isVasp,
                                                analysis_date: analysisDate,
                                            });
                                            // refresh
                                            setShowCreateVaspForm(false);
                                            setSelectedSmi("");
                                            setIsVasp(true);
                                            setAnalysisDate(new Date().toISOString().split("T")[0]);
                                            // reload data
                                            setLoading(true);
                                            const [vaspsRes, assetsRes, risksRes] = await Promise.all([
                                                vaVaspService.getVAVASPs(),
                                                vaVaspService.getVirtualAssets(),
                                                vaVaspService.getRiskAssessments(),
                                            ]);
                                            setVasps(vaspsRes.results || []);
                                            setAssets(assetsRes.results || []);
                                            setRisks(risksRes.results || []);
                                        } catch (err: any) {
                                            console.error("Failed to create VA/VASP", err);
                                            const raw = err.payload && err.payload.__raw ? err.payload.__raw : null;
                                            const payloadText = raw || (err.payload ? JSON.stringify(err.payload) : err.message || String(err));
                                            alert("Failed to create VA/VASP: " + payloadText);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SMI *</label>
                                            <select
                                                required
                                                value={selectedSmi}
                                                onChange={(e) => setSelectedSmi(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="">Select SMI...</option>
                                                {smis.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.company_name || s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Is VASP</label>
                                            <select
                                                value={String(isVasp)}
                                                onChange={(e) => setIsVasp(e.target.value === "true")}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Date</label>
                                            <input
                                                type="date"
                                                value={analysisDate}
                                                onChange={(e) => setAnalysisDate(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" type="button" onClick={() => setShowCreateVaspForm(false)}>Cancel</Button>
                                        <Button type="submit">Create VASP</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent VASPs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {vasps.slice(0, 5).map((v) => (
                                        <div key={v.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{v.smi.company_name}</p>
                                                <p className="text-xs text-muted-foreground">{v.smi.license_number}</p>
                                            </div>
                                            <Badge variant={getStatusColor(v.smi.status) as any}>{v.smi.status}</Badge>
                                        </div>
                                    ))}
                                    {vasps.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No VASPs found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Risk Assessments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {risks.slice(0, 5).map((r) => (
                                        <div key={r.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">Score: {r.overall_risk_score}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.assessment_date).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={getRiskColor(r.risk_level) as any}>{r.risk_level}</Badge>
                                        </div>
                                    ))}
                                    {risks.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No risk assessments found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "vasps" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Virtual Asset Service Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">License Number</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Business Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registration Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {vasps.map((v) => (
                                        <tr key={v.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{v.smi.company_name}</td>
                                            <td className="p-4 align-middle">{v.smi.license_number}</td>
                                            <td className="p-4 align-middle">{v.smi.business_type}</td>
                                            <td className="p-4 align-middle">
                                                {v.smi.registration_date ? new Date(v.smi.registration_date).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(v.smi.status) as any}>{v.smi.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "assets" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Virtual Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Symbol</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Market Value</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Risk Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {assets.map((asset) => (
                                        <tr key={asset.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{asset.asset_name}</td>
                                            <td className="p-4 align-middle">{asset.asset_symbol}</td>
                                            <td className="p-4 align-middle">{asset.asset_type}</td>
                                            <td className="p-4 align-middle">{asset.market_value}</td>
                                            <td className="p-4 align-middle">{asset.risk_rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "risks" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Risk Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">AML Score</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cyber Score</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Overall Score</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {risks.map((r) => (
                                        <tr key={r.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{new Date(r.assessment_date).toLocaleDateString()}</td>
                                            <td className="p-4 align-middle">{r.aml_risk_score}</td>
                                            <td className="p-4 align-middle">{r.cybersecurity_score}</td>
                                            <td className="p-4 align-middle font-bold">{r.overall_risk_score}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getRiskColor(r.risk_level) as any}>{r.risk_level}</Badge>
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
