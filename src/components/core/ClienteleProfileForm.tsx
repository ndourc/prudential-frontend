import React, { useEffect, useState } from "react";
import type { ClienteleProfile } from "@/types/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSMIs } from "@/hooks/useCoreSMIs";

export default function ClienteleProfileForm({
    initial,
    onCancel,
    onSave,
    isSubmitting,
}: {
    initial?: ClienteleProfile;
    onCancel?: () => void;
    onSave?: (data: Partial<ClienteleProfile>) => void;
    isSubmitting?: boolean;
}) {
    // Default structure matches schema
    const [form, setForm] = useState<Partial<ClienteleProfile>>(
        initial || {
            smi_id: "",
            client_type: "RETAIL",
            client_count: 0,
            income_contribution: "",
            period: "",
        }
    );

    const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));
    const { data: smis } = useSMIs(1);
    const smiOptions = (Array.isArray(smis) ? smis : smis?.results) || [];

    useEffect(() => {
        if (initial) setForm(initial);
    }, [initial]);

    return (
        <div className="space-y-4">
            <div>
                <Label>SMI</Label>
                <Select
                    value={form.smi_id ? String(form.smi_id) : ""}
                    onValueChange={(val) => update("smi_id", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select SMI" />
                    </SelectTrigger>
                    <SelectContent>
                        {smiOptions.map((s: any) => (
                            <SelectItem key={String(s.id)} value={String(s.id)}>
                                {s.company_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Client Type</Label>
                <Select
                    value={form.client_type ? String(form.client_type) : "RETAIL"}
                    onValueChange={(val) => update("client_type", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="RETAIL">Retail</SelectItem>
                        <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                        <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                        <SelectItem value="CORPORATE">Corporate</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Client Count</Label>
                    <Input
                        type="number"
                        value={form.client_count}
                        onChange={(e) => update("client_count", Number(e.target.value))}
                    />
                </div>
                <div>
                    {/* Typo in backend response 'income_contribution' vs form 'concentrationPercentage' 
               Core types say 'income_contribution' for ClienteleProfile.
           */}
                    <Label>Income Contribution %</Label>
                    <Input
                        type="number"
                        value={form.income_contribution}
                        onChange={(e) => update("income_contribution", e.target.value)}
                    />
                </div>
            </div>
            <div>
                <Label>Period (End Date)</Label>
                <Input
                    type="date"
                    value={form.period}
                    onChange={(e) => update("period", e.target.value)}
                />
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={onCancel} disabled={!!isSubmitting}>
                    Cancel
                </Button>
                <Button onClick={() => onSave?.(form)} disabled={!!isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}
