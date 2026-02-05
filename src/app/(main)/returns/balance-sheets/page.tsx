
"use client";

import { useEffect, useState } from "react";
import { BalanceSheet, PrudentialReturn, returnsService } from "@/service/returns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Scale } from "lucide-react";

export default function BalanceSheetsPage() {
    const [sheets, setSheets] = useState<BalanceSheet[]>([]);
    const [returns, setReturns] = useState<PrudentialReturn[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState("");
    const [totalAssets, setTotalAssets] = useState("");
    const [totalLiabilities, setTotalLiabilities] = useState("");
    const [equity, setEquity] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sheetsRes, returnsRes] = await Promise.all([
                returnsService.getBalanceSheets(),
                returnsService.getPrudentialReturns(),
            ]);
            const sheetsData = Array.isArray(sheetsRes) ? sheetsRes : sheetsRes.results || [];
            const returnsData = Array.isArray(returnsRes) ? returnsRes : returnsRes.results || [];
            setSheets(sheetsData);
            setReturns(returnsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await returnsService.createBalanceSheet({
                prudential_return: selectedReturn,
                total_assets: totalAssets,
                total_liabilities: totalLiabilities,
                equity,
            });
            setShowForm(false);
            loadData();
            setSelectedReturn("");
            setTotalAssets("");
            setTotalLiabilities("");
            setEquity("");
        } catch (error: any) {
            console.error("Failed to create balance sheet:", error);
            alert("Failed to create balance sheet: " + (error.payload ? JSON.stringify(error.payload) : error.message));
        }
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Balance Sheets</h1>
                    <p className="text-gray-500 mt-2">Monitor assets, liabilities, and equity positions.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Balance Sheet"}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Balance Sheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Prudential Return *
                                </label>
                                <select
                                    required
                                    value={selectedReturn}
                                    onChange={(e) => setSelectedReturn(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Return...</option>
                                    {returns.map((ret) => (
                                        <option key={ret.id} value={ret.id}>
                                            {ret.smi?.company_name} - {ret.reporting_period}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Assets *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={totalAssets}
                                        onChange={(e) => setTotalAssets(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Liabilities *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={totalLiabilities}
                                        onChange={(e) => setTotalLiabilities(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={equity}
                                        onChange={(e) => setEquity(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Assets = Liabilities + Equity
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Balance Sheet
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        All Balance Sheets ({sheets.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sheets.length === 0 ? (
                        <div className="text-center py-10">
                            <Scale className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No balance sheets found.</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Return ID
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Total Assets
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Total Liabilities
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Equity
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {sheets.map((sheet) => (
                                        <tr key={sheet.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {sheet.prudential_return}
                                            </td>
                                            <td className="p-4 align-middle text-right font-medium text-blue-600">
                                                {formatCurrency(sheet.total_assets)}
                                            </td>
                                            <td className="p-4 align-middle text-right text-red-600">
                                                {formatCurrency(sheet.total_liabilities)}
                                            </td>
                                            <td className="p-4 align-middle text-right font-bold text-green-600">
                                                {formatCurrency(sheet.equity)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(sheet.created_at).toLocaleDateString()}
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
