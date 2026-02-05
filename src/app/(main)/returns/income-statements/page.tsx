"use client";

import { useEffect, useState } from "react";
import { IncomeStatement, PrudentialReturn, returnsService } from "@/service/returns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";

export default function IncomeStatementsPage() {
    const [statements, setStatements] = useState<IncomeStatement[]>([]);
    const [returns, setReturns] = useState<PrudentialReturn[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState("");
    const [revenue, setRevenue] = useState("");
    const [operatingExpenses, setOperatingExpenses] = useState("");
    const [netProfit, setNetProfit] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statementsRes, returnsRes] = await Promise.all([
                returnsService.getIncomeStatements(),
                returnsService.getPrudentialReturns(),
            ]);
            const statementsData = Array.isArray(statementsRes) ? statementsRes : statementsRes.results || [];
            const returnsData = Array.isArray(returnsRes) ? returnsRes : returnsRes.results || [];
            setStatements(statementsData);
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
            await returnsService.createIncomeStatement({
                prudential_return: selectedReturn,
                revenue,
                operating_expenses: operatingExpenses,
                net_profit: netProfit,
            });
            setShowForm(false);
            loadData();
            setSelectedReturn("");
            setRevenue("");
            setOperatingExpenses("");
            setNetProfit("");
        } catch (error: any) {
            console.error("Failed to create income statement:", error);
            alert("Failed to create income statement: " + (error.payload ? JSON.stringify(error.payload) : error.message));
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Income Statements</h1>
                    <p className="text-gray-500 mt-2">Track revenue, expenses, and profitability.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showForm ? "Cancel" : "New Statement"}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Income Statement</CardTitle>
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
                                        Revenue *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={revenue}
                                        onChange={(e) => setRevenue(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Operating Expenses *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={operatingExpenses}
                                        onChange={(e) => setOperatingExpenses(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Net Profit *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={netProfit}
                                        onChange={(e) => setNetProfit(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Statement
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        All Income Statements ({statements.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {statements.length === 0 ? (
                        <div className="text-center py-10">
                            <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No income statements found.</p>
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
                                            Revenue
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Operating Expenses
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Net Profit
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {statements.map((stmt) => (
                                        <tr key={stmt.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {stmt.prudential_return}
                                            </td>
                                            <td className="p-4 align-middle text-right font-medium text-green-600">
                                                {formatCurrency(stmt.revenue)}
                                            </td>
                                            <td className="p-4 align-middle text-right text-red-600">
                                                {formatCurrency(stmt.operating_expenses)}
                                            </td>
                                            <td className="p-4 align-middle text-right font-bold">
                                                {formatCurrency(stmt.net_profit)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(stmt.created_at).toLocaleDateString()}
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
