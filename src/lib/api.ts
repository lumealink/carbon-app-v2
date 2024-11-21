import axios from 'axios';
import { Organization } from '../types/organization';
import { EmissionData } from '../types/emissions';

// Demo organizations data store
const organizations: Organization[] = [
  {
    id: '1',
    name: 'Global Corp Holdings',
    type: 'site',
    boundaryApproach: 'financial_control',
    address: '123 Main St, New York, NY',
    country: 'US',
    industry: 'Technology',
    esgContactName: 'John Doe',
    esgContactPhone: '+1-555-0123',
    esgContactEmail: 'john@globalcorp.com',
    reportingYear: 2024,
    verificationStatus: 'verified',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    type: 'subsidiary',
    boundaryApproach: 'operational_control',
    parentOrganizationId: '1',
    ownership: 75,
    address: '456 Tech Ave, San Francisco, CA',
    country: 'US',
    industry: 'Software',
    esgContactName: 'Jane Smith',
    esgContactPhone: '+1-555-0124',
    esgContactEmail: 'jane@techsolutions.com',
    reportingYear: 2024,
    verificationStatus: 'verified',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '3',
    name: 'Green Manufacturing Co',
    type: 'supplier',
    boundaryApproach: 'equity_share',
    parentOrganizationId: '1',
    ownership: 0,
    address: '789 Industrial Blvd, Chicago, IL',
    country: 'US',
    industry: 'Manufacturing',
    esgContactName: 'Bob Wilson',
    esgContactPhone: '+1-555-0125',
    esgContactEmail: 'bob@greenmfg.com',
    reportingYear: 2024,
    verificationStatus: 'verified',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

// Demo user accounts
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    organizationId: '1',
    role: 'root'
  },
  {
    id: '2',
    email: 'subsidiary@example.com',
    password: 'password123',
    name: 'Subsidiary User',
    organizationId: '2',
    role: 'subsidiary'
  },
  {
    id: '3',
    email: 'supplier@example.com',
    password: 'password123',
    name: 'Supplier User',
    organizationId: '3',
    role: 'supplier'
  }
];

// Demo emissions data store
const emissionsData: Record<string, EmissionData[]> = {
  // Parent Organization (Global Corp Holdings)
  '1': [
    {
      id: '1-1',
      scope: 'scope1',
      category: 'stationary',
      source: 'Natural Gas Boilers',
      activity: 'Natural Gas Combustion',
      quantity: 50000,
      unit: 'kWh',
      emissionFactor: 0.2,
      emissionFactorUnit: 'kgCO2e/kWh',
      emissionFactorSource: 'GHG_Protocol',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'New York HQ',
      facility: 'Main Building',
      calculatedEmissions: 10000,
      verificationStatus: 'verified'
    },
    {
      id: '1-2',
      scope: 'scope2',
      category: 'electricity',
      source: 'Grid Electricity',
      activity: 'Electricity Consumption',
      quantity: 100000,
      unit: 'kWh',
      emissionFactor: 0.5,
      emissionFactorUnit: 'kgCO2e/kWh',
      emissionFactorSource: 'EPA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'New York HQ',
      facility: 'All Buildings',
      calculatedEmissions: 50000,
      verificationStatus: 'verified'
    },
    {
      id: '1-3',
      scope: 'scope3',
      category: 'business_travel',
      source: 'Air Travel',
      activity: 'Business Flights',
      quantity: 100000,
      unit: 'km',
      emissionFactor: 0.2,
      emissionFactorUnit: 'kgCO2e/km',
      emissionFactorSource: 'DEFRA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'Global',
      facility: 'N/A',
      calculatedEmissions: 20000,
      verificationStatus: 'verified'
    }
  ],
  // Subsidiary (Tech Solutions Inc)
  '2': [
    {
      id: '2-1',
      scope: 'scope1',
      category: 'mobile',
      source: 'Company Vehicles',
      activity: 'Vehicle Fleet Operations',
      quantity: 15000,
      unit: 'L',
      emissionFactor: 2.4,
      emissionFactorUnit: 'kgCO2e/L',
      emissionFactorSource: 'GHG_Protocol',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'San Francisco',
      facility: 'Vehicle Fleet',
      calculatedEmissions: 36000,
      verificationStatus: 'verified'
    },
    {
      id: '2-2',
      scope: 'scope2',
      category: 'electricity',
      source: 'Grid Electricity',
      activity: 'Data Center Operations',
      quantity: 200000,
      unit: 'kWh',
      emissionFactor: 0.4,
      emissionFactorUnit: 'kgCO2e/kWh',
      emissionFactorSource: 'EPA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'San Francisco',
      facility: 'Data Center',
      calculatedEmissions: 80000,
      verificationStatus: 'verified'
    },
    {
      id: '2-3',
      scope: 'scope3',
      category: 'employee_commuting',
      source: 'Employee Transport',
      activity: 'Daily Commute',
      quantity: 50000,
      unit: 'km',
      emissionFactor: 0.1,
      emissionFactorUnit: 'kgCO2e/km',
      emissionFactorSource: 'DEFRA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'San Francisco',
      facility: 'Office Building',
      calculatedEmissions: 5000,
      verificationStatus: 'verified'
    }
  ],
  // Supplier (Green Manufacturing Co)
  '3': [
    {
      id: '3-1',
      scope: 'scope1',
      category: 'process',
      source: 'Manufacturing Process',
      activity: 'Industrial Processing',
      quantity: 300000,
      unit: 'kWh',
      emissionFactor: 0.3,
      emissionFactorUnit: 'kgCO2e/kWh',
      emissionFactorSource: 'GHG_Protocol',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'Chicago',
      facility: 'Manufacturing Plant',
      calculatedEmissions: 90000,
      verificationStatus: 'verified'
    },
    {
      id: '3-2',
      scope: 'scope2',
      category: 'electricity',
      source: 'Grid Electricity',
      activity: 'Factory Operations',
      quantity: 500000,
      unit: 'kWh',
      emissionFactor: 0.6,
      emissionFactorUnit: 'kgCO2e/kWh',
      emissionFactorSource: 'EPA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'Chicago',
      facility: 'Factory Complex',
      calculatedEmissions: 300000,
      verificationStatus: 'verified'
    },
    {
      id: '3-3',
      scope: 'scope3',
      category: 'waste',
      source: 'Industrial Waste',
      activity: 'Waste Processing',
      quantity: 10000,
      unit: 't',
      emissionFactor: 0.5,
      emissionFactorUnit: 'kgCO2e/t',
      emissionFactorSource: 'DEFRA',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'Chicago',
      facility: 'Manufacturing Plant',
      calculatedEmissions: 5000,
      verificationStatus: 'verified'
    },
    {
      id: '3-4',
      scope: 'scope3',
      category: 'transportation',
      source: 'Product Distribution',
      activity: 'Logistics',
      quantity: 200000,
      unit: 'km',
      emissionFactor: 0.1,
      emissionFactorUnit: 'kgCO2e/km',
      emissionFactorSource: 'GHG_Protocol',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      location: 'Chicago',
      facility: 'Distribution Center',
      calculatedEmissions: 20000,
      verificationStatus: 'verified'
    }
  ]
};

