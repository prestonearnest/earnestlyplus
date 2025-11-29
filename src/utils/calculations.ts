import type { Property, Mortgage, RentalIncome, Expense, PerformanceMetrics, PortfolioSummary } from '../types';
import { differenceInMonths } from 'date-fns';

export function calculatePropertyMetrics(
  property: Property,
  mortgage: Mortgage | null,
  income: RentalIncome[],
  expenses: Expense[]
): PerformanceMetrics {
  // Calculate total income and expenses
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  // Calculate appreciation
  const appreciation = property.currentValue - property.purchasePrice;
  const appreciationPercent = (appreciation / property.purchasePrice) * 100;

  // Calculate equity
  const debt = mortgage?.currentBalance || 0;
  const equity = property.currentValue - debt;

  // Calculate debt-to-equity ratio
  const debtToEquity = equity > 0 ? debt / equity : 0;

  // Calculate cash invested (down payment + closing costs estimate)
  const downPayment = property.purchasePrice - (mortgage?.originalAmount || 0);
  const closingCosts = property.purchasePrice * 0.03; // Estimate 3%
  const cashInvested = downPayment + closingCosts;

  // Calculate Cash-on-Cash Return (annual net cash flow / cash invested)
  const monthsSincePurchase = differenceInMonths(new Date(), new Date(property.purchaseDate)) || 1;
  const yearsSincePurchase = monthsSincePurchase / 12;
  const annualNetCashFlow = yearsSincePurchase > 0 ? (netCashFlow / yearsSincePurchase) : 0;
  const cashOnCashReturn = cashInvested > 0 ? (annualNetCashFlow / cashInvested) * 100 : 0;

  // Calculate Cap Rate (annual net operating income / current value)
  const annualExpenses = yearsSincePurchase > 0 ? (totalExpenses / yearsSincePurchase) : 0;
  const annualIncome = yearsSincePurchase > 0 ? (totalIncome / yearsSincePurchase) : 0;
  const noi = annualIncome - annualExpenses;
  const capRate = property.currentValue > 0 ? (noi / property.currentValue) * 100 : 0;

  // Calculate ROI ((total gain - total cost) / total cost)
  const totalGain = appreciation + netCashFlow;
  const roi = cashInvested > 0 ? (totalGain / cashInvested) * 100 : 0;

  // Calculate monthly net income
  const monthlyNetIncome = monthsSincePurchase > 0 ? netCashFlow / monthsSincePurchase : 0;

  return {
    propertyId: property.id,
    totalIncome,
    totalExpenses,
    netCashFlow,
    cashOnCashReturn,
    capRate,
    roi,
    equity,
    appreciation,
    appreciationPercent,
    debtToEquity,
    monthlyNetIncome,
  };
}

export function calculatePortfolioSummary(
  properties: Property[],
  mortgages: Mortgage[],
  allIncome: RentalIncome[],
  allExpenses: Expense[]
): PortfolioSummary {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalDebt = mortgages.reduce((sum, m) => sum + m.currentBalance, 0);
  const totalEquity = totalValue - totalDebt;
  const totalIncome = allIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const totalAppreciation = properties.reduce((sum, p) => sum + (p.currentValue - p.purchasePrice), 0);
  const debtToEquityRatio = totalEquity > 0 ? totalDebt / totalEquity : 0;

  // Calculate average ROI across all properties
  const propertyMetrics = properties.map(property => {
    const propertyMortgage = mortgages.find(m => m.propertyId === property.id) || null;
    const propertyIncome = allIncome.filter(i => i.propertyId === property.id);
    const propertyExpenses = allExpenses.filter(e => e.propertyId === property.id);
    return calculatePropertyMetrics(property, propertyMortgage, propertyIncome, propertyExpenses);
  });

  const averageROI = propertyMetrics.length > 0
    ? propertyMetrics.reduce((sum, m) => sum + m.roi, 0) / propertyMetrics.length
    : 0;

  return {
    totalProperties,
    totalValue,
    totalEquity,
    totalDebt,
    totalIncome,
    totalExpenses,
    netCashFlow,
    averageROI,
    totalAppreciation,
    debtToEquityRatio,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
