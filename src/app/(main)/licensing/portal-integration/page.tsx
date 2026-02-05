"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PortalIntegrationForm from "@/components/licensing/PortalIntegrationForm";
import {
  usePortalIntegrations,
  useTestPortalIntegration,
  useSyncPortalIntegration,
  useCreatePortalIntegration,
} from "@/hooks/usePortalIntegration";

export default function PortalIntegration() {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = usePortalIntegrations(1);
  const createMutation = useCreatePortalIntegration();
  const testMutation = useTestPortalIntegration();
  const syncMutation = useSyncPortalIntegration();
  const items = (data && (data as any).results) || (data as any) || [];

  const test = async (id: string) => {
    try {
      await testMutation.mutateAsync(id);
      alert("Test triggered");
    } catch (e) {
      alert("Test failed");
    }
  };

  const sync = async (id: string) => {
    try {
      await syncMutation.mutateAsync(id);
      alert("Sync triggered");
    } catch (e) {
      alert("Sync failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Portal Integrations</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Integration</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Portal Integration</DialogTitle>
            </DialogHeader>
            <PortalIntegrationForm
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
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No integrations found. Click "Create Integration" to start.
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Portal name</th>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Sync</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{it.portal_name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{it.api_endpoint}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${it.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {it.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{it.last_sync || 'Never'}</td>
                  <td className="p-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => test(it.id)} disabled={testMutation.isPending}>
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => sync(it.id)}
                      disabled={syncMutation.isPending}
                    >
                      Sync
                    </Button>
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
