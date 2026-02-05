"use client";
import React, { useState, useMemo } from "react";
import { useBoardMembers, useCreateBoardMember, useUpdateBoardMember, useDeleteBoardMember } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BoardMemberForm from "@/components/core/BoardMemberForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import type { BoardMember } from "@/types/core";

export default function BoardMembersPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<unknown | null>(null);

  const { data, isLoading, isError, error } = useBoardMembers(1);
  const createBoardMember = useCreateBoardMember();
  const updateBoardMember = useUpdateBoardMember();
  const deleteBoardMember = useDeleteBoardMember();
  const items =
    (Array.isArray(data) ? data : data?.results) || ([] as BoardMember[]);

  // Memoize items
  const members = useMemo(() => items, [items]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading board members...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Board Members</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load board members. {error instanceof Error ? error.message : "Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Board Members</h1>
        <div className="flex gap-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                New Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Board Member</DialogTitle>
                <DialogDescription>Set board member details</DialogDescription>
              </DialogHeader>
              <BoardMemberForm
                onCancel={() => setCreateDialogOpen(false)}
                onSave={async (payload) => {
                  try {
                    await createBoardMember.mutateAsync(payload as unknown);
                    setCreateDialogOpen(false);
                  } catch (err) {
                    console.error("Failed to create board member:", err);
                  }
                }}
                isSubmitting={createBoardMember.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
          <div>
            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No board members found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first board member.</p>
                <Button onClick={() => setCreateDialogOpen(true)} variant="outline">Add Board Member</Button>
              </div>
            ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Position</th>
                <th className="p-2">Appointment</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((bm: BoardMember) => (
                <tr key={String(bm.id)} className="border-t">
                  <td className="p-2">{bm.name}</td>
                  <td className="p-2">{bm.position}</td>
                  <td className="p-2">{bm.appointment_date}</td>
                  <td className="p-2">
                    <Link href={`/core/board-members/${bm.id}`}>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            )}
          </div>
        )
  
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Board Member</DialogTitle>
          </DialogHeader>
          {editing && (
            <BoardMemberForm
              initial={editing}
              onCancel={() => setEditDialogOpen(false)}
              onSave={async (payload) => {
                try {
                  await updateBoardMember.mutateAsync({ id: String(editing.id), payload } as unknown);
                  setEditing(null);
                  setEditDialogOpen(false);
                } catch (err) {
                  console.error("Failed to update board member:", err);
                }
              }}
              isSubmitting={updateBoardMember.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
