import { Product } from "@/types/company";
import { Calendar, DollarSign, X } from "lucide-react";
import { useState } from "react";
import Input from "../input";
import Select from "../select";

const ProductModal: React.FC<{
  product: Product | null;
  onSave: (product: Omit<Product, "id" | "concentrationPercentage">) => void;
  onCancel: () => void;
}> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<
    Omit<Product, "id" | "concentrationPercentage">
  >(
    product || {
      productName: "",
      productType: "",
      launchDate: "",
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
            {product ? "Edit" : "Add"} Product
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
            label="Product Name"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            required
          />

          <Select
            label="Product Type"
            value={formData.productType}
            onChange={(e) =>
              setFormData({ ...formData, productType: e.target.value })
            }
            options={[
              { value: "Advisory Services", label: "Advisory Services" },
              { value: "Brokerage", label: "Brokerage" },
              { value: "Asset Management", label: "Asset Management" },
              { value: "Trading", label: "Trading" },
              { value: "Other", label: "Other" },
            ]}
            required
          />

          <Input
            label="Launch Date"
            type="date"
            value={formData.launchDate}
            onChange={(e) =>
              setFormData({ ...formData, launchDate: e.target.value })
            }
            icon={Calendar}
            required
          />

          <Input
            label="Income from Product (USD)"
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
              className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProductModal