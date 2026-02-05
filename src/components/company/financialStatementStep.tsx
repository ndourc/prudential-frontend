import {
  calculateGrossMargin,
  calculateProfitMargin,
  formatCurrency,
  generateId,
} from "@/lib/company";
import { FinancialStatement, IncomeItem } from "@/types/company";
import { Calendar, DollarSign, FileText, Plus } from "lucide-react";
import { useState } from "react";
import IncomeItemModal from "./incomeItemModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FinancialStatementsStepProps {
  data: FinancialStatement;
  onChange: (data: FinancialStatement) => void;
  errors: any;
}

const FinancialStatementsStep: React.FC<FinancialStatementsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);

  const coreIncome = data.incomeItems
    .filter((i) => i.isCore)
    .reduce((sum, i) => sum + i.amount, 0);
  const nonCoreIncome = data.incomeItems
    .filter((i) => !i.isCore)
    .reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = coreIncome + nonCoreIncome;

  const grossMargin = calculateGrossMargin(
    data.totalRevenue,
    data.operatingCosts
  );
  const profitMargin = calculateProfitMargin(
    data.profitBeforeTax,
    data.totalRevenue
  );

  const addIncomeItem = (item: Omit<IncomeItem, "id">) => {
    const newItem = { ...item, id: generateId() };
    onChange({ ...data, incomeItems: [...data.incomeItems, newItem] });
    setShowIncomeForm(false);
  };

  const updateIncomeItem = (id: string, item: Omit<IncomeItem, "id">) => {
    onChange({
      ...data,
      incomeItems: data.incomeItems.map((i) =>
        i.id === id ? { ...item, id } : i
      ),
    });
    setEditingIncome(null);
  };

  const removeIncomeItem = (id: string) => {
    onChange({
      ...data,
      incomeItems: data.incomeItems.filter((i) => i.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Period Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-500" />
            Reporting Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period Start *</Label>
              <Input
                id="periodStart"
                type="date"
                value={data.periodStart}
                onChange={(e) =>
                  onChange({ ...data, periodStart: e.target.value })
                }
                className={errors?.periodStart ? "border-red-500" : ""}
              />
              {errors?.periodStart && (
                <p className="text-sm text-red-600">{errors.periodStart}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period End *</Label>
              <Input
                id="periodEnd"
                type="date"
                value={data.periodEnd}
                onChange={(e) =>
                  onChange({ ...data, periodEnd: e.target.value })
                }
                className={errors?.periodEnd ? "border-red-500" : ""}
              />
              {errors?.periodEnd && (
                <p className="text-sm text-red-600">{errors.periodEnd}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-500" />
            Statement of Comprehensive Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalRevenue">Total Revenue (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="totalRevenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.totalRevenue}
                  onChange={(e) =>
                    onChange({ ...data, totalRevenue: Number(e.target.value) })
                  }
                  className={`pl-9 ${
                    errors?.totalRevenue ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors?.totalRevenue && (
                <p className="text-sm text-red-600">{errors.totalRevenue}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingCosts">Operating Costs (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="operatingCosts"
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.operatingCosts}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      operatingCosts: Number(e.target.value),
                    })
                  }
                  className={`pl-9 ${
                    errors?.operatingCosts ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors?.operatingCosts && (
                <p className="text-sm text-red-600">{errors.operatingCosts}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitBeforeTax">Profit Before Tax (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profitBeforeTax"
                  type="number"
                  step="0.01"
                  value={data.profitBeforeTax}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      profitBeforeTax: Number(e.target.value),
                    })
                  }
                  className={`pl-9 ${
                    errors?.profitBeforeTax ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors?.profitBeforeTax && (
                <p className="text-sm text-red-600">{errors.profitBeforeTax}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gross Margin (%)</Label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className="text-lg font-semibold text-green-600">
                  {grossMargin.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profit Margin (%)</Label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className="text-lg font-semibold text-blue-600">
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Income Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Core Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(coreIncome)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalIncome > 0
                    ? ((coreIncome / totalIncome) * 100).toFixed(1)
                    : 0}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Non-Core Income</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(nonCoreIncome)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalIncome > 0
                    ? ((nonCoreIncome / totalIncome) * 100).toFixed(1)
                    : 0}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.incomeItems.length} items
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Income Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Income Items (Itemised)</CardTitle>
            <Button
              onClick={() => setShowIncomeForm(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Income Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {errors?.incomeItems && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.incomeItems}</AlertDescription>
            </Alert>
          )}

          {data.incomeItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No income items added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.incomeItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.description}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={item.isCore ? "default" : "secondary"}>
                          {item.isCore ? "Core" : "Non-Core"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-gray-800">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIncome(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIncomeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income Item Dialog */}
      <Dialog
        open={showIncomeForm || !!editingIncome}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setShowIncomeForm(false);
            setEditingIncome(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIncome ? "Edit Income Item" : "Add Income Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <IncomeItemModal
              item={editingIncome}
              onSave={(item) => {
                if (editingIncome) {
                  updateIncomeItem(editingIncome.id, item);
                } else {
                  addIncomeItem(item);
                }
              }}
              onCancel={() => {
                setShowIncomeForm(false);
                setEditingIncome(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialStatementsStep;
