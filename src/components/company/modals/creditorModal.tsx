import { useState } from "react";
import { Calendar, DollarSign, Info } from "lucide-react";
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

import { Creditor } from "@/types/company";

interface CreditorModalProps {
  onSave: (creditor: Omit<Creditor, "id">) => void;
  onCancel: () => void;
}

export const CreditorModal: React.FC<CreditorModalProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Creditor, "id">>({
    name: "",
    amount: 0,
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Creditor name must be at least 2 characters";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
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

  const getDaysUntilDue = () => {
    if (!formData.dueDate) return null;
    const today = new Date();
    const due = new Date(formData.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const getDueStatus = () => {
    if (daysUntilDue === null) return null;
    if (daysUntilDue < 0) return { color: "text-red-600", label: "Overdue" };
    if (daysUntilDue <= 7)
      return { color: "text-orange-600", label: "Due Soon" };
    if (daysUntilDue <= 30)
      return { color: "text-yellow-600", label: "Upcoming" };
    return { color: "text-green-600", label: "On Track" };
  };

  const dueStatus = getDueStatus();

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Creditor</DialogTitle>
          <DialogDescription>
            Add a new creditor to track payables. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Creditor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter creditor name"
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
            <Label htmlFor="dueDate">
              Due Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="pl-9"
              />
            </div>
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate}</p>
            )}
            {dueStatus && daysUntilDue !== null && (
              <div className="flex items-center space-x-2 text-sm">
                <Info className={`h-4 w-4 ${dueStatus.color}`} />
                <span className={dueStatus.color}>
                  {dueStatus.label} ({Math.abs(daysUntilDue)} days{" "}
                  {daysUntilDue < 0 ? "overdue" : "remaining"})
                </span>
              </div>
            )}
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Payment Tracking</p>
                <p className="mt-1">
                  Maintain good relationships with creditors by paying on time.
                  Late payments may affect credit terms and business
                  relationships.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Creditor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
