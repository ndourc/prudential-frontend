"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InstitutionalProfileForm from "@/components/licensing/InstitutionalProfileForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useInstitutionalProfiles,
  useCreateInstitutionalProfile,
  useUpdateInstitutionalProfile,
  useDeleteInstitutionalProfile,
} from "@/hooks/useInstitutionalProfiles";

export default function InstitutionalProfilesPage() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useInstitutionalProfiles(1);
  const createProfile = useCreateInstitutionalProfile();
  const updateProfile = useUpdateInstitutionalProfile();
  const deleteProfile = useDeleteInstitutionalProfile();
  const profiles = (data && (data as any).results) || (data as any) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Institutional Profiles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">New Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Institutional Profile</DialogTitle>
            </DialogHeader>
            <InstitutionalProfileForm
              onSave={async (f) => {
                try {
                  await createProfile.mutateAsync(f);
                  setOpen(false);
                } catch (e) {
                  console.error(e);
                }
              }}
              onCancel={() => setOpen(false)}
              isSubmitting={createProfile.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="p-2">Company Name</th>
                <th className="p-2">License Number</th>
                <th className="p-2">Business Model</th>
                <th className="p-2">Risk Appetite</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((it: any) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2">{it.smi?.company_name || 'N/A'}</td>
                  <td className="p-2">{it.smi?.license_number || 'N/A'}</td>
                  <td className="p-2">{it.business_model}</td>
                  <td className="p-2">{it.risk_appetite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
