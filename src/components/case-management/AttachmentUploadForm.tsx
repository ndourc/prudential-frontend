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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCases } from "@/hooks/useCaseManagement";

const formSchema = z.object({
    case: z.string().min(1, "Case is required"),
    file_name: z.string().min(1, "File name is required"),
    file_type: z.string().min(1, "File type is required"),
    description: z.string().optional(),
    file: z.any() // File validation is tricky with Zod, handling manually or basic check
        .refine((file) => file?.length !== 0, "File is required"),
});

export default function AttachmentUploadForm({
    onCancel,
    onSave,
    isSubmitting,
}: {
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    isSubmitting?: boolean;
}) {
    const { data: casesData } = useCases(1);
    const cases = (casesData && (casesData as any).results) || (Array.isArray(casesData) ? casesData : []) || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            case: "",
            file_name: "",
            file_type: "DOCUMENT",
            description: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append("case", values.case);
        formData.append("file_name", values.file_name);
        formData.append("file_type", values.file_type);
        if (values.description) formData.append("description", values.description);
        if (values.file?.[0]) formData.append("file", values.file[0]);

        onSave(formData);
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
                    name="file_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Initial Evidence" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="DOCUMENT">Document</SelectItem>
                                    <SelectItem value="IMAGE">Image</SelectItem>
                                    <SelectItem value="AUDIO">Audio</SelectItem>
                                    <SelectItem value="VIDEO">Video</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                                <Input
                                    {...fieldProps}
                                    type="file"
                                    onChange={(event) => {
                                        onChange(event.target.files);
                                    }}
                                />
                            </FormControl>
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
                                <Input placeholder="Optional description" {...field} />
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
                        Upload
                    </Button>
                </div>
            </form>
        </Form>
    );
}
