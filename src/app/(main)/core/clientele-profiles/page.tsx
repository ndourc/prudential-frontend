"use client";
import React from "react";
import { useClienteleProfiles } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClienteleProfileForm from "@/components/core/ClienteleProfileForm";
import { useCreateClienteleProfile } from "@/hooks/useCoreResources";
import type { ClienteleProfile } from "@/types/core";

export default function ClienteleProfilesPage() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const { data, isLoading } = useClienteleProfiles(1);
  const createProfile = useCreateClienteleProfile();
  const items =
    (Array.isArray(data) ? data : data?.results) || ([] as ClienteleProfile[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientele Profiles</h1>
        <div className="flex gap-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                New Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>New Clientele Profile</DialogTitle>
                <DialogDescription>
                  Add a new clientele profile record/segment for an SMI
                </DialogDescription>
              </DialogHeader>
              <ClienteleProfileForm
                onCancel={() => setCreateOpen(false)}
                onSave={(payload) => {
                  createProfile.mutate(payload, {
                    onSuccess: () => setCreateOpen(false),
                  });
                }}
                isSubmitting={createProfile.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Company</th>
                <th className="p-2">Classification</th>
                <th className="p-2">Income %</th>
                <th className="p-2">Count</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i: ClienteleProfile) => (
                <tr key={String(i.id)} className="border-t">
                  <td className="p-2">{i.smi?.company_name}</td>
                  <td className="p-2">{i.client_type}</td>
                  <td className="p-2">{i.income_contribution}</td>
                  <td className="p-2">{i.client_count}</td>
                  <td className="p-2">
                    <Link href={`/core/clientele-profiles/${i.id}`}>
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
      </Card>
    </div>
  );
}
