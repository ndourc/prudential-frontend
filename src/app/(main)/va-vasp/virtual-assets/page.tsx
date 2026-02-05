"use client";

import { useEffect, useState } from "react";
import { VirtualAsset, VAVASP, vaVaspService } from "@/service/vaVasp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Coins, TrendingUp } from "lucide-react";

export default function VirtualAssetsPage() {
    const [assets, setAssets] = useState<VirtualAsset[]>([]);
    const [vasps, setVasps] = useState<VAVASP[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedVasp, setSelectedVasp] = useState("");
    const [assetName, setAssetName] = useState("");
    const [assetSymbol, setAssetSymbol] = useState("");
    const [assetType, setAssetType] = useState("CRYPTOCURRENCY");
    const [totalVolume, setTotalVolume] = useState("");
    const [marketValue, setMarketValue] = useState("");
    const [riskRating, setRiskRating] = useState("MEDIUM");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assetsRes, vaspsRes] = await Promise.all([
                vaVaspService.getVirtualAssets(),
                vaVaspService.getVAVASPs(),
            ]);
            const assetsData = Array.isArray(assetsRes) ? assetsRes : assetsRes.results || [];
            const vaspsData = Array.isArray(vaspsRes) ? vaspsRes : vaspsRes.results || [];
            setAssets(assetsData);
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
            await vaVaspService.createVirtualAsset({
                va_vasp_analysis: selectedVasp,
                asset_name: assetName,
                asset_symbol: assetSymbol,
                asset_type: assetType,
                total_volume: totalVolume,
                market_value: marketValue,
                risk_rating: riskRating,
            });
            setShowForm(false);
            loadData();
            // Reset form
            setSelectedVasp("");
            setAssetName("");
            setAssetSymbol("");
            setTotalVolume("");
            setMarketValue("");
        } catch (error: any) {
            console.error("Failed to create virtual asset:", error);
            const raw = error.payload && error.payload.__raw ? error.payload.__raw : null;
            const payloadText = raw || (error.payload ? JSON.stringify(error.payload) : error.message);
            alert("Failed to create virtual asset: " + payloadText);
        }
    };

    const getRiskColor = (risk?: string) => {
        if (!risk) return "outline";
        const r = String(risk).toLowerCase();
        switch (r) {
            case "low": return "secondary";
            case "medium": return "warning";
            case "high":
            case "critical": return "destructive";
            default: return "outline";
        }
    };

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(value));
    };

    const formatVolume = (value: string) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(parseFloat(value));
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Virtual Assets</h1>
                    <p className="text-gray-500 mt-2">Track and monitor virtual assets under VASP management.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Virtual Asset"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {assets.filter(a => a.risk_rating === "HIGH" || a.risk_rating === "CRITICAL").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(assets.reduce((sum, a) => sum + parseFloat(a.market_value || "0"), 0).toString())}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Asset Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(assets.map(a => a.asset_type)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Register New Virtual Asset</CardTitle>
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
                                        Asset Type *
                                    </label>
                                    <select
                                        value={assetType}
                                        onChange={(e) => setAssetType(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="CRYPTOCURRENCY">Cryptocurrency</option>
                                        <option value="TOKEN">Token</option>
                                        <option value="STABLECOIN">Stablecoin</option>
                                        <option value="NFT">NFT</option>
                                        <option value="SECURITY_TOKEN">Security Token</option>
                                        <option value="UTILITY_TOKEN">Utility Token</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asset Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={assetName}
                                        onChange={(e) => setAssetName(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="e.g., Bitcoin"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Symbol *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={assetSymbol}
                                        onChange={(e) => setAssetSymbol(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="e.g., BTC"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Volume *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.00000001"
                                        value={totalVolume}
                                        onChange={(e) => setTotalVolume(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00000000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Market Value (USD) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={marketValue}
                                        onChange={(e) => setMarketValue(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
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
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Register Asset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        All Virtual Assets ({assets.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {assets.length === 0 ? (
                        <div className="text-center py-10">
                            <Coins className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No virtual assets registered.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Asset</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Volume</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Market Value</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Risk Rating</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {assets.map((asset) => (
                                        <tr key={asset.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                <div>
                                                    <div className="font-semibold">{asset.asset_name}</div>
                                                    <div className="text-sm text-gray-500">{asset.asset_symbol}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">{asset.asset_type}</td>
                                            <td className="p-4 align-middle text-right font-mono">
                                                {formatVolume(asset.total_volume)}
                                            </td>
                                            <td className="p-4 align-middle text-right font-semibold text-green-600">
                                                {formatCurrency(asset.market_value)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getRiskColor(asset.risk_rating) as any}>
                                                    {asset.risk_rating}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(asset.created_at).toLocaleDateString()}
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
