import React, { useState, useEffect } from 'react';
import { Calculator, Factory, Truck, Building, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useOrganization } from '../../hooks/useOrganization';
import { organizationApi } from '../../lib/api';
import { Organization } from '../../types/organization';

// ... (previous imports remain the same)

const EmissionsPage: React.FC = () => {
  const { user, canAccessOrganization } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  
  // ... (other state variables remain the same)

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationApi.getOrganizations();
      // Filter organizations based on user permissions
      const accessibleOrgs = response.data.filter(org => canAccessOrganization(org.id));
      setOrganizations(accessibleOrgs);
      
      // Set first accessible organization as current if none selected
      if (!currentOrganization && accessibleOrgs.length > 0) {
        setCurrentOrganization(accessibleOrgs[0]);
      }
    } catch (err: any) {
      setError('Failed to fetch organizations');
    }
  };

  // ... (rest of the component remains the same)
};