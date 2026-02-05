import { Asset } from "@/types/company";
import { Calendar, DollarSign, Info } from "lucide-react";
import { useState } from "react";
import Select from "../select";
import Input from "../input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AssetModalProps {
  onSave: (asset: Omit<Asset, "id">) => void;
  onCancel: () => void;
}

const AssetModal: React.FC<AssetModalProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Asset, "id">>({
    assetType: "",
    category: "",
    value: 0,
    isCurrent: false,
    acquisitionDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetType) {
      newErrors.assetType = "Asset type is required";
    }
    if (!formData.category || formData.category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters";
    }
    if (formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
          <DialogDescription>
            Add a new asset to the balance sheet. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select
              label="Asset Type"
              value={formData.assetType}
              onChange={(e) =>
                setFormData({ ...formData, assetType: e.target.value })
              }
              options={[
                { value: "Fixed Asset", label: "Fixed Asset" },
                { value: "Leased Asset", label: "Leased Asset" },
                { value: "Cash & Equivalents", label: "Cash & Equivalents" },
                { value: "Investments", label: "Investments" },
                { value: "Receivables", label: "Receivables" },
                { value: "Inventory", label: "Inventory" },
                { value: "Intangible Assets", label: "Intangible Assets" },
                { value: "Other", label: "Other" },
              ]}
              error={errors.assetType}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g., Equipment, Property, Inventory"
              error={errors.category}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Value (USD)"
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: Number(e.target.value) })
              }
              icon={DollarSign}
              error={errors.value}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Acquisition Date"
              type="date"
              value={formData.acquisitionDate}
              onChange={(e) =>
                setFormData({ ...formData, acquisitionDate: e.target.value })
              }
              icon={Calendar}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCurrent"
              checked={formData.isCurrent}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isCurrent: checked as boolean })
              }
            />
            <Label
              htmlFor="isCurrent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Current Asset (expected to be converted to cash within 12 months)
            </Label>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Asset Classification</p>
                <p className="mt-1">
                  Current assets are expected to be converted to cash or used
                  within one year. Non-current assets have a longer useful life.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetModal;
