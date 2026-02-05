"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CalculationBreakdown } from "@/types/formula";

interface CalculationBreakdownCardProps {
    breakdown: CalculationBreakdown;
    title?: string;
}

export default function CalculationBreakdownCard({ breakdown, title }: CalculationBreakdownCardProps) {
    const formatValue = (value: number) => {
        return value.toFixed(2);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title || breakdown.calculation_type.replace(/_/g, " ")}</CardTitle>
                <CardDescription>
                    Calculated on {new Date(breakdown.calculated_at).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Final Result */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Final Value</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {breakdown.final_percentage ? formatPercentage(parseFloat(breakdown.final_percentage)) : formatValue(parseFloat(breakdown.final_value))}
                            </p>
                        </div>
                        {breakdown.final_percentage && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">Raw Score</p>
                                <p className="text-xl font-semibold">{formatValue(parseFloat(breakdown.final_value))}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Components Breakdown */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contributing Factors</h3>
                    {breakdown.components.map((component, index) => (
                        <div key={index} className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium">{component.name}</p>
                                    <p className="text-sm text-muted-foreground">{component.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        {formatPercentage(component.impact_percentage)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Impact</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <Progress value={component.impact_percentage} className="h-2" />

                            {/* Detailed Metrics */}
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Value</p>
                                    <p className="font-medium">{formatValue(component.value)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Weight</p>
                                    <p className="font-medium">{formatPercentage(component.weight * 100)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Contribution</p>
                                    <p className="font-medium">{formatValue(component.contribution)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-muted-foreground">
                        Calculated by: {breakdown.calculated_by} | Type: {breakdown.calculation_type}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
