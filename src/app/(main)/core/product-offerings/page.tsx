"use client";
import React, { useState } from "react";
import { useProductOfferings, useCreateProductOffering } from "@/hooks/useCoreResources";
import { useSMIs } from "@/hooks/useCoreSMIs";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import type { ProductOffering, SMI } from "@/types/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ProductOfferingsPage() {
  const { data, isLoading, isError, error } = useProductOfferings(1);
  const items = (Array.isArray(data) ? data : data?.results) || ([] as ProductOffering[]);

  const { data: smisData } = useSMIs();
  const smis = (Array.isArray(smisData) ? smisData : smisData?.results) || ([] as SMI[]);

  const createMutation = useCreateProductOffering();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_category: "",
    income_contribution: "",
    smi_id: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        ...formData,
        income_contribution: Number(formData.income_contribution) as any // Cast for backend handling
      } as any,
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Product offering created");
          setFormData({
            product_name: "",
            product_category: "",
            income_contribution: "",
            smi_id: ""
          });
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Product Offerings</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load product offerings"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Offerings</h1>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Product Offering</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>SMI</Label>
                  <Select
                    value={formData.smi_id}
                    onValueChange={(val) => setFormData({ ...formData, smi_id: val })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMI" />
                    </SelectTrigger>
                    <SelectContent>
                      {smis.map(smi => (
                        <SelectItem key={String(smi.id)} value={String(smi.id)}>
                          {smi.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={formData.product_name}
                    onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.product_category}
                    onChange={e => setFormData({ ...formData, product_category: e.target.value })}
                    required
                    placeholder="e.g. Mutual Fund"
                  />
                </div>
                <div>
                  <Label>Income Contribution (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.income_contribution}
                    onChange={e => setFormData({ ...formData, income_contribution: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        <div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No product offerings found
              </h3>
              <p className="text-muted-foreground mb-4">
                Add a product offering to get started.
              </p>
            </div>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Income Contribution</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: ProductOffering) => (
                  <tr key={String(it.id)} className="border-t">
                    <td className="p-2">{it.product_name}</td>
                    <td className="p-2">{it.product_category}</td>
                    <td className="p-2">{it.income_contribution}</td>
                    <td className="p-2">
                      <Link href={`/core/product-offerings/${it.id}`}>
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
      </Card>
    </div>
  );
}
