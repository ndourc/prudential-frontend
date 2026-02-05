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
import { Loader2, Plus, Clock, CircleDot } from "lucide-react";
import { useTimeline, useCreateTimelineEvent } from "@/hooks/useCaseManagement";
import { format } from "date-fns";
import TimelineEventForm from "@/components/case-management/TimelineEventForm";

export default function CaseTimelinePage() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useTimeline(1);
    const createMutation = useCreateTimelineEvent();

    const events = (data && (data as any).results) || (Array.isArray(data) ? data : []) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Case Timeline</h1>
                    <p className="text-muted-foreground">
                        Chronological tracking of case events
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Timeline Event</DialogTitle>
                        </DialogHeader>
                        <TimelineEventForm
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
                    <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No timeline events found.
                        </div>
                    ) : (
                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                            {events.map((event: any) => (
                                <div key={event.id} className="mb-10 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <CircleDot className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                                    </span>
                                    <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-800 dark:border-gray-700">
                                        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                            {event.event_date ? format(new Date(event.event_date), "PPP p") : "Unknown Date"}
                                        </time>
                                        <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                            <span className="font-semibold text-gray-900 dark:text-white hover:underline">
                                                {event.event_type.replace(/_/g, " ")}
                                            </span>
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 ml-3">
                                                Case: {event.case}
                                            </span>
                                            <div className="mt-2 p-2 text-xs font-normal bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                                {event.description}
                                            </div>
                                        </div>
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

