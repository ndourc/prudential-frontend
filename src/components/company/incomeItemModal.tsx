import React, { useState } from "react";
import { IncomeItem } from "@/types/company";
import { X, DollarSign } from "lucide-react";
import Select from "./select";
import TextArea from "./textArea";
import Input from "./input";

const IncomeItemModal: React.FC<{
  item: IncomeItem | null;
  onSave: (item: Omit<IncomeItem, "id">) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<IncomeItem, "id">>(
    item || {
      category: "",
      description: "",
      amount: 0,
      isCore: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {item ? "Edit" : "Add"} Income Item
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={[
              { value: "Brokerage Fees", label: "Brokerage Fees" },
              { value: "Management Fees", label: "Management Fees" },
              { value: "Advisory Fees", label: "Advisory Fees" },
              { value: "Trading Income", label: "Trading Income" },
              { value: "Interest Income", label: "Interest Income" },
              { value: "Other Income", label: "Other Income" },
            ]}
            required
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Provide details about this income item"
            required
          />

          <Input
            label="Amount (USD)"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: Number(e.target.value) })
            }
            icon={DollarSign}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Income Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isCore: true })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  formData.isCore
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                Core Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isCore: false })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  !formData.isCore
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                Non-Core Income
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Income Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default IncomeItemModal;
