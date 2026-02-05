import { useState } from "react";
import { Calendar, DollarSign } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {

  Liability,

} from "@/types/company";
interface LiabilityModalProps {
  onSave: (liability: Omit<Liability, "id">) => void;
  onCancel: () => void;
}

export const LiabilityModal: React.FC<LiabilityModalProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Liability, "id">>({
    liabilityType: "",
    category: "",
    value: 0,
    isCurrent: false,
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // if (!formData.liabilityType) {
    //   newErrors.liabilityType = "Liability type is required";
    // }
    if (!formData.category) {
      newErrors.category = "Category is required";
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
          <DialogTitle>Add Liability</DialogTitle>
          <DialogDescription>
            Add a new liability to the balance sheet. All fields marked with *
            are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="liabilityType">
              Liability Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.liabilityType}
              onValueChange={(value) =>
                setFormData({ ...formData, liabilityType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select liability type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="Payable">Payable</SelectItem>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="Bond">Bond</SelectItem>
                <SelectItem value="Accrued Expenses">
                  Accrued Expenses
                </SelectItem>
                <SelectItem value="Deferred Revenue">
                  Deferred Revenue
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.liabilityType && (
              <p className="text-sm text-red-500">{errors.liabilityType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g., Bank Loan, Trade Payables"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              Value (USD) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                className="pl-9"
              />
            </div>
            {errors.value && (
              <p className="text-sm text-red-500">{errors.value}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCurrent"
              checked={formData.isCurrent}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isCurrent: checked as boolean })
              }
            />
            <Label htmlFor="isCurrent" className="cursor-pointer">
              Current Liability (due within 12 months)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Liability</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
