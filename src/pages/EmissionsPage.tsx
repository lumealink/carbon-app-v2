import React, { useState, useEffect } from 'react';
import { Calculator, Factory, Truck, Building, Plus, AlertCircle } from 'lucide-react';
import AddEmissionModal from '../components/emissions/AddEmissionModal';
import EmissionFactorsModal from '../components/emissions/EmissionFactorsModal';
import ActivityCalculatorModal from '../components/emissions/ActivityCalculatorModal';
import InventoryReportModal from '../components/emissions/InventoryReportModal';
import OrganizationSelector from '../components/emissions/OrganizationSelector';
import EmissionAggregation from '../components/emissions/EmissionAggregation';
import EmissionsDisplay from '../components/emissions/EmissionsDisplay';
import { EmissionData } from '../types/emissions';
import { organizationApi } from '../lib/api';
import { Organization } from '../types/organization';
import { useOrganization } from '../hooks/useOrganization';
import { useEmissions } from '../hooks/useEmissions';

const EmissionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFactorsModalOpen, setIsFactorsModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const { loading, fetchEmissions, fetchAggregatedEmissions, addEmission } = useEmissions();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (currentOrganization) {
      fetchEmissions(currentOrganization.id);
      fetchAggregatedEmissions(currentOrganization);
    }
  }, [currentOrganization]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationApi.getOrganizations();
      setOrganizations(response.data);
      if (!currentOrganization && response.data.length > 0) {
        setCurrentOrganization(response.data[0]);
      }
    } catch (err: any) {
      setError('Failed to fetch organizations');
    }
  };

  const handleOrganizationSelect = (org: Organization) => {
    setCurrentOrganization(org);
  };

  const handleAddEmission = async (data: EmissionData) => {
    if (!currentOrganization) {
      setError('Please select an organization first');
      return;
    }

    try {
      await addEmission(currentOrganization.id, data);
      setIsModalOpen(false);
      // Refresh data
      await fetchEmissions(currentOrganization.id);
      await fetchAggregatedEmissions(currentOrganization);
    } catch (err: any) {
      setError('Failed to save emission data');
    }
  };

  if (!currentOrganization) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              No Organizations Available
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please create an organization first in the Organizations section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">GHG Emissions</h1>
            <OrganizationSelector
              organizations={organizations}
              onSelect={handleOrganizationSelect}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Emission Data
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <EmissionAggregation />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          {/* Scope 1 Emissions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Factory className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Scope 1 (Direct Emissions)</h2>
            </div>
            <EmissionsDisplay organizationId={currentOrganization.id} scope="scope1" />
          </div>

          {/* Scope 2 Emissions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Scope 2 (Indirect Emissions)</h2>
            </div>
            <EmissionsDisplay organizationId={currentOrganization.id} scope="scope2" />
          </div>

          {/* Scope 3 Emissions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Scope 3 (Value Chain Emissions)</h2>
            </div>
            <EmissionsDisplay organizationId={currentOrganization.id} scope="scope3" />
          </div>

          {/* Calculation Tools */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Calculator className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">GHG Calculation Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setIsFactorsModalOpen(true)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Emission Factors Database
              </button>
              <button
                onClick={() => setIsCalculatorModalOpen(true)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Activity Data Calculator
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                GHG Inventory Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddEmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmission}
        isLoading={loading}
      />

      <EmissionFactorsModal
        isOpen={isFactorsModalOpen}
        onClose={() => setIsFactorsModalOpen(false)}
      />

      <ActivityCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />

      <InventoryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default EmissionsPage;