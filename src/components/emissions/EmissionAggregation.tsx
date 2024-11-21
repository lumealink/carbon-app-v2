import React from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { useEmissions } from '../../hooks/useEmissions';
import { useOrganization } from '../../hooks/useOrganization';
import { useAuth } from '../../lib/auth';

const EmissionAggregation: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const { aggregatedEmissions, loading, error } = useEmissions();
  const { user } = useAuth();

  if (!currentOrganization) return null;

  const showAggregatedData = user?.role === 'root' || 
    (user?.role === 'subsidiary' && currentOrganization.boundaryApproach !== 'operational_control');

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {showAggregatedData ? 'Aggregated Emissions' : 'Organization Emissions'}
          </h2>
        </div>
        {showAggregatedData && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Boundary: {currentOrganization.boundaryApproach.replace('_', ' ')}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 1</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {aggregatedEmissions?.scope1Total?.toLocaleString()} tCO₂e
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 2</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {aggregatedEmissions?.scope2Total?.toLocaleString()} tCO₂e
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 3</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {aggregatedEmissions?.scope3Total?.toLocaleString()} tCO₂e
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Emissions</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {aggregatedEmissions?.total?.toLocaleString()} tCO₂e
            </p>
            {showAggregatedData && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Includes data from subsidiaries
              </p>
            )}
          </div>
        </div>
      )}

      {!loading && aggregatedEmissions && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Emissions Breakdown</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              Year to date
            </div>
          </div>
          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                style={{ width: `${(aggregatedEmissions.scope1Total / aggregatedEmissions.total) * 100}%` }}
                className="bg-blue-500"
              />
              <div 
                style={{ width: `${(aggregatedEmissions.scope2Total / aggregatedEmissions.total) * 100}%` }}
                className="bg-green-500"
              />
              <div 
                style={{ width: `${(aggregatedEmissions.scope3Total / aggregatedEmissions.total) * 100}%` }}
                className="bg-purple-500"
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Scope 1: {((aggregatedEmissions.scope1Total / aggregatedEmissions.total) * 100).toFixed(1)}%</span>
            <span>Scope 2: {((aggregatedEmissions.scope2Total / aggregatedEmissions.total) * 100).toFixed(1)}%</span>
            <span>Scope 3: {((aggregatedEmissions.scope3Total / aggregatedEmissions.total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionAggregation;