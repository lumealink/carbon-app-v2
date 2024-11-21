import React, { useState, useEffect } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { Organization } from '../types/organization';
import OrganizationTree from '../components/organizations/OrganizationTree';
import OrganizationForm from '../components/organizations/OrganizationForm';
import { organizationApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, canAccessOrganization } = useAuth();

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await organizationApi.getOrganizations();
      // Filter organizations based on user permissions
      const accessibleOrgs = response.data.filter(org => {
        if (!user) return false;
        
        // Root users can see all organizations
        if (user.role === 'root') return true;

        // Users can see their own organization
        if (org.id === user.organizationId) return true;

        // Subsidiary/supplier users can see their parent organization
        if (org.id === organizations.find(o => o.id === user.organizationId)?.parentOrganizationId) return true;

        // Subsidiary/supplier users can see sibling organizations
        const userOrg = organizations.find(o => o.id === user.organizationId);
        if (userOrg && org.parentOrganizationId === userOrg.parentOrganizationId) return true;

        return false;
      });

      setOrganizations(accessibleOrgs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch organizations');
      setOrganizations([]); // Ensure organizations is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrganization = () => {
    // Only root users can add new organizations
    if (user?.role !== 'root') {
      setError('You do not have permission to add organizations');
      return;
    }
    setSelectedOrg(null);
    setIsModalOpen(true);
  };

  const handleEditOrganization = (org: Organization) => {
    // Users can only edit their own organization or child organizations (for root users)
    if (!canAccessOrganization(org.id)) {
      setError('You do not have permission to edit this organization');
      return;
    }
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const handleDeleteOrganization = async (org: Organization) => {
    // Only root users can delete organizations
    if (user?.role !== 'root') {
      setError('You do not have permission to delete organizations');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this organization?')) return;

    setIsLoading(true);
    try {
      await organizationApi.deleteOrganization(org.id);
      await fetchOrganizations();
    } catch (err: any) {
      setError(err.message || 'Failed to delete organization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Organization> & { email: string; password: string }) => {
    setIsLoading(true);
    try {
      if (selectedOrg) {
        await organizationApi.updateOrganization(selectedOrg.id, data);
      } else {
        await organizationApi.createOrganization(data);
      }
      await fetchOrganizations();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading organizations...</p>
          </div>
        ) : (
          <OrganizationTree
            organizations={organizations}
            onAdd={handleAddOrganization}
            onEdit={handleEditOrganization}
            onDelete={handleDeleteOrganization}
            userRole={user?.role}
            userOrgId={user?.organizationId}
          />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)} />

              <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedOrg ? 'Edit Organization' : 'Add Organization'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <Building2 className="h-6 w-6" />
                  </button>
                </div>

                <OrganizationForm
                  onSubmit={handleSubmit}
                  initialData={selectedOrg || undefined}
                  parentOrganizations={organizations}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;