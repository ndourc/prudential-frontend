"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Search, Calendar } from "lucide-react";
import { useAdHocInspections, useCreateAdHocInspection } from "@/hooks/useCaseManagement";
import { format } from "date-fns";
import AdHocInspectionForm from "@/components/case-management/AdHocInspectionForm";
import { Badge } from "@/components/ui/badge";

export default function AdHocInspectionsPage() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useAdHocInspections(1);
    const createMutation = useCreateAdHocInspection();

    const inspections = (data && (data as any).results) || (Array.isArray(data) ? data : []) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ad-hoc Inspections</h1>
                    <p className="text-muted-foreground">
                        Manage unscheduled inspections triggered by events
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Inspection
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Schedule Ad-hoc Inspection</DialogTitle>
                        </DialogHeader>
                        <AdHocInspectionForm
                            onCancel={() => setOpen(false)}
                            onSave={async (data) => {
                                await createMutation.mutateAsync(data);
                                setOpen(false);
                            }}
                            isSubmitting={createMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inspection List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="p-4">Case</th>
                                    <th className="p-4">Trigger</th>
                                    <th className="p-4">Scope</th>
                                    <th className="p-4">Date Created</th>
                                    <th className="p-4">Inspectors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : inspections.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No ad-hoc inspections found.
                                        </td>
                                    </tr>
                                ) : (
                                    inspections.map((insp: any) => (
                                        <tr key={insp.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4 font-medium">{insp.case}</td>
                                            <td className="p-4">
                                                <Badge variant="secondary">{insp.trigger_type.replace(/_/g, " ")}</Badge>
                                            </td>
                                            <td className="p-4 max-w-xs truncate" title={insp.inspection_scope}>
                                                {insp.inspection_scope}
                                            </td>
                                            <td className="p-4">
                                                {insp.created_at ? format(new Date(insp.created_at), "MMM d, yyyy") : "-"}
                                            </td>
                                            <td className="p-4">
                                                {insp.inspectors && insp.inspectors.length > 0
                                                    ? insp.inspectors.join(", ")
                                                    : "Unassigned"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
