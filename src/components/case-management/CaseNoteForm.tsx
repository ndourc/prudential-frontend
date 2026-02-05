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
import type { CaseNote } from "@/service/caseManagement";
import { useEffect } from "react";

const formSchema = z.object({
    case: z.string().min(1, "Case is required"),
    note: z.string().min(1, "Note content is required"),
});

export default function CaseNoteForm({
    onCancel,
    onSave,
    isSubmitting,
}: {
    onCancel: () => void;
    onSave: (data: Partial<CaseNote>) => void;
    isSubmitting?: boolean;
}) {
    const { data: casesData } = useCases(1); // Assuming we just want to load some cases to select from. Ideally search enabled.

    const cases = (casesData && (casesData as any).results) || (Array.isArray(casesData) ? casesData : []) || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            case: "",
            note: "",
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
                            <FormLabel>Case</FormLabel>
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
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter note details..." {...field} />
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
                        Save Note
                    </Button>
                </div>
            </form>
        </Form>
    );
}
