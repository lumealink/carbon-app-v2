import React from 'react';
import { useEmissions } from '../../hooks/useEmissions';
import { EmissionData } from '../../types/emissions';

interface EmissionsDisplayProps {
  organizationId: string;
  scope: 'scope1' | 'scope2' | 'scope3';
}

const EmissionsDisplay: React.FC<EmissionsDisplayProps> = ({ organizationId, scope }) => {
  const { emissions } = useEmissions();

  const scopeEmissions = emissions.filter(e => e.scope === scope);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(num);
  };

  const generateUniqueKey = (emission: EmissionData): string => {
    // Create a unique key using multiple properties and a timestamp
    const components = [
      organizationId,
      emission.id,
      emission.scope,
      emission.category,
      emission.source,
      emission.startDate,
      emission.endDate,
      emission.facility,
      emission.location
    ].filter(Boolean); // Remove any undefined/null values

    // Join all components and create a URL-safe string
    return components
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single one
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  return (
    <div className="space-y-4">
      {scopeEmissions.length > 0 ? (
        scopeEmissions.map((emission: EmissionData) => (
          <div 
            key={generateUniqueKey(emission)}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {emission.source}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {emission.activity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(emission.calculatedEmissions || 0)} tCO₂e
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatNumber(emission.quantity)} {emission.unit}
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium">Location:</span> {emission.location}
              </div>
              <div>
                <span className="font-medium">Facility:</span> {emission.facility}
              </div>
              <div>
                <span className="font-medium">Period:</span>{' '}
                {new Date(emission.startDate).toLocaleDateString()} -{' '}
                {new Date(emission.endDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={`capitalize ${
                  emission.verificationStatus === 'verified' 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {emission.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No emissions data available for this scope
        </div>
      )}
    </div>
  );
};

export default EmissionsDisplay;