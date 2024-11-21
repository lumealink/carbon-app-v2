export interface EmissionData {
  id?: string;
  scope: 'scope1' | 'scope2' | 'scope3';
  category: string;
  source: string;
  activity: string;
  fuelType?: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissionFactorUnit: string;
  emissionFactorSource: string;
  startDate: string;
  endDate: string;
  location: string;
  facility: string;
  notes?: string;
  calculatedEmissions?: number;
  verificationStatus: 'unverified' | 'verified' | 'pending';
  verifiedBy?: string;
  verificationDate?: string;
  uncertaintyRange?: number;
}

export interface EmissionCategory {
  id: string;
  scope: string;
  name: string;
  description: string;
}

export const EMISSION_CATEGORIES: EmissionCategory[] = [
  // Scope 1
  { id: 'stationary', scope: 'scope1', name: 'Stationary Combustion', description: 'Emissions from stationary sources like boilers, furnaces, etc.' },
  { id: 'mobile', scope: 'scope1', name: 'Mobile Combustion', description: 'Emissions from vehicles and mobile machinery' },
  { id: 'fugitive', scope: 'scope1', name: 'Fugitive Emissions', description: 'Leaks from refrigeration and AC systems' },
  { id: 'process', scope: 'scope1', name: 'Process Emissions', description: 'Emissions from industrial processes' },

  // Scope 2
  { id: 'electricity', scope: 'scope2', name: 'Purchased Electricity', description: 'Grid electricity consumption' },
  { id: 'steam', scope: 'scope2', name: 'Purchased Steam', description: 'Steam, heating, and cooling' },

  // Scope 3
  { id: 'purchased_goods', scope: 'scope3', name: 'Purchased Goods & Services', description: 'Upstream emissions from purchased goods' },
  { id: 'capital_goods', scope: 'scope3', name: 'Capital Goods', description: 'Production of capital goods' },
  { id: 'fuel_energy', scope: 'scope3', name: 'Fuel & Energy Activities', description: 'Not included in Scope 1 or 2' },
  { id: 'transportation', scope: 'scope3', name: 'Transportation & Distribution', description: 'Upstream and downstream transportation' },
  { id: 'waste', scope: 'scope3', name: 'Waste Generated', description: 'Disposal and treatment of waste' },
  { id: 'business_travel', scope: 'scope3', name: 'Business Travel', description: 'Employee business travel' },
  { id: 'employee_commuting', scope: 'scope3', name: 'Employee Commuting', description: 'Employee commuting to work' },
  { id: 'leased_assets', scope: 'scope3', name: 'Leased Assets', description: 'Operation of leased assets' },
  { id: 'investments', scope: 'scope3', name: 'Investments', description: 'Investment-related emissions' }
];

export const EMISSION_UNITS = [
  // Energy
  { value: 'kWh', label: 'Kilowatt Hours (kWh)' },
  { value: 'MWh', label: 'Megawatt Hours (MWh)' },
  { value: 'GJ', label: 'Gigajoules (GJ)' },
  
  // Volume
  { value: 'L', label: 'Liters (L)' },
  { value: 'm3', label: 'Cubic Meters (m³)' },
  { value: 'gal', label: 'Gallons (gal)' },
  
  // Mass
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 't', label: 'Metric Tonnes (t)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  
  // Distance
  { value: 'km', label: 'Kilometers (km)' },
  { value: 'miles', label: 'Miles' }
];

export const EMISSION_FACTOR_SOURCES = [
  { value: 'GHG_Protocol', label: 'GHG Protocol' },
  { value: 'EPA', label: 'US EPA' },
  { value: 'DEFRA', label: 'UK DEFRA' },
  { value: 'IPCC', label: 'IPCC' },
  { value: 'Custom', label: 'Custom Factor' }
];