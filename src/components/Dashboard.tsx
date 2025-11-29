import { useState, useMemo } from 'react';
import { Plus, TrendingUp, DollarSign, Home, PieChart, ArrowUpCircle, ArrowDownCircle, Download, Upload } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { AddPropertyForm } from './AddPropertyForm';
import { TransactionForm } from './TransactionForm';
import { PortfolioCharts } from './PortfolioCharts';
import { useProperties, useMortgages, useRentalIncome, useExpenses } from '../hooks/useProperties';
import { calculatePropertyMetrics, calculatePortfolioSummary, formatCurrency } from '../utils/calculations';
import { db } from '../services/database';

export function Dashboard() {
  const { properties, addProperty } = useProperties();
  const { mortgages } = useMortgages();
  const { income, addIncome } = useRentalIncome();
  const { expenses, addExpense } = useExpenses();

  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'properties' | 'analytics'>('overview');

  const allMetrics = useMemo(() => {
    return properties.map(property => {
      const propertyMortgage = mortgages.find(m => m.propertyId === property.id) || null;
      const propertyIncome = income.filter(i => i.propertyId === property.id);
      const propertyExpenses = expenses.filter(e => e.propertyId === property.id);
      return calculatePropertyMetrics(property, propertyMortgage, propertyIncome, propertyExpenses);
    });
  }, [properties, mortgages, income, expenses]);

  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(properties, mortgages, income, expenses);
  }, [properties, mortgages, income, expenses]);

  const handleExport = async () => {
    const data = {
      properties: await db.properties.toArray(),
      mortgages: await db.mortgages.toArray(),
      income: await db.rentalIncome.toArray(),
      expenses: await db.expenses.toArray(),
      propertyValues: await db.propertyValues.toArray(),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `real-estate-portfolio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Import data
        if (data.properties) await db.properties.bulkAdd(data.properties);
        if (data.mortgages) await db.mortgages.bulkAdd(data.mortgages);
        if (data.income) await db.rentalIncome.bulkAdd(data.income);
        if (data.expenses) await db.expenses.bulkAdd(data.expenses);
        if (data.propertyValues) await db.propertyValues.bulkAdd(data.propertyValues);

        window.location.reload();
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real Estate Portfolio</h1>
              <p className="text-gray-500 mt-1">Manage and analyze your real estate investments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <label className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button
                onClick={() => setShowAddProperty(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-4 mt-6 border-b border-gray-200">
            {['overview', 'properties', 'analytics'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as typeof selectedView)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  selectedView === view
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary Cards */}
        {selectedView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{portfolioSummary.totalProperties}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioSummary.totalValue)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Equity</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioSummary.totalEquity)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Net Cash Flow</p>
                    <p className={`text-2xl font-bold ${portfolioSummary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(portfolioSummary.netCashFlow)}
                    </p>
                  </div>
                  <div className={`p-3 ${portfolioSummary.netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                    <DollarSign className={`w-6 h-6 ${portfolioSummary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setShowAddIncome(true)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ArrowUpCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Add Income</h3>
                    <p className="text-sm text-gray-500">Record rental income or deposits</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <ArrowDownCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Add Expense</h3>
                    <p className="text-sm text-gray-500">Track maintenance, repairs, and costs</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {[...income.slice(0, 3), ...expenses.slice(0, 3)]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((transaction) => {
                    const property = properties.find(p => p.id === transaction.propertyId);
                    const isIncome = 'type' in transaction;
                    return (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${isIncome ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                            {isIncome ? (
                              <ArrowUpCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {isIncome ? 'Income' : (transaction as any).description}
                            </p>
                            <p className="text-sm text-gray-500">{property?.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {/* Properties View */}
        {selectedView === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first investment property</p>
                <button
                  onClick={() => setShowAddProperty(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Property</span>
                </button>
              </div>
            ) : (
              properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  metrics={allMetrics[index]}
                  onClick={() => {}}
                />
              ))
            )}
          </div>
        )}

        {/* Analytics View */}
        {selectedView === 'analytics' && (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No data to analyze</h3>
                <p className="text-gray-500">Add properties and track transactions to see analytics</p>
              </div>
            ) : (
              <PortfolioCharts
                properties={properties}
                allMetrics={allMetrics}
                income={income}
                expenses={expenses}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showAddProperty && (
        <AddPropertyForm
          onSubmit={async (property) => {
            await addProperty(property);
            setShowAddProperty(false);
          }}
          onClose={() => setShowAddProperty(false)}
        />
      )}

      {showAddIncome && properties.length > 0 && (
        <TransactionForm
          properties={properties}
          type="income"
          onSubmit={async (data) => {
            await addIncome(data as any);
            setShowAddIncome(false);
          }}
          onClose={() => setShowAddIncome(false)}
        />
      )}

      {showAddExpense && properties.length > 0 && (
        <TransactionForm
          properties={properties}
          type="expense"
          onSubmit={async (data) => {
            await addExpense(data as any);
            setShowAddExpense(false);
          }}
          onClose={() => setShowAddExpense(false)}
        />
      )}
    </div>
  );
}
