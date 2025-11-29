import { Home, TrendingUp, DollarSign, Percent } from 'lucide-react';
import type { Property, PerformanceMetrics } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface PropertyCardProps {
  property: Property;
  metrics: PerformanceMetrics;
  onClick: () => void;
}

export function PropertyCard({ property, metrics, onClick }: PropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Home className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
            <p className="text-sm text-gray-500">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {property.propertyType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Current Value</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(property.currentValue)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Equity</p>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(metrics.equity)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">ROI</p>
            <p className="text-sm font-medium text-gray-900">{formatPercent(metrics.roi)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Cash Flow</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(metrics.netCashFlow)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Percent className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Cap Rate</p>
            <p className="text-sm font-medium text-gray-900">{formatPercent(metrics.capRate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
