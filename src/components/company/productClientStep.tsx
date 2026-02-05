import {
  calculateConcentration,
  formatCurrency,
  generateId,
} from "@/lib/company";
import { Client, Product } from "@/types/company";
import { Package, Plus, UserCheck } from "lucide-react";
import { useState } from "react";
import ClientModal from "./modals/clientModal";
import ProductModal from "./modals/productModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductsClientsStepProps {
  data: {
    products: Product[];
    clients: Client[];
  };
  onChange: (data: any) => void;
  errors: any;
}

const ProductsClientsStep: React.FC<ProductsClientsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const totalProductIncome = data.products.reduce(
    (sum, p) => sum + p.income,
    0
  );
  const totalClientIncome = data.clients.reduce((sum, c) => sum + c.income, 0);

  const addProduct = (
    product: Omit<Product, "id" | "concentrationPercentage">
  ) => {
    const concentration = calculateConcentration(
      product.income,
      totalProductIncome + product.income
    );
    const newProduct = {
      ...product,
      id: generateId(),
      concentrationPercentage: concentration,
    };

    // Recalculate all concentrations
    const updatedProducts = [...data.products, newProduct].map((p) => ({
      ...p,
      concentrationPercentage: calculateConcentration(
        p.income,
        totalProductIncome + product.income
      ),
    }));

    onChange({ ...data, products: updatedProducts });
    setShowProductForm(false);
  };

  const updateProduct = (
    id: string,
    product: Omit<Product, "id" | "concentrationPercentage">
  ) => {
    const updatedProducts = data.products.map((p) =>
      p.id === id ? { ...product, id, concentrationPercentage: 0 } : p
    );

    const newTotal = updatedProducts.reduce((sum, p) => sum + p.income, 0);
    const recalculated = updatedProducts.map((p) => ({
      ...p,
      concentrationPercentage: calculateConcentration(p.income, newTotal),
    }));

    onChange({ ...data, products: recalculated });
    setEditingProduct(null);
  };

  const removeProduct = (id: string) => {
    const filtered = data.products.filter((p) => p.id !== id);
    const newTotal = filtered.reduce((sum, p) => sum + p.income, 0);
    const recalculated = filtered.map((p) => ({
      ...p,
      concentrationPercentage: calculateConcentration(p.income, newTotal),
    }));
    onChange({ ...data, products: recalculated });
  };

  const addClient = (
    client: Omit<Client, "id" | "concentrationPercentage">
  ) => {
    const concentration = calculateConcentration(
      client.income,
      totalClientIncome + client.income
    );
    const newClient = {
      ...client,
      id: generateId(),
      concentrationPercentage: concentration,
    };

    const updatedClients = [...data.clients, newClient].map((c) => ({
      ...c,
      concentrationPercentage: calculateConcentration(
        c.income,
        totalClientIncome + client.income
      ),
    }));

    onChange({ ...data, clients: updatedClients });
    setShowClientForm(false);
  };

  const updateClient = (
    id: string,
    client: Omit<Client, "id" | "concentrationPercentage">
  ) => {
    const updatedClients = data.clients.map((c) =>
      c.id === id ? { ...client, id, concentrationPercentage: 0 } : c
    );

    const newTotal = updatedClients.reduce((sum, c) => sum + c.income, 0);
    const recalculated = updatedClients.map((c) => ({
      ...c,
      concentrationPercentage: calculateConcentration(c.income, newTotal),
    }));

    onChange({ ...data, clients: recalculated });
    setEditingClient(null);
  };

  const removeClient = (id: string) => {
    const filtered = data.clients.filter((c) => c.id !== id);
    const newTotal = filtered.reduce((sum, c) => sum + c.income, 0);
    const recalculated = filtered.map((c) => ({
      ...c,
      concentrationPercentage: calculateConcentration(c.income, newTotal),
    }));
    onChange({ ...data, clients: recalculated });
  };

  return (
    <div className="space-y-6">
      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Package className="w-6 h-6 mr-2 text-purple-500" />
              Products & Services
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Income: {formatCurrency(totalProductIncome)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowProductForm(true)}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>

        {errors?.products && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.products}
          </div>
        )}

        {data.products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No products added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">{product.productType}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-600">
                      Income: {formatCurrency(product.income)}
                    </span>
                    <span className="text-sm font-medium text-purple-600">
                      Concentration:{" "}
                      {product.concentrationPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 w-full max-w-xs">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          product.concentrationPercentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clients Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-indigo-500" />
              Client Profile
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Income: {formatCurrency(totalClientIncome)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowClientForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>

        {errors?.clients && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.clients}
          </div>
        )}

        {data.clients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No clients added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {client.clientName}
                  </h3>
                  <p className="text-sm text-gray-600">{client.clientType}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-600">
                      Income: {formatCurrency(client.income)}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      Concentration: {client.concentrationPercentage.toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 w-full max-w-xs">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          client.concentrationPercentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingClient(client)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeClient(client.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Dialog */}
      <Dialog
        open={showProductForm || !!editingProduct}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setShowProductForm(false);
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <ProductModal
              product={editingProduct}
              onSave={(product) => {
                if (editingProduct) {
                  updateProduct(editingProduct.id, product);
                } else {
                  addProduct(product);
                }
              }}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Client Dialog */}
      <Dialog
        open={showClientForm || !!editingClient}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setShowClientForm(false);
            setEditingClient(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add Client"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <ClientModal
              client={editingClient}
              onSave={(client) => {
                if (editingClient) {
                  updateClient(editingClient.id, client);
                } else {
                  addClient(client);
                }
              }}
              onCancel={() => {
                setShowClientForm(false);
                setEditingClient(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsClientsStep;
