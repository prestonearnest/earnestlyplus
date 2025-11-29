export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: 'single-family' | 'multi-family' | 'condo' | 'townhouse' | 'commercial' | 'land';
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mortgage {
  id: string;
  propertyId: string;
  lender: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  startDate: string;
  propertyTaxMonthly?: number;
  insuranceMonthly?: number;
  hoaMonthly?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RentalIncome {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  tenant?: string;
  type: 'rent' | 'deposit' | 'other';
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  category: 'maintenance' | 'repair' | 'utilities' | 'management' | 'insurance' | 'tax' | 'hoa' | 'other';
  description: string;
  vendor?: string;
  createdAt: string;
}

export interface PropertyValue {
  id: string;
  propertyId: string;
  value: number;
  date: string;
  source: 'manual' | 'zillow' | 'redfin' | 'appraisal';
  notes?: string;
  createdAt: string;
}

export interface PerformanceMetrics {
  propertyId: string;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  roi: number;
  equity: number;
  appreciation: number;
  appreciationPercent: number;
  debtToEquity: number;
  monthlyNetIncome: number;
}

export interface PortfolioSummary {
  totalProperties: number;
  totalValue: number;
  totalEquity: number;
  totalDebt: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  averageROI: number;
  totalAppreciation: number;
  debtToEquityRatio: number;
}
