import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Property, RentalIncome, Expense, PerformanceMetrics } from '../types';
import { formatCurrency } from '../utils/calculations';

interface PortfolioChartsProps {
  properties: Property[];
  allMetrics: PerformanceMetrics[];
  income: RentalIncome[];
  expenses: Expense[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function PortfolioCharts({ properties, allMetrics, income, expenses }: PortfolioChartsProps) {
  // Property value distribution
  const valueDistribution = properties.map((property, index) => ({
    name: property.address.split(',')[0],
    value: property.currentValue,
    color: COLORS[index % COLORS.length],
  }));

  // Property type distribution
  const typeDistribution = properties.reduce((acc, property) => {
    const existing = acc.find(item => item.name === property.propertyType);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: property.propertyType, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // ROI comparison
  const roiData = allMetrics.map((metrics) => {
    const property = properties.find(p => p.id === metrics.propertyId);
    return {
      name: property?.address.split(',')[0] || 'Unknown',
      roi: Number(metrics.roi.toFixed(2)),
      capRate: Number(metrics.capRate.toFixed(2)),
      cashOnCashReturn: Number(metrics.cashOnCashReturn.toFixed(2)),
    };
  });

  // Income vs Expenses over time
  const monthlyData = (() => {
    const data: { [key: string]: { month: string; income: number; expenses: number } } = {};

    [...income, ...expenses].forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!data[monthKey]) {
        data[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }

      if ('type' in item) {
        data[monthKey].income += item.amount;
      } else {
        data[monthKey].expenses += item.amount;
      }
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  })();

  // Expense categories
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Property Value Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Value Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={valueDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {valueDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Property Type Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {typeDistribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ROI Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Metrics by Property</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="roi" fill="#3B82F6" name="ROI %" />
            <Bar dataKey="capRate" fill="#10B981" name="Cap Rate %" />
            <Bar dataKey="cashOnCashReturn" fill="#F59E0B" name="Cash-on-Cash %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expenses */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Categories */}
      {expensesByCategory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#EF4444" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
