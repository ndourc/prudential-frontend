import { calculateCAR, calculateConcentration, formatCurrency, generateId } from "@/lib/company";
import { AlertCircle, Calendar, DollarSign, PiggyBank, Plus, TrendingUp } from "lucide-react";
import Input from "../input";
import { CapitalPosition, ClientAsset } from "@/types/company";
import { useState } from "react";
import AssetModal from "./assetModal";

interface ClientAssetsCapitalStepProps {
  data: {
    clientAssets: ClientAsset[];
    capitalPosition: CapitalPosition;
  };
  onChange: (data: any) => void;
  errors: any;
}

const ClientAssetsCapitalStep: React.FC<ClientAssetsCapitalStepProps> = ({ data, onChange, errors }) => {
  const [showAssetForm, setShowAssetForm] = useState(false);

  const totalClientAssets = data.clientAssets.reduce((sum, a) => sum + a.value, 0);

  const addClientAsset = (asset: Omit<ClientAsset, 'id' | 'concentrationPercentage'>) => {
    const concentration = calculateConcentration(asset.value, totalClientAssets + asset.value);
    const newAsset = { ...asset, id: generateId(), concentrationPercentage: concentration };
    
    const updatedAssets = [...data.clientAssets, newAsset].map(a => ({
      ...a,
      concentrationPercentage: calculateConcentration(a.value, totalClientAssets + asset.value)
    }));
    
    onChange({ ...data, clientAssets: updatedAssets });
    setShowAssetForm(false);
  };

  const removeClientAsset = (id: string) => {
    const filtered = data.clientAssets.filter((a) => a.id !== id);
    const newTotal = filtered.reduce((sum, a) => sum + a.value, 0);
    const recalculated = filtered.map(a => ({
      ...a,
      concentrationPercentage: calculateConcentration(a.value, newTotal)
    }));
    onChange({ ...data, clientAssets: recalculated });
  };

  const car = calculateCAR(data.capitalPosition.netCapital, data.capitalPosition.requiredCapital);

  return (
    <div className="space-y-6">
      {/* Client Assets Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <PiggyBank className="w-6 h-6 mr-2 text-green-500" />
              Client Assets Under Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Value: {formatCurrency(totalClientAssets)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAssetForm(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset Type
          </button>
        </div>

        {errors?.clientAssets && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.clientAssets}
          </div>
        )}

        {data.clientAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PiggyBank className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No client assets added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.clientAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{asset.assetType}</h3>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-600">
                      Value: {formatCurrency(asset.value)}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Concentration: {asset.concentrationPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 w-full max-w-xs">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(asset.concentrationPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeClientAsset(asset.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capital Position Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
          Capital Position
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Calculation Date"
            type="date"
            value={data.capitalPosition.calculationDate}
            onChange={(e) =>
              onChange({
                ...data,
                capitalPosition: { ...data.capitalPosition, calculationDate: e.target.value },
              })
            }
            icon={Calendar}
            error={errors?.capitalPosition?.calculationDate}
            required
          />
          <Input
            label="Net Capital (USD)"
            type="number"
            min="0"
            step="0.01"
            value={data.capitalPosition.netCapital}
            onChange={(e) =>
              onChange({
                ...data,
                capitalPosition: { ...data.capitalPosition, netCapital: Number(e.target.value) },
              })
            }
            icon={DollarSign}
            error={errors?.capitalPosition?.netCapital}
            required
          />
          <Input
            label="Required Capital (USD)"
            type="number"
            min="0"
            step="0.01"
            value={data.capitalPosition.requiredCapital}
            onChange={(e) =>
              onChange({
                ...data,
                capitalPosition: { ...data.capitalPosition, requiredCapital: Number(e.target.value) },
              })
            }
            icon={DollarSign}
            error={errors?.capitalPosition?.requiredCapital}
            required
          />
          <Input
            label="Adjusted Liquid Capital (USD)"
            type="number"
            min="0"
            step="0.01"
            value={data.capitalPosition.adjustedLiquidCapital}
            onChange={(e) =>
              onChange({
                ...data,
                capitalPosition: {
                  ...data.capitalPosition,
                  adjustedLiquidCapital: Number(e.target.value),
                },
              })
            }
            icon={DollarSign}
            error={errors?.capitalPosition?.adjustedLiquidCapital}
            required
          />
        </div>

        {/* Capital Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Capital Adequacy Ratio</p>
            <p className="text-3xl font-bold text-blue-600">{car.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {car >= 100 ? 'Compliant' : 'Below Minimum'}
            </p>
          </div>
          <div
            className={`${
              data.capitalPosition.netCapital >= data.capitalPosition.requiredCapital
                ? 'bg-green-50'
                : 'bg-red-50'
            } p-4 rounded-lg`}
          >
            <p className="text-sm text-gray-600">Compliance Status</p>
            <p
              className={`text-2xl font-bold ${
                data.capitalPosition.netCapital >= data.capitalPosition.requiredCapital
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {data.capitalPosition.netCapital >= data.capitalPosition.requiredCapital
                ? 'COMPLIANT'
                : 'NON-COMPLIANT'}
            </p>
            <p className="text-xs text-gray-500 mt-1">As per SEC Directive</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Capital Surplus/Deficit</p>
            <p
              className={`text-2xl font-bold ${
                data.capitalPosition.netCapital - data.capitalPosition.requiredCapital >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(
                data.capitalPosition.netCapital - data.capitalPosition.requiredCapital
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.capitalPosition.netCapital - data.capitalPosition.requiredCapital >= 0
                ? 'Excess Capital'
                : 'Capital Shortfall'}
            </p>
          </div>
        </div>

        {data.capitalPosition.netCapital < data.capitalPosition.requiredCapital && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Capital Deficiency Alert</p>
              <p className="text-sm text-red-700 mt-1">
                The institution&apos;s net capital is below the regulatory minimum. Immediate action is
                required to restore compliance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Client Asset Modal */}
      {showAssetForm && (
        <AssetModal
          onSave={addClientAsset}
          onCancel={() => setShowAssetForm(false)}
        />
      )}
    </div>
  );
};

export default ClientAssetsCapitalStep;