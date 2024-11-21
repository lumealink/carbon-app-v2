import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Organization, BOUNDARY_APPROACHES } from '../../types/organization';
import { useOrganization } from '../../hooks/useOrganization';

interface BoundarySettingsProps {
  organization: Organization;
}

const BoundarySettings: React.FC<BoundarySettingsProps> = ({ organization }) => {
  const { updateOrganization, loading, error } = useOrganization();

  const handleBoundaryChange = async (approach: string) => {
    try {
      await updateOrganization(organization.id, {
        boundaryApproach: approach
      });
    } catch (error) {
      console.error('Failed to update boundary approach:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Organizational Boundary Settings
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select the approach used to define your organizational boundaries for GHG emissions accounting.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {BOUNDARY_APPROACHES.map((approach) => (
            <div
              key={approach.value}
              className={`relative rounded-lg border p-4 cursor-pointer hover:border-blue-500 ${
                organization.boundaryApproach === approach.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onClick={() => handleBoundaryChange(approach.value)}
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {approach.label}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {approach.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Important Considerations
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>Changes to boundary approach will affect all emissions calculations</li>
            <li>Historical data may need to be recalculated</li>
            <li>Ensure consistency with financial reporting where applicable</li>
            <li>Document and disclose any significant changes in boundaries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoundarySettings;