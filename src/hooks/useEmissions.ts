import { create } from 'zustand';
import { emissionsApi } from '../lib/api';
import { EmissionData } from '../types/emissions';
import { Organization } from '../types/organization';

interface EmissionsState {
  emissions: EmissionData[];
  aggregatedEmissions: {
    scope1Total: number;
    scope2Total: number;
    scope3Total: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
  fetchEmissions: (orgId: string) => Promise<void>;
  fetchAggregatedEmissions: (org: Organization) => Promise<void>;
  addEmission: (orgId: string, data: EmissionData) => Promise<void>;
}

export const useEmissions = create<EmissionsState>((set) => ({
  emissions: [],
  aggregatedEmissions: null,
  loading: false,
  error: null,

  fetchEmissions: async (orgId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.getEmissions(orgId);
      set({ emissions: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAggregatedEmissions: async (org: Organization) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.getAggregatedEmissions(org.id, true);
      set({ aggregatedEmissions: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addEmission: async (orgId: string, data: EmissionData) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.addEmission(orgId, data);
      set(state => ({
        emissions: [...state.emissions, response.data],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));