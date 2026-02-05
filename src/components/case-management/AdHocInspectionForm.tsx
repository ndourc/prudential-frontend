"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCases } from "@/hooks/useCaseManagement";
import type { AdHocInspection } from "@/service/caseManagement";

const formSchema = z.object({
    case: z.string().min(1, "Case is required"),
    trigger_type: z.string().min(1, "Trigger type is required"),
    inspection_scope: z.string().min(1, "Scope is required"),
    areas_of_focus: z.string().min(1, "Areas of focus are required"),
    immediate_findings: z.string().optional(),
});

export default function AdHocInspectionForm({
    onCancel,
    onSave,
    isSubmitting,
}: {
    onCancel: () => void;
    onSave: (data: Partial<AdHocInspection>) => void;
    isSubmitting?: boolean;
}) {
    const { data: casesData } = useCases(1);
    const cases = (casesData && (casesData as any).results) || (Array.isArray(casesData) ? casesData : []) || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            case: "",
            trigger_type: "COMPLAINT",
            inspection_scope: "",
            areas_of_focus: "",
            immediate_findings: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        onSave(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="case"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Related Case</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a case" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cases.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.case_number} - {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="trigger_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trigger Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select trigger" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="COMPLAINT">Complaint Received</SelectItem>
                                    <SelectItem value="RISK_ALERT">Risk Alert Triggered</SelectItem>
                                    <SelectItem value="REGULATORY_REQUEST">Regulatory Request</SelectItem>
                                    <SelectItem value="INTERNAL_ESCALATION">Internal Escalation</SelectItem>
                                    <SelectItem value="MARKET_INTELLIGENCE">Market Intelligence</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="inspection_scope"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scope</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Define the scope..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="areas_of_focus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Areas of Focus</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g. CDD, record-keeping..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="immediate_findings"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Immediate Findings (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Initial observations..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Schedule Inspection
                    </Button>
                </div>
            </form>
        </Form>
    );
}
