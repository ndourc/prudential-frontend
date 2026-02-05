import { Client } from "@/types/company";
import { Calendar, DollarSign, X } from "lucide-react";
import { useState } from "react";
import Input from "../input";
import Select from "../select";

const ClientModal: React.FC<{
  client: Client | null;
  onSave: (client: Omit<Client, "id" | "concentrationPercentage">) => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<
    Omit<Client, "id" | "concentrationPercentage">
  >(
    client || {
      clientName: "",
      clientType: "",
      onboardingDate: "",
      income: 0,
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
            {client ? "Edit" : "Add"} Client
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
          <Input
            label="Client Name"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
          />

          <Select
            label="Client Type"
            value={formData.clientType}
            onChange={(e) =>
              setFormData({ ...formData, clientType: e.target.value })
            }
            options={[
              { value: "Individual", label: "Individual" },
              { value: "Corporate", label: "Corporate" },
              { value: "Institutional", label: "Institutional" },
              { value: "Government", label: "Government" },
            ]}
            required
          />

          <Input
            label="Onboarding Date"
            type="date"
            value={formData.onboardingDate}
            onChange={(e) =>
              setFormData({ ...formData, onboardingDate: e.target.value })
            }
            icon={Calendar}
            required
          />

          <Input
            label="Income from Client (USD)"
            type="number"
            min="0"
            step="0.01"
            value={formData.income}
            onChange={(e) =>
              setFormData({ ...formData, income: Number(e.target.value) })
            }
            icon={DollarSign}
            required
          />

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
              className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal