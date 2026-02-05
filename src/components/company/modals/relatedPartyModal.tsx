import { RelatedParty } from "@/types/company";
import { DollarSign, Info } from "lucide-react";
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

interface RelatedPartyModalProps {
  onSave: (party: Omit<RelatedParty, "id">) => void;
  onCancel: () => void;
}

const RelatedPartyModal: React.FC<RelatedPartyModalProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<RelatedParty, "id">>({
    name: "",
    relationship: "",
    balance: 0,
    type: "receivable",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Related party name must be at least 2 characters";
    }
    if (!formData.relationship) {
      newErrors.relationship = "Relationship is required";
    }
    if (formData.balance <= 0) {
      newErrors.balance = "Balance must be greater than 0";
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
          <DialogTitle>Add Related Party</DialogTitle>
          <DialogDescription>
            Add a related party transaction. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              label="Related Party Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter related party name"
              error={errors.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Relationship"
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              options={[
                { value: "Subsidiary", label: "Subsidiary" },
                { value: "Parent Company", label: "Parent Company" },
                { value: "Affiliate", label: "Affiliate" },
                { value: "Director", label: "Director" },
                { value: "Key Management", label: "Key Management" },
                { value: "Shareholder", label: "Shareholder" },
                {
                  value: "Associated Company",
                  label: "Associated Company",
                },
                { value: "Other", label: "Other" },
              ]}
              error={errors.relationship}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Balance (USD)"
              type="number"
              min="0"
              step="0.01"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: Number(e.target.value) })
              }
              icon={DollarSign}
              error={errors.balance}
              required
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Transaction Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "receivable" | "payable",
                })
              }
              options={[
                { value: "receivable", label: "Receivable (They owe us)" },
                { value: "payable", label: "Payable (We owe them)" },
              ]}
              required
            />
            <div className="flex items-center space-x-2 p-2 rounded bg-gray-50">
              <div
                className={`w-3 h-3 rounded-full ${
                  formData.type === "receivable" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-700">
                {formData.type === "receivable"
                  ? "This amount is owed to us"
                  : "We owe this amount"}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-indigo-800">
                <p className="font-medium">Related Party Disclosure</p>
                <p className="mt-1">
                  Related party transactions must be disclosed for regulatory
                  compliance. Ensure all transactions are:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li className="text-xs">
                    Conducted at arm&apos;s length (fair market value)
                  </li>
                  <li className="text-xs">
                    Properly documented with contracts
                  </li>
                  <li className="text-xs">
                    Approved by the board of directors
                  </li>
                  <li className="text-xs">Disclosed in financial statements</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Related Party</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedPartyModal;
