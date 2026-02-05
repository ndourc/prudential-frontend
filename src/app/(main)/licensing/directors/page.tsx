"use client";

import React, { useState, useEffect } from "react";
import DirectorTable from "@/components/licensing/DirectorTable";
import DirectorForm from "@/components/licensing/DirectorForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useDirectors,
  useCreateDirector,
  useUpdateDirector,
  useDeleteDirector,
} from "@/hooks/useDirectors";
import { UserPlus, Loader2, AlertCircle, Users } from "lucide-react";
import type { Director } from "@/types/licensing";

interface DirectorFormData {
  [key: string]: any;
}

export default function DirectorsPage() {
  const [editing, setEditing] = useState<Director | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useDirectors(1);
  const createDirector = useCreateDirector();
  const updateDirector = useUpdateDirector();
  const deleteDirector = useDeleteDirector();

  // Safely extract directors array from response
  const directors: Director[] = React.useMemo(() => {
    if (!data) return [];

    // Handle paginated response
    if (
      typeof data === "object" &&
      "results" in data &&
      Array.isArray(data.results)
    ) {
      return data.results;
    }

    // Handle direct array response
    if (Array.isArray(data)) {
      return data;
    }

    // Handle data wrapped in 'data' property
    if (
      typeof data === "object" &&
      "data" in data &&
      Array.isArray((data as any).data)
    ) {
      return (data as any).data;
    }

    return [];
  }, [data]);

  // Close edit dialog when editing state is cleared
  useEffect(() => {
    if (!editing) {
      setEditDialogOpen(false);
    }
  }, [editing]);

  const handleCreate = async (payload: DirectorFormData) => {
    try {
      await createDirector.mutateAsync(payload);
      setCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create director:", err);
      // Error handling can be shown via toast or alert
    }
  };

  const handleEdit = (id: string | number) => {
    const director = directors.find((d) => String(d.id) === String(id));

    if (director) {
      setEditing(director);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this director? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDirector.mutateAsync(String(id));
    } catch (err) {
      console.error("Failed to delete director:", err);
      // Error handling can be shown via toast or alert
    }
  };

  const handleSave = async (form: DirectorFormData) => {
    try {
      if (editing) {
        await updateDirector.mutateAsync({
          id: String(editing.id),
          payload: form,
        });
        setEditing(null);
        setEditDialogOpen(false);
      } else {
        await createDirector.mutateAsync(form);
        setCreateDialogOpen(false);
      }
    } catch (err) {
      console.error("Failed to save director:", err);
      // throw err; // Don't throw, let the component handle it or show toast
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditDialogOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading directors...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Directors</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load directors.{" "}
            {error instanceof Error ? error.message : "Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Directors</h1>
          <p className="text-muted-foreground mt-1">
            Manage company directors and their credentials
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Director
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Director</DialogTitle>
              <DialogDescription>
                Add a new director to the system. All required fields must be
                completed.
              </DialogDescription>
            </DialogHeader>
            <DirectorForm
              onCancel={() => setCreateDialogOpen(false)}
              onSave={handleSave}
              isSubmitting={createDirector.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Directors</p>
              <p className="text-2xl font-bold">{directors.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Directors</CardTitle>
        </CardHeader>
        <CardContent>
          {directors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No directors found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first director.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                variant="outline"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Your First Director
              </Button>
            </div>
          ) : (
            <DirectorTable
              directors={directors}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isDeleting={deleteDirector.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Director</DialogTitle>
            <DialogDescription>
              Update the director's information below.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <DirectorForm
              initial={editing}
              onCancel={handleCancelEdit}
              onSave={handleSave}
              isSubmitting={updateDirector.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
