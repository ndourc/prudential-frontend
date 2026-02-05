"use client";

import { useEffect, useState } from "react";
import {
    PrudentialReturn,
    IncomeStatement,
    BalanceSheet,
    returnsService,
} from "@/service/returns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, PieChart, TrendingUp } from "lucide-react";

export default function ReturnsPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "returns" | "income" | "balance">("overview");
    const [loading, setLoading] = useState(true);
    const [returns, setReturns] = useState<PrudentialReturn[]>([]);
    const [incomeStatements, setIncomeStatements] = useState<IncomeStatement[]>([]);
    const [balanceSheets, setBalanceSheets] = useState<BalanceSheet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [returnsRes, incomeRes, balanceRes] = await Promise.all([
                    returnsService.getPrudentialReturns(),
                    returnsService.getIncomeStatements(),
                    returnsService.getBalanceSheets(),
                ]);

                setReturns(returnsRes.results || []);
                setIncomeStatements(incomeRes.results || []);
                setBalanceSheets(balanceRes.results || []);
            } catch (error) {
                console.error("Failed to fetch returns data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "submitted":
            case "approved":
                return "default";
            case "rejected":
                return "destructive";
            case "draft":
            case "pending":
                return "secondary";
            default:
                return "outline";
        }
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(num);
    };

    const totalRevenue = incomeStatements.reduce((sum, item) => sum + parseFloat(item.revenue || "0"), 0);
    const totalAssets = balanceSheets.reduce((sum, item) => sum + parseFloat(item.total_assets || "0"), 0);

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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Prudential Returns</h1>
                    <p className="text-gray-500 mt-2">Manage financial reporting, income statements, and balance sheets.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
                        Overview
                    </Button>
                    <Button variant={activeTab === "returns" ? "default" : "outline"} onClick={() => setActiveTab("returns")}>
                        Returns
                    </Button>
                    <Button variant={activeTab === "income" ? "default" : "outline"} onClick={() => setActiveTab("income")}>
                        Income Statements
                    </Button>
                    <Button variant={activeTab === "balance" ? "default" : "outline"} onClick={() => setActiveTab("balance")}>
                        Balance Sheets
                    </Button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{returns.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Submissions to date
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Aggregated revenue
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                                <PieChart className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Aggregated assets
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {returns.filter(r => r.status.toLowerCase() === 'pending').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting approval
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Returns</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {returns.slice(0, 5).map((ret) => (
                                        <div key={ret.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{ret.reporting_period}</p>
                                                <p className="text-xs text-muted-foreground">Submitted: {new Date(ret.submission_date).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={getStatusColor(ret.status) as any}>{ret.status}</Badge>
                                        </div>
                                    ))}
                                    {returns.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No returns found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Net Profit</span>
                                        <span className="text-sm font-bold">
                                            {formatCurrency(incomeStatements.reduce((sum, item) => sum + parseFloat(item.net_profit || "0"), 0))}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Liabilities</span>
                                        <span className="text-sm font-bold">
                                            {formatCurrency(balanceSheets.reduce((sum, item) => sum + parseFloat(item.total_liabilities || "0"), 0))}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Equity</span>
                                        <span className="text-sm font-bold">
                                            {formatCurrency(balanceSheets.reduce((sum, item) => sum + parseFloat(item.equity || "0"), 0))}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "returns" && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Prudential Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Period</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Submission Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {returns.map((ret) => (
                                        <tr key={ret.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{ret.reporting_period}</td>
                                            <td className="p-4 align-middle">{new Date(ret.submission_date).toLocaleDateString()}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(ret.status) as any}>{ret.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "income" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Income Statements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Revenue</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expenses</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Net Profit</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {incomeStatements.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{formatCurrency(item.revenue)}</td>
                                            <td className="p-4 align-middle">{formatCurrency(item.operating_expenses)}</td>
                                            <td className="p-4 align-middle font-bold">{formatCurrency(item.net_profit)}</td>
                                            <td className="p-4 align-middle">{new Date(item.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "balance" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Balance Sheets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Assets</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Liabilities</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Equity</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {balanceSheets.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{formatCurrency(item.total_assets)}</td>
                                            <td className="p-4 align-middle">{formatCurrency(item.total_liabilities)}</td>
                                            <td className="p-4 align-middle font-bold">{formatCurrency(item.equity)}</td>
                                            <td className="p-4 align-middle">{new Date(item.created_at).toLocaleDateString()}</td>
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

