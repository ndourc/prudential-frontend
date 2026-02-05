"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import formulaAPI from "@/service/formula";
import type { CalculationFormula } from "@/types/formula";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Copy, CheckCircle2, XCircle } from "lucide-react";

const FORMULA_TYPES = [
    { value: "FSI_SCORE", label: "Financial Stability Index Score" },
    { value: "CAR", label: "Capital Adequacy Ratio" },
    { value: "CREDIT_RISK", label: "Credit Risk" },
    { value: "MARKET_RISK", label: "Market Risk" },
    { value: "LIQUIDITY_RISK", label: "Liquidity Risk" },
    { value: "OPERATIONAL_RISK", label: "Operational Risk" },
    { value: "LEGAL_RISK", label: "Legal Risk" },
    { value: "COMPLIANCE_RISK", label: "Compliance Risk" },
    { value: "STRATEGIC_RISK", label: "Strategic Risk" },
    { value: "REPUTATION_RISK", label: "Reputation Risk" },
    { value: "COMPOSITE_RISK", label: "Composite Risk Rating" },
    { value: "COMPLIANCE_SCORE", label: "Compliance Score" },
];

export default function FormulaManagementPage() {
    const queryClient = useQueryClient();
    const [selectedFormula, setSelectedFormula] = useState<CalculationFormula | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data: formulae, isLoading } = useQuery({
        queryKey: ["formulae"],
        queryFn: () => formulaAPI.listFormulae(),
    });

    const activateMutation = useMutation({
        mutationFn: (id: string) => formulaAPI.activateFormula(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulae"] });
            toast.success("Formula activated successfully");
        },
        onError: () => {
            toast.error("Failed to activate formula");
        },
    });

    const duplicateMutation = useMutation({
        mutationFn: (id: string) => formulaAPI.duplicateFormula(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulae"] });
            toast.success("Formula duplicated successfully");
        },
        onError: () => {
            toast.error("Failed to duplicate formula");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => formulaAPI.deleteFormula(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulae"] });
            toast.success("Formula deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete formula");
        },
    });

    const handleEdit = (formula: CalculationFormula) => {
        setSelectedFormula(formula);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedFormula(null);
        setIsEditing(false);
        setIsDialogOpen(true);
    };

    const groupedFormulae = formulae?.results?.reduce((acc: Record<string, CalculationFormula[]>, formula: CalculationFormula) => {
        if (!acc[formula.formula_type]) {
            acc[formula.formula_type] = [];
        }
        acc[formula.formula_type].push(formula);
        return acc;
    }, {}) || {};

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Formula Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage calculation formulae for risk metrics and compliance scores
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Formula
                </Button>
            </div>

            <Tabs defaultValue={FORMULA_TYPES[0].value} className="w-full">
                <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                    {FORMULA_TYPES.map((type) => (
                        <TabsTrigger key={type.value} value={type.value} className="text-xs">
                            {type.label.split(" ")[0]}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {FORMULA_TYPES.map((type) => (
                    <TabsContent key={type.value} value={type.value} className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{type.label}</CardTitle>
                                <CardDescription>
                                    Manage formulae for {type.label.toLowerCase()} calculations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {groupedFormulae[type.value]?.length > 0 ? (
                                    <div className="space-y-4">
                                        {groupedFormulae[type.value].map((formula) => (
                                            <div
                                                key={formula.id}
                                                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{formula.name}</h3>
                                                            <Badge variant={formula.is_active ? "default" : "secondary"}>
                                                                {formula.is_active ? (
                                                                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Active</>
                                                                ) : (
                                                                    <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                                                                )}
                                                            </Badge>
                                                            <Badge variant="outline">v{formula.version}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {formula.description}
                                                        </p>
                                                        <div className="mt-2 text-xs text-muted-foreground">
                                                            Updated by {formula.updated_by_name || "Unknown"} on{" "}
                                                            {new Date(formula.updated_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(formula)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => duplicateMutation.mutate(formula.id)}
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        {!formula.is_active && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => activateMutation.mutate(formula.id)}
                                                            >
                                                                Activate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>No formulae defined for this type yet.</p>
                                        <Button onClick={handleCreate} variant="outline" className="mt-4">
                                            Create First Formula
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Formula Editor Dialog */}
            <FormulaEditorDialog
                formula={selectedFormula}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                isEditing={isEditing}
            />
        </div>
    );
}

interface FormulaEditorDialogProps {
    formula: CalculationFormula | null;
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
}

function FormulaEditorDialog({ formula, isOpen, onClose, isEditing }: FormulaEditorDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<CalculationFormula>>(
        formula || {
            formula_type: "",
            name: "",
            description: "",
            formula_expression: "",
            variables: {},
            weights: {},
            thresholds: {},
            is_active: false,
            change_notes: "",
        }
    );

    const saveMutation = useMutation({
        mutationFn: (data: Partial<CalculationFormula>) => {
            if (isEditing && formula) {
                return formulaAPI.updateFormula(formula.id, data);
            }
            return formulaAPI.createFormula(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulae"] });
            toast.success(isEditing ? "Formula updated successfully" : "Formula created successfully");
            onClose();
        },
        onError: () => {
            toast.error(isEditing ? "Failed to update formula" : "Failed to create formula");
        },
    });

    const handleSave = () => {
        saveMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Formula" : "Create New Formula"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the formula configuration" : "Define a new calculation formula"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="formula_type">Formula Type</Label>
                        <Select
                            value={formData.formula_type}
                            onValueChange={(value) => setFormData({ ...formData, formula_type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select formula type" />
                            </SelectTrigger>
                            <SelectContent>
                                {FORMULA_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Formula name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what this formula calculates"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="formula_expression">Formula Expression</Label>
                        <Textarea
                            id="formula_expression"
                            value={formData.formula_expression}
                            onChange={(e) => setFormData({ ...formData, formula_expression: e.target.value })}
                            placeholder="Python expression for the formula"
                            rows={4}
                            className="font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="change_notes">Change Notes</Label>
                        <Textarea
                            id="change_notes"
                            value={formData.change_notes}
                            onChange={(e) => setFormData({ ...formData, change_notes: e.target.value })}
                            placeholder="Describe the changes made"
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saveMutation.isPending}>
                        {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
