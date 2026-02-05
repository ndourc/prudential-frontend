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
import type { CaseTimeline } from "@/service/caseManagement";

const formSchema = z.object({
    case: z.string().min(1, "Case is required"),
    event_type: z.string().min(1, "Event type is required"),
    description: z.string().min(1, "Description is required"),
    notes: z.string().optional(),
});

export default function TimelineEventForm({
    onCancel,
    onSave,
    isSubmitting,
}: {
    onCancel: () => void;
    onSave: (data: Partial<CaseTimeline>) => void;
    isSubmitting?: boolean;
}) {
    const { data: casesData } = useCases(1);
    const cases = (casesData && (casesData as any).results) || (Array.isArray(casesData) ? casesData : []) || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            case: "",
            event_type: "CASE_OPENED",
            description: "",
            notes: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Current date for event_date? Or let backend handle it (defaults to now).
        // Or add a field for date. Backend defaults to now.
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
                            <FormLabel>Case</FormLabel>
                            <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v)}>
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
                    name="event_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v)}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="CASE_OPENED">Case Opened</SelectItem>
                                    <SelectItem value="ASSIGNED">Case Assigned</SelectItem>
                                    <SelectItem value="INVESTIGATION_STARTED">Investigation Started</SelectItem>
                                    <SelectItem value="INSPECTION_SCHEDULED">Inspection Scheduled</SelectItem>
                                    <SelectItem value="INSPECTION_COMPLETED">Inspection Completed</SelectItem>
                                    <SelectItem value="FINDINGS_REPORTED">Findings Reported</SelectItem>
                                    <SelectItem value="ACTIONS_TAKEN">Actions Taken</SelectItem>
                                    <SelectItem value="CASE_RESOLVED">Case Resolved</SelectItem>
                                    <SelectItem value="CASE_CLOSED">Case Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Event description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Any extra details..." {...field} />
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
                        Add Event
                    </Button>
                </div>
            </form>
        </Form>
    );
}
