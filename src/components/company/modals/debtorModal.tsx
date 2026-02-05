import { useState } from "react";
import { DollarSign, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Debtor } from "@/types/company";

interface DebtorModalProps {
  onSave: (debtor: Omit<Debtor, "id">) => void;
  onCancel: () => void;
}

export const DebtorModal: React.FC<DebtorModalProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Debtor, "id">>({
    name: "",
    amount: 0,
    ageDays: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Debtor name must be at least 2 characters";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (formData.ageDays < 0) {
      newErrors.ageDays = "Age days cannot be negative";
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

  const getAgeStatus = (days: number) => {
    if (days > 90)
      return { color: "text-red-600", label: "Overdue (90+ days)" };
    if (days > 60)
      return { color: "text-yellow-600", label: "Warning (60-90 days)" };
    if (days > 30)
      return { color: "text-orange-600", label: "Attention (30-60 days)" };
    return { color: "text-green-600", label: "Current (0-30 days)" };
  };

  const ageStatus = getAgeStatus(formData.ageDays);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Debtor</DialogTitle>
          <DialogDescription>
            Add a new debtor to track receivables. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Debtor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter debtor name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount Owed (USD) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                className="pl-9"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageDays">
              Age (Days) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ageDays"
              type="number"
              min="0"
              value={formData.ageDays}
              onChange={(e) =>
                setFormData({ ...formData, ageDays: Number(e.target.value) })
              }
              placeholder="Number of days outstanding"
            />
            {errors.ageDays && (
              <p className="text-sm text-red-500">{errors.ageDays}</p>
            )}
            {formData.ageDays >= 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <Info className={`h-4 w-4 ${ageStatus.color}`} />
                <span className={ageStatus.color}>{ageStatus.label}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Age Indicates Outstanding Period</p>
                <p className="mt-1">
                  The age represents how many days the debt has been
                  outstanding. Industry best practice is to collect within 30-60
                  days.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Debtor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
