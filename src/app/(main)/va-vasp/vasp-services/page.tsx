"use client";

import { useEffect, useState } from "react";
import { VASPService, VAVASP, vaVaspService } from "@/service/vaVasp";
import { coreAPI } from "@/service/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Server, CheckCircle, XCircle } from "lucide-react";

export default function VASPServicesPage() {
    const [services, setServices] = useState<VASPService[]>([]);
    const [vasps, setVasps] = useState<VAVASP[]>([]);
    const [smis, setSmis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showCreateVaspForm, setShowCreateVaspForm] = useState(false);
    const [selectedVasp, setSelectedVasp] = useState("");
    const [serviceType, setServiceType] = useState("EXCHANGE");
    const [serviceName, setServiceName] = useState("");
    const [description, setDescription] = useState("");
    const [complianceStatus, setComplianceStatus] = useState("PENDING");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [servicesRes, vaspsRes] = await Promise.all([
                vaVaspService.getVASPServices(),
                vaVaspService.getVAVASPs(),
            ]);
            const servicesData = Array.isArray(servicesRes) ? servicesRes : servicesRes.results || [];
            const vaspsData = Array.isArray(vaspsRes) ? vaspsRes : vaspsRes.results || [];
            setServices(servicesData);
            setVasps(vaspsData);
            // load smis for creating a new VA/VASP
            try {
                const smisRes = await coreAPI.listSMIs();
                const smisData = Array.isArray(smisRes) ? smisRes : smisRes.results || [];
                setSmis(smisData);
            } catch (err) {
                console.warn("Failed to load SMIs:", err);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await vaVaspService.createVASPService({
                // backend serializer expects `va_vasp_analysis` PK field
                va_vasp_analysis: selectedVasp,
                service_type: serviceType,
                service_name: serviceName,
                description,
                is_active: true,
                compliance_status: complianceStatus,
            });
            setShowForm(false);
            loadData();
            setSelectedVasp("");
            setServiceName("");
            setDescription("");
        } catch (error: any) {
            console.error("Failed to create service:", error);
            const raw = error.payload && error.payload.__raw ? error.payload.__raw : null;
            const payloadText = raw || (error.payload ? JSON.stringify(error.payload) : error.message);
            alert("Failed to create service: " + payloadText);
        }
    };

    const getComplianceColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "compliant": return "default";
            case "pending": return "secondary";
            case "non_compliant": return "destructive";
            case "under_review": return "warning";
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">VASP Services</h1>
                    <p className="text-gray-500 mt-2">Manage virtual asset services provided by VASPs.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Service"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {services.filter(s => s.is_active).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Compliant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {services.filter(s => s.compliance_status === "COMPLIANT").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {services.filter(s => s.compliance_status === "NON_COMPLIANT").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Register New VASP Service</CardTitle>
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
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        className="ml-3 text-sm text-primary underline"
                                        onClick={() => setShowCreateVaspForm(!showCreateVaspForm)}
                                    >
                                        {showCreateVaspForm ? "Cancel VASP" : "New VASP"}
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Service Type *
                                    </label>
                                    <select
                                        value={serviceType}
                                        onChange={(e) => setServiceType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="EXCHANGE">Exchange</option>
                                        <option value="WALLET">Wallet Provider</option>
                                        <option value="TRANSFER">Transfer Service</option>
                                        <option value="CUSTODY">Custody Service</option>
                                        <option value="TRADING">Trading Platform</option>
                                        <option value="ICO_STO">ICO/STO Platform</option>
                                        <option value="P2P">P2P Exchange</option>
                                        <option value="ATM">Virtual Asset ATM</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Service Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={serviceName}
                                        onChange={(e) => setServiceName(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="e.g., Crypto Exchange Platform"
                                    />
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
                                        <option value="UNDER_REVIEW">Under Review</option>
                                    </select>
                                </div>
                            </div>
                            {showCreateVaspForm && (
                                <div className="mt-4 p-4 border rounded bg-white">
                                    <h3 className="font-medium mb-2">Create VA/VASP</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select SMI *</label>
                                            <select
                                                value={/* local state below */ (selectedVasp ? "" : "")}
                                                onChange={() => {}}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="">Select SMI...</option>
                                                {smis.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.company_name || s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Is VASP</label>
                                            <select className="w-full border rounded px-3 py-2" defaultValue={"true"}>
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-primary text-white rounded"
                                                onClick={async () => {
                                                    // minimal VA/VASP creation: use first SMI if none selected
                                                    const smiId = smis.length ? smis[0].id : undefined;
                                                    if (!smiId) {
                                                        alert('No SMI available. Create an SMI first.');
                                                        return;
                                                    }
                                                    try {
                                                        const created = await vaVaspService.createVAVASP({ smi_id: smiId, is_vasp: true, analysis_date: new Date().toISOString().split('T')[0] });
                                                        // refresh and auto-select
                                                        await loadData();
                                                        setSelectedVasp(created.id || created);
                                                        setShowCreateVaspForm(false);
                                                        setShowForm(true);
                                                    } catch (err) {
                                                        console.error('Failed to create VA/VASP', err);
                                                        alert('Failed to create VA/VASP');
                                                    }
                                                }}
                                            >
                                                Create VASP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    placeholder="Describe the service..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Register Service
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        All VASP Services ({services.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {services.length === 0 ? (
                        <div className="text-center py-10">
                            <Server className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No VASP services registered.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Service Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Compliance</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {services.map((service) => (
                                        <tr key={service.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{service.service_name}</td>
                                            <td className="p-4 align-middle">{service.service_type}</td>
                                            <td className="p-4 align-middle max-w-md truncate text-gray-600">
                                                {service.description || "—"}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {service.is_active ? (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-gray-400">
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Inactive</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getComplianceColor(service.compliance_status) as any}>
                                                    {service.compliance_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(service.created_at).toLocaleDateString()}
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
