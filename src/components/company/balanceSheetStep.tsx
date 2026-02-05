import { calculateWorkingCapital, formatCurrency, formatDate, generateId } from "@/lib/company";
import { Asset, BalanceSheet, Creditor, Debtor, Liability, RelatedParty } from "@/types/company";
import { Calendar, DollarSign, FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";
import Input from "./input";
import AssetModal from "./modals/assetModal";
import { LiabilityModal } from "./modals/liabilityModal";
import RelatedPartyModal from "./modals/relatedPartyModal";
import { DebtorModal } from "./modals/debtorModal";
import { CreditorModal } from "./modals/creditorModal";

interface BalanceSheetStepProps {
  data: BalanceSheet;
  onChange: (data: BalanceSheet) => void;
  errors: any;
}

const BalanceSheetStep: React.FC<BalanceSheetStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [activeTab, setActiveTab] = useState<
    "assets" | "liabilities" | "debtors" | "creditors"
  >("assets");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [showDebtorForm, setShowDebtorForm] = useState(false);
  const [showCreditorForm, setShowCreditorForm] = useState(false);
  const [showRelatedPartyForm, setShowRelatedPartyForm] = useState(false);

  const workingCapital = calculateWorkingCapital(
    data.currentAssets,
    data.currentLiabilities
  );

  const addAsset = (asset: Omit<Asset, "id">) => {
    const newAsset = { ...asset, id: generateId() };
    onChange({ ...data, assets: [...data.assets, newAsset] });
    setShowAssetForm(false);
  };

  const removeAsset = (id: string) => {
    onChange({ ...data, assets: data.assets.filter((a) => a.id !== id) });
  };

  const addLiability = (liability: Omit<Liability, "id">) => {
    const newLiability = { ...liability, id: generateId() };
    onChange({ ...data, liabilities: [...data.liabilities, newLiability] });
    setShowLiabilityForm(false);
  };

  const removeLiability = (id: string) => {
    onChange({
      ...data,
      liabilities: data.liabilities.filter((l) => l.id !== id),
    });
  };

  const addDebtor = (debtor: Omit<Debtor, "id">) => {
    const newDebtor = { ...debtor, id: generateId() };
    onChange({ ...data, debtors: [...data.debtors, newDebtor] });
    setShowDebtorForm(false);
  };

  const removeDebtor = (id: string) => {
    onChange({ ...data, debtors: data.debtors.filter((d) => d.id !== id) });
  };

  const addCreditor = (creditor: Omit<Creditor, "id">) => {
    const newCreditor = { ...creditor, id: generateId() };
    onChange({ ...data, creditors: [...data.creditors, newCreditor] });
    setShowCreditorForm(false);
  };

  const removeCreditor = (id: string) => {
    onChange({ ...data, creditors: data.creditors.filter((c) => c.id !== id) });
  };

  const addRelatedParty = (party: Omit<RelatedParty, "id">) => {
    const newParty = { ...party, id: generateId() };
    onChange({ ...data, relatedParties: [...data.relatedParties, newParty] });
    setShowRelatedPartyForm(false);
  };

  const removeRelatedParty = (id: string) => {
    onChange({
      ...data,
      relatedParties: data.relatedParties.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Balance Sheet Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <FileSpreadsheet className="w-6 h-6 mr-2 text-purple-500" />
          Statement of Financial Position
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Period End"
            type="date"
            value={data.periodEnd}
            onChange={(e) => onChange({ ...data, periodEnd: e.target.value })}
            icon={Calendar}
            error={errors?.periodEnd}
            required
          />
          <Input
            label="Shareholders' Funds (USD)"
            type="number"
            min="0"
            step="0.01"
            value={data.shareholdersFunds}
            onChange={(e) =>
              onChange({ ...data, shareholdersFunds: Number(e.target.value) })
            }
            icon={DollarSign}
            error={errors?.shareholdersFunds}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Assets</p>
            <Input
              label=""
              type="number"
              min="0"
              step="0.01"
              value={data.totalAssets}
              onChange={(e) =>
                onChange({ ...data, totalAssets: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Liabilities</p>
            <Input
              label=""
              type="number"
              min="0"
              step="0.01"
              value={data.totalLiabilities}
              onChange={(e) =>
                onChange({ ...data, totalLiabilities: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Current Assets</p>
            <Input
              label=""
              type="number"
              min="0"
              step="0.01"
              value={data.currentAssets}
              onChange={(e) =>
                onChange({ ...data, currentAssets: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Current Liabilities</p>
            <Input
              label=""
              type="number"
              min="0"
              step="0.01"
              value={data.currentLiabilities}
              onChange={(e) =>
                onChange({
                  ...data,
                  currentLiabilities: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Working Capital
            </label>
            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <span
                className={`text-lg font-semibold ${
                  workingCapital >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(workingCapital)}
              </span>
            </div>
          </div>
          <Input
            label="Cash Cover (USD)"
            type="number"
            min="0"
            step="0.01"
            value={data.cashCover}
            onChange={(e) =>
              onChange({ ...data, cashCover: Number(e.target.value) })
            }
            icon={DollarSign}
            error={errors?.cashCover}
            required
          />
        </div>
      </div>

      {/* Tabs for Assets, Liabilities, Debtors, Creditors */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "assets", label: "Assets", count: data.assets.length },
              {
                id: "liabilities",
                label: "Liabilities",
                count: data.liabilities.length,
              },
              { id: "debtors", label: "Debtors", count: data.debtors.length },
              {
                id: "creditors",
                label: "Creditors",
                count: data.creditors.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "assets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Assets Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAssetForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </button>
              </div>
              {data.assets.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No assets added
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm">Type</th>
                        <th className="text-left py-2 px-3 text-sm">
                          Category
                        </th>
                        <th className="text-center py-2 px-3 text-sm">
                          Current
                        </th>
                        <th className="text-right py-2 px-3 text-sm">Value</th>
                        <th className="text-right py-2 px-3 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.assets.map((asset) => (
                        <tr
                          key={asset.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-2 px-3 text-sm">
                            {asset.assetType}
                          </td>
                          <td className="py-2 px-3 text-sm">
                            {asset.category}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                asset.isCurrent
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {asset.isCurrent ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-sm font-medium">
                            {formatCurrency(asset.value)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeAsset(asset.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "liabilities" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Liabilities Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLiabilityForm(true)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liability
                </button>
              </div>
              {data.liabilities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No liabilities added
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm">Type</th>
                        <th className="text-left py-2 px-3 text-sm">
                          Category
                        </th>
                        <th className="text-center py-2 px-3 text-sm">
                          Current
                        </th>
                        <th className="text-right py-2 px-3 text-sm">Value</th>
                        <th className="text-right py-2 px-3 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.liabilities.map((liability) => (
                        <tr
                          key={liability.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-2 px-3 text-sm">
                            {liability.liabilityType}
                          </td>
                          <td className="py-2 px-3 text-sm">
                            {liability.category}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                liability.isCurrent
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {liability.isCurrent ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-sm font-medium">
                            {formatCurrency(liability.value)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeLiability(liability.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "debtors" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Debtors Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDebtorForm(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Debtor
                </button>
              </div>
              {data.debtors.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No debtors added
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm">Name</th>
                        <th className="text-right py-2 px-3 text-sm">Amount</th>
                        <th className="text-right py-2 px-3 text-sm">
                          Age (Days)
                        </th>
                        <th className="text-right py-2 px-3 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.debtors.map((debtor) => (
                        <tr
                          key={debtor.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-2 px-3 text-sm">{debtor.name}</td>
                          <td className="py-2 px-3 text-right text-sm font-medium">
                            {formatCurrency(debtor.amount)}
                          </td>
                          <td className="py-2 px-3 text-right text-sm">
                            <span
                              className={`px-2 py-1 rounded ${
                                debtor.ageDays > 90
                                  ? "bg-red-100 text-red-800"
                                  : debtor.ageDays > 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {debtor.ageDays}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeDebtor(debtor.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "creditors" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Creditors Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreditorForm(true)}
                  className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Creditor
                </button>
              </div>
              {data.creditors.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No creditors added
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm">Name</th>
                        <th className="text-right py-2 px-3 text-sm">Amount</th>
                        <th className="text-right py-2 px-3 text-sm">
                          Due Date
                        </th>
                        <th className="text-right py-2 px-3 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.creditors.map((creditor) => (
                        <tr
                          key={creditor.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-2 px-3 text-sm">{creditor.name}</td>
                          <td className="py-2 px-3 text-right text-sm font-medium">
                            {formatCurrency(creditor.amount)}
                          </td>
                          <td className="py-2 px-3 text-right text-sm">
                            {formatDate(creditor.dueDate)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeCreditor(creditor.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Parties Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Related Party Balances
          </h3>
          <button
            type="button"
            onClick={() => setShowRelatedPartyForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Related Party
          </button>
        </div>
        {data.relatedParties.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No related parties added
          </p>
        ) : (
          <div className="space-y-3">
            {data.relatedParties.map((party) => (
              <div
                key={party.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{party.name}</h4>
                  <p className="text-sm text-gray-600">{party.relationship}</p>
                  <p className="text-sm font-medium mt-1">
                    {formatCurrency(party.balance)} -{" "}
                    <span
                      className={
                        party.type === "receivable"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {party.type === "receivable" ? "Receivable" : "Payable"}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeRelatedParty(party.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAssetForm && (
        <AssetModal
          onSave={addAsset}
          onCancel={() => setShowAssetForm(false)}
        />
      )}
      {showLiabilityForm && (
        <LiabilityModal
          onSave={addLiability}
          onCancel={() => setShowLiabilityForm(false)}
        />
      )}
      {showDebtorForm && (
        <DebtorModal
          onSave={addDebtor}
          onCancel={() => setShowDebtorForm(false)}
        />
      )}
      {showCreditorForm && (
        <CreditorModal
          onSave={addCreditor}
          onCancel={() => setShowCreditorForm(false)}
        />
      )}
      {showRelatedPartyForm && (
        <RelatedPartyModal
          onSave={addRelatedParty}
          onCancel={() => setShowRelatedPartyForm(false)}
        />
      )}
    </div>
  );
};
export default BalanceSheetStep;