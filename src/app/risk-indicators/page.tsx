'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import RiskIndicatorForm from "@/components/risk-assessment/riskIndicatorForm";
import { useRiskIndicators } from "@/hooks/useRiskIndicators";
import { Button } from "@/components/ui/button";
import type { RiskIndicator } from "@/types/riskAssessment";

export default function RiskIndicatorsPage() {
  const { indicators, loading, error, listIndicators, createIndicator } =
    useRiskIndicators();
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load indicators on mount
    listIndicators();
  }, []);

  const handleSave = async (data: Partial<RiskIndicator>) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(true);

      await createIndicator(data);
      setSubmitSuccess(true);
      setShowForm(false);

      // Reload indicators
      await listIndicators();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (e: Error | unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to save indicator";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Risk Indicators
            </h1>
            <p className="text-slate-400">
              Monitor and manage key risk indicators across your portfolio
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded">
            ✓ Risk indicator created successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Error Message */}
        {submitError && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        {/* Form Section */}
        {showForm ? (
          <div className="bg-slate-700 rounded-lg p-6 mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-4">
              Create New Risk Indicator
            </h2>
            <RiskIndicatorForm
              onCancel={() => setShowForm(false)}
              onSave={handleSave}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-red-600 hover:bg-red-700 text-white"
          >
            + Create New Indicator
          </Button>
        )}

        {/* Indicators List */}
        <div className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
          <div className="px-6 py-4 border-b border-slate-600 bg-slate-800">
            <h2 className="text-xl font-semibold text-white">
              Indicators ({indicators.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-400">
              Loading indicators...
            </div>
          ) : indicators.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No risk indicators yet. Create your first one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Indicator Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Trend
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Alert Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((indicator) => (
                    <tr
                      key={indicator.id}
                      className="border-b border-slate-600 hover:bg-slate-600/50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {indicator.indicator_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-semibold">
                          {indicator.indicator_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {Number(indicator.current_value).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {Number(indicator.threshold_value).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {indicator.trend}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {indicator.is_breached ? (
                          <span className="px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-semibold">
                            Breached
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-semibold">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            indicator.alert_level === "CRITICAL"
                              ? "bg-red-900/30 text-red-300"
                              : indicator.alert_level === "HIGH"
                                ? "bg-orange-900/30 text-orange-300"
                                : indicator.alert_level === "MEDIUM"
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : "bg-green-900/30 text-green-300"
                          }`}
                        >
                          {indicator.alert_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
