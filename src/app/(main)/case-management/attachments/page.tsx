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
import { Loader2, Upload, File, Download } from "lucide-react";
import { useAttachments, useUploadAttachment } from "@/hooks/useCaseManagement";
import { format } from "date-fns";
import AttachmentUploadForm from "@/components/case-management/AttachmentUploadForm";

export default function AttachmentsPage() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useAttachments(1);
    const uploadMutation = useUploadAttachment();

    const attachments = (data && (data as any).results) || (Array.isArray(data) ? data : []) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Case Attachments</h1>
                    <p className="text-muted-foreground">
                        Manage documents and files related to cases
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Upload Attachment</DialogTitle>
                        </DialogHeader>
                        <AttachmentUploadForm
                            onCancel={() => setOpen(false)}
                            onSave={async (formData) => {
                                await uploadMutation.mutateAsync(formData);
                                setOpen(false);
                            }}
                            isSubmitting={uploadMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>File Repository</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : attachments.length === 0 ? (
                            <div className="col-span-full text-center p-8 text-muted-foreground">
                                No attachments found.
                            </div>
                        ) : (
                            attachments.map((file: any) => (
                                <div key={file.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <File className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <h3 className="font-semibold truncate max-w-[150px]">{file.file_name}</h3>
                                                <p className="text-xs text-muted-foreground">{file.file_type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {file.description || "No description"}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground">
                                        <span>Uploaded by: {file.uploaded_by || "Unknown"}</span>
                                        <span>Date: {file.uploaded_at ? format(new Date(file.uploaded_at), "MMM d, yyyy") : "-"}</span>
                                        <span className="font-medium text-slate-700">Case ID: {file.case}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                                        <a href={file.file} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-3 w-3" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

