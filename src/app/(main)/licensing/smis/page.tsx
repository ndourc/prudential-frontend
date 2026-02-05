"use client";
import React from "react";
import { useSMIs } from "@/hooks/useCoreSMIs"; // Using Core hook as per "consistency" requirement
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import type { SMI } from "@/types/core";

export default function LicensedSMIsPage() {
    const { data, isLoading, isError } = useSMIs(1);
    // In a real scenario, we might want to filter by status or have a specific API endpoint
    // for "Licensed" SMIs, but for now we list all and show their status.
    const items = (Array.isArray(data) ? data : data?.results) || ([] as SMI[]);

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 text-red-500">
                <AlertCircle className="w-6 h-6 inline-block mr-2" />
                Failed to load SMIs.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Licensed SMIs</h1>
                <div className="flex gap-2">
                    {/* Action buttons could go here */}
                </div>
            </div>
            <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
                <table className="w-full table-auto text-sm">
                    <thead>
                        <tr className="text-left text-muted-foreground">
                            <th className="p-2">Company Name</th>
                            <th className="p-2">License Number</th>
                            <th className="p-2">Business Type</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((smi: SMI) => (
                            <tr key={String(smi.id)} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <td className="p-2 font-medium">{smi.company_name}</td>
                                <td className="p-2">{smi.license_number}</td>
                                <td className="p-2">{smi.business_type}</td>
                                <td className="p-2">
                                    <Badge variant={smi.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {smi.status || 'Unknown'}
                                    </Badge>
                                </td>
                                <td className="p-2">
                                    <Link href={`/core/smis/${smi.id}?tab=institutional-profile`}>
                                        <Button size="sm" variant="ghost">
                                            View Profile
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
