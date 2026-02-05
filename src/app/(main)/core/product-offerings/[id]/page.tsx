"use client";
import React from "react";
import { useProductOffering } from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";

export default function ProductOfferingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: product, isLoading } = useProductOffering(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Offering</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : product ? (
          <div className="space-y-2">
            <div>
              <strong>Product:</strong> {product.product_name}
            </div>
            <div>
              <strong>Category:</strong> {product.product_category}
            </div>
            <div>
              <strong>Income Contribution:</strong>{" "}
              {product.income_contribution}
            </div>
            <div>
              <strong>Active:</strong> {product.is_active ? "Yes" : "No"}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
