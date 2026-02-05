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
import { Loader2, Plus, FileText } from "lucide-react";
import { useCaseNotes, useCreateCaseNote } from "@/hooks/useCaseManagement";
import { format } from "date-fns";
import CaseNoteForm from "@/components/case-management/CaseNoteForm";

export default function CaseNotesPage() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useCaseNotes(1);
    const createMutation = useCreateCaseNote();

    const notes = (data && (data as any).results) || (Array.isArray(data) ? data : []) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Case Notes</h1>
                    <p className="text-muted-foreground">
                        Track progress and updates for ongoing cases
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Case Note</DialogTitle>
                        </DialogHeader>
                        <CaseNoteForm
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
                    <CardTitle>Recent Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No case notes found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notes.map((note: any) => (
                                <div key={note.id} className="border rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            <span className="font-semibold text-sm">
                                                Case: {note.case}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {note.created_at ? format(new Date(note.created_at), "PPP p") : "Unknown Date"}
                                        </span>
                                    </div>
                                    <p className="text-sm pt-2 whitespace-pre-wrap">{note.note}</p>
                                    <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                        Author: {note.author || "System"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
