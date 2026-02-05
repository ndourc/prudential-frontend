
import React, { useState, useEffect } from "react";
import type { PortalIntegration } from "@/types/licensing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function PortalIntegrationForm({
    initial,
    onCancel,
    onSave,
    isSubmitting,
}: {
    initial?: PortalIntegration;
    onCancel?: () => void;
    onSave?: (data: Partial<PortalIntegration>) => void;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState<Partial<PortalIntegration>>(
        initial || {
            portal_name: "",
            api_endpoint: "",
            api_key: "",
            status: "ACTIVE",
            sync_frequency: "DAILY",
            auto_sync_enabled: true,
        }
    );

    const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

    useEffect(() => {
        if (initial) setForm(initial);
    }, [initial]);

    return (
        <div className="space-y-4">
            <div>
                <Label>Portal Name</Label>
                <Input
                    value={form.portal_name}
                    onChange={(e) => update("portal_name", e.target.value)}
                    placeholder="e.g. External Licensing Portal"
                />
            </div>

            <div>
                <Label>API Endpoint</Label>
                <Input
                    value={form.api_endpoint}
                    onChange={(e) => update("api_endpoint", e.target.value)}
                    placeholder="https://api.example.com"
                />
            </div>

            <div>
                <Label>API Key</Label>
                <Input
                    type="password"
                    value={form.api_key}
                    onChange={(e) => update("api_key", e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Status</Label>
                    <Select
                        value={form.status}
                        onValueChange={(val) => update("status", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="ERROR">Error</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Sync Frequency</Label>
                    <Select
                        value={form.sync_frequency}
                        onValueChange={(val) => update("sync_frequency", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="HOURLY">Hourly</SelectItem>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="auto_sync"
                    checked={form.auto_sync_enabled}
                    onCheckedChange={(checked) => update("auto_sync_enabled", checked)}
                />
                <Label htmlFor="auto_sync">Enable Auto Sync</Label>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button onClick={() => onSave?.(form)} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}
