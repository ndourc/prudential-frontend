"use client";

import { useState, useEffect } from "react";
import { complianceService, ComplianceIndex } from "@/service/compliance";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";

export default function ComplianceIndexPage() {
    const [indices, setIndices] = useState<ComplianceIndex[]>([]);
    const [smis, setSmis] = useState<SMI[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [selectedSmi, setSelectedSmi] = useState("");
    const [period, setPeriod] = useState(new Date().toISOString().split("T")[0]);
    const [analysisPeriod, setAnalysisPeriod] = useState("QUARTERLY");
    const [totalResponses, setTotalResponses] = useState(0);
    const [totalYes, setTotalYes] = useState(0);
    const [totalNo, setTotalNo] = useState(0);
    const [totalBlank, setTotalBlank] = useState(0);
    const [positiveWeight, setPositiveWeight] = useState(1.0);
    const [negativeWeight, setNegativeWeight] = useState(1.0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [indicesData, smisData] = await Promise.all([
                complianceService.getComplianceIndices(),
                coreAPI.listSMIs(),
            ]);
            setIndices(
                Array.isArray(indicesData) ? indicesData : indicesData.results || []
            );
            setSmis(Array.isArray(smisData) ? smisData : smisData.results || []);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await complianceService.createComplianceIndex({
                smi_id: selectedSmi,
                period,
                analysis_period: analysisPeriod,
                total_responses: Number(totalResponses),
                total_yes: Number(totalYes),
                total_no: Number(totalNo),
                total_blank: Number(totalBlank),
                positive_weight: Number(positiveWeight),
                negative_weight: Number(negativeWeight),
            } as any); // Cast to any or Partial<ComplianceIndex> if needed, though we added smi_id to interface
            setShowForm(false);
            loadData();
        } catch (error: any) {
            console.error("Failed to create index:", error);
            let errorMessage = "Failed to create compliance index";
            if (error.payload) {
                errorMessage += ": " + JSON.stringify(error.payload);
            } else if (error.message) {
                errorMessage += ": " + error.message;
            }
            alert(errorMessage);
        }
    };

    const getComplianceLevel = (score: number) => {
        // 0.0 - 0.20 Critical
        // 0.21 - 0.40 Weak
        // 0.41 - 0.60 Fair
        // 0.61 - 0.80 Satisfactory
        // 0.81 - 1.0 Strong
        // Note: Score is 0-100 in backend, so divide by 100
        const ratio = score / 100;
        if (ratio <= 0.2) return { label: "Critical", color: "text-red-600" };
        if (ratio <= 0.4) return { label: "Weak", color: "text-orange-600" };
        if (ratio <= 0.6) return { label: "Fair", color: "text-yellow-600" };
        if (ratio <= 0.8) return { label: "Satisfactory", color: "text-blue-600" };
        return { label: "Strong", color: "text-green-600" };
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Compliance Level Index (CLI)
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "New Calculation"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Calculate New Compliance Index
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select SMI
                                </label>
                                <select
                                    required
                                    value={selectedSmi}
                                    onChange={(e) => setSelectedSmi(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Company...</option>
                                    {smis.map((smi) => (
                                        <option key={smi.id} value={smi.id}>
                                            {smi.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Analysis Period
                                </label>
                                <select
                                    value={analysisPeriod}
                                    onChange={(e) => setAnalysisPeriod(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="QUARTERLY">Quarterly</option>
                                    <option value="ANNUAL">Annual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-md font-medium mb-2">Formula Inputs</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Formula: CI = (Sum((Y * 0.5Pi - N * Bi)) / R) + 99%
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Total Responses (R)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={totalResponses}
                                        onChange={(e) => setTotalResponses(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Total Yes (Y)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={totalYes}
                                        onChange={(e) => setTotalYes(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Total No (N)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={totalNo}
                                        onChange={(e) => setTotalNo(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Total Blank (B)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={totalBlank}
                                        onChange={(e) => setTotalBlank(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Positive Weight (Pi)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={positiveWeight}
                                        onChange={(e) => setPositiveWeight(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">
                                        Negative Weight (Bi)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={negativeWeight}
                                        onChange={(e) => setNegativeWeight(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                                Calculate & Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Inputs (Y/N/B/R)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {indices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No compliance indices found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            indices.map((index) => {
                                const level = getComplianceLevel(index.final_compliance_score);
                                const smiName = index.smi?.company_name || "Unknown SMI";
                                return (
                                    <tr key={index.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {smiName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index.period} ({index.analysis_period})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {index.final_compliance_score.toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${level.color}`}>
                                                {level.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index.total_yes}/{index.total_no}/{index.total_blank}/
                                            {index.total_responses}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
