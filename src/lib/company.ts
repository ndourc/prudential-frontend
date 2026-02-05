export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateConcentration = (
  value: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(2));
};

export const calculateGrossMargin = (
  revenue: number,
  operatingCosts: number
): number => {
  if (revenue === 0) return 0;
  return Number((((revenue - operatingCosts) / revenue) * 100).toFixed(2));
};

export const calculateProfitMargin = (
  profitBeforeTax: number,
  revenue: number
): number => {
  if (revenue === 0) return 0;
  return Number(((profitBeforeTax / revenue) * 100).toFixed(2));
};

export const calculateWorkingCapital = (
  currentAssets: number,
  currentLiabilities: number
): number => {
  return currentAssets - currentLiabilities;
};

export const calculateCAR = (
  netCapital: number,
  requiredCapital: number
): number => {
  if (requiredCapital === 0) return 0;
  return Number(((netCapital / requiredCapital) * 100).toFixed(2));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

