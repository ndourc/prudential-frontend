"use client";
import React from "react";
import { useSMI } from "@/hooks/useCoreSMIs";
import { Card } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import coreAPI from "@/service/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OffsiteProfilingForm from "@/components/company/offsiteProfilingForm";

export default function SMIPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: smi, isLoading: isSmiLoading } = useSMI(id);

  const { data: profile } = useQuery({
    queryKey: ['offsite-profile', id],
    queryFn: () => coreAPI.getOffsiteProfile(id),
    enabled: !!id
  });

  if (isSmiLoading) {
    return <div>Loading...</div>;
  }

  if (!smi) {
    return <div>SMI Not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-50 rounded-md">
            <span className="text-amber-600 font-bold">SMI</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{smi.company_name}</h1>
            <p className="text-sm text-muted-foreground">
              {smi.license_number} | {smi.status}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Institutional Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="border border-slate-200 dark:border-slate-700 p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Company Name:</span> {smi.company_name}
                </div>
                <div>
                  <span className="font-semibold">License Number:</span> {smi.license_number}
                </div>
                <div>
                  <span className="font-semibold">Address:</span> {smi.address}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {smi.email}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {smi.phone}
                </div>
                <div>
                  <span className="font-semibold">Registration Date:</span> {smi.registration_date}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {smi.status}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <OffsiteProfilingForm initialData={profile} smiId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