const api = axios.create({
  baseURL: '/api'
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    // For demo purposes, check against demo accounts
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return Promise.resolve({
        token: `demo-token-${user.id}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId: user.organizationId,
          role: user.role
        }
      });
    }
    
    return Promise.reject(new Error('Invalid credentials'));
  },

  register: async (data: { name: string; email: string; password: string }) => {
    // For demo purposes, simulate registration
    return Promise.resolve({
      success: true,
      message: 'Registration successful. Please use the demo account to login.'
    });
  },

  logout: async () => {
    return Promise.resolve({ success: true });
  }
};

export const organizationApi = {
  getOrganizations: () => {
    return Promise.resolve({ data: organizations });
  },

  getOrganization: (id: string) => {
    const org = organizations.find(o => o.id === id);
    if (!org) return Promise.reject(new Error('Organization not found'));
    return Promise.resolve({ data: org });
  },

  createOrganization: (data: Partial<Organization>) => {
    const newOrg: Organization = {
      id: String(organizations.length + 1),
      ...data,
      verificationStatus: 'unverified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system'
    } as Organization;
    
    organizations.push(newOrg);
    return Promise.resolve({ data: newOrg });
  },

  updateOrganization: (id: string, data: Partial<Organization>) => {
    const index = organizations.findIndex(o => o.id === id);
    if (index === -1) return Promise.reject(new Error('Organization not found'));
    
    organizations[index] = {
      ...organizations[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    };
    
    return Promise.resolve({ data: organizations[index] });
  },

  deleteOrganization: (id: string) => {
    const index = organizations.findIndex(o => o.id === id);
    if (index === -1) return Promise.reject(new Error('Organization not found'));
    
    organizations.splice(index, 1);
    return Promise.resolve({ success: true });
  }
};

export const emissionsApi = {
  getEmissions: (orgId: string) => {
    return Promise.resolve({ data: emissionsData[orgId] || [] });
  },

  addEmission: (orgId: string, data: EmissionData) => {
    if (!emissionsData[orgId]) {
      emissionsData[orgId] = [];
    }
    
    const newEmission = {
      id: `${orgId}-${emissionsData[orgId].length + 1}`,
      ...data
    };
    
    emissionsData[orgId].push(newEmission);
    return Promise.resolve({ data: newEmission });
  },

  getAggregatedEmissions: (orgId: string, includeSubsidiaries = false) => {
    let totalEmissions = {
      scope1Total: 0,
      scope2Total: 0,
      scope3Total: 0,
      total: 0
    };

    const relevantOrgIds = includeSubsidiaries
      ? [orgId, ...organizations
          .filter(org => {
            if (org.parentOrganizationId === orgId) {
              const parentOrg = organizations.find(o => o.id === orgId);
              if (!parentOrg) return false;

              switch (parentOrg.boundaryApproach) {
                case 'financial_control':
                  return (org.ownership || 0) > 50;
                case 'operational_control':
                  return true;
                case 'equity_share':
                  return true;
                default:
                  return false;
              }
            }
            return false;
          })
          .map(org => org.id)]
      : [orgId];

    relevantOrgIds.forEach(id => {
      const org = organizations.find(o => o.id === id);
      const orgEmissions = emissionsData[id] || [];
      const ownershipPercentage = org?.ownership ? org.ownership / 100 : 1;

      orgEmissions.forEach(emission => {
        const amount = emission.calculatedEmissions || 0;
        const adjustedAmount = org?.parentOrganizationId && 
          organizations.find(o => o.id === orgId)?.boundaryApproach === 'equity_share'
          ? amount * ownershipPercentage
          : amount;

        switch (emission.scope) {
          case 'scope1':
            totalEmissions.scope1Total += adjustedAmount;
            break;
          case 'scope2':
            totalEmissions.scope2Total += adjustedAmount;
            break;
          case 'scope3':
            totalEmissions.scope3Total += adjustedAmount;
            break;
        }
      });
    });

    totalEmissions.total = 
      totalEmissions.scope1Total + 
      totalEmissions.scope2Total + 
      totalEmissions.scope3Total;

    return Promise.resolve({ data: totalEmissions });
  }
};

export default api;