// Emission factors database based on GHG Protocol, EPA, and DEFRA standards
export const EMISSION_FACTORS = {
  // Scope 1 - Direct Emissions
  stationary: {
    'Natural Gas': {
      GHG_Protocol: { factor: 0.202, unit: 'kgCO2e/kWh' },
      EPA: { factor: 0.181, unit: 'kgCO2e/kWh' },
      DEFRA: { factor: 0.204, unit: 'kgCO2e/kWh' }
    },
    'Diesel': {
      GHG_Protocol: { factor: 2.68, unit: 'kgCO2e/L' },
      EPA: { factor: 2.69, unit: 'kgCO2e/L' },
      DEFRA: { factor: 2.75, unit: 'kgCO2e/L' }
    }
  },
  mobile: {
    'Gasoline': {
      GHG_Protocol: { factor: 2.31, unit: 'kgCO2e/L' },
      EPA: { factor: 2.33, unit: 'kgCO2e/L' },
      DEFRA: { factor: 2.34, unit: 'kgCO2e/L' }
    },
    'Diesel': {
      GHG_Protocol: { factor: 2.68, unit: 'kgCO2e/L' },
      EPA: { factor: 2.69, unit: 'kgCO2e/L' },
      DEFRA: { factor: 2.75, unit: 'kgCO2e/L' }
    }
  },

  // Scope 2 - Indirect Emissions
  electricity: {
    'Grid Electricity': {
      GHG_Protocol: { factor: 0.483, unit: 'kgCO2e/kWh' },
      EPA: { factor: 0.417, unit: 'kgCO2e/kWh' },
      DEFRA: { factor: 0.233, unit: 'kgCO2e/kWh' }
    }
  },

  // Scope 3 - Value Chain Emissions
  business_travel: {
    'Air Travel - Short Haul': {
      GHG_Protocol: { factor: 0.121, unit: 'kgCO2e/km' },
      EPA: { factor: 0.115, unit: 'kgCO2e/km' },
      DEFRA: { factor: 0.127, unit: 'kgCO2e/km' }
    },
    'Air Travel - Long Haul': {
      GHG_Protocol: { factor: 0.092, unit: 'kgCO2e/km' },
      EPA: { factor: 0.089, unit: 'kgCO2e/km' },
      DEFRA: { factor: 0.095, unit: 'kgCO2e/km' }
    },
    'Rail Travel': {
      GHG_Protocol: { factor: 0.037, unit: 'kgCO2e/km' },
      EPA: { factor: 0.035, unit: 'kgCO2e/km' },
      DEFRA: { factor: 0.036, unit: 'kgCO2e/km' }
    }
  },
  purchased_goods: {
    'Paper': {
      GHG_Protocol: { factor: 0.939, unit: 'kgCO2e/kg' },
      EPA: { factor: 0.915, unit: 'kgCO2e/kg' },
      DEFRA: { factor: 0.956, unit: 'kgCO2e/kg' }
    }
  },
  waste: {
    'Landfill': {
      GHG_Protocol: { factor: 0.586, unit: 'kgCO2e/kg' },
      EPA: { factor: 0.558, unit: 'kgCO2e/kg' },
      DEFRA: { factor: 0.599, unit: 'kgCO2e/kg' }
    },
    'Recycling': {
      GHG_Protocol: { factor: 0.021, unit: 'kgCO2e/kg' },
      EPA: { factor: 0.019, unit: 'kgCO2e/kg' },
      DEFRA: { factor: 0.023, unit: 'kgCO2e/kg' }
    }
  }
};