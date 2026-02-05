"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ShareholderForm from "@/components/licensing/ShareholderForm";
import {
  useShareholders,
  useCreateShareholder,
  useUpdateShareholder,
  useDeleteShareholder,
} from "@/hooks/useShareholders";

export default function ShareholdersPage() {
  const [editing, setEditing] = useState<any | null>(null);
  const { data, isLoading } = useShareholders(1);
  const createShareholder = useCreateShareholder();
  const updateShareholder = useUpdateShareholder();
  const deleteShareholder = useDeleteShareholder();
  const items = (data && (data as any).results) || (data as any) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shareholders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Shareholder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Shareholder</DialogTitle>
            </DialogHeader>
            <ShareholderForm
              onSave={async (f) => {
                await createShareholder.mutateAsync(f);
              }}
              onCancel={() => {}}
            />
            <DialogFooter>
              <Button variant="ghost">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Ownership %</th>
                <th className="p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">{it.ownership_percentage}</td>
                  <td className="p-2">{it.shareholder_type}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" onClick={() => setEditing(it)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteShareholder.mutate(it.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {editing && (
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-semibold">Edit Shareholder</h3>
                  <ShareholderForm
                    initial={editing}
                    onCancel={() => setEditing(null)}
                    onSave={async (f) => {
                      await updateShareholder.mutateAsync({
                        id: editing.id,
                        payload: f,
                      });
                      setEditing(null);
                    }}
                  />
                </div>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
