import { create } from 'zustand';
import { Organization, Facility } from '../types/organization';
import { emissionsApi } from '../lib/api';

interface OrganizationState {
  currentOrganization: Organization | null;
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  setCurrentOrganization: (org: Organization | null) => void;
  fetchOrganization: (id: string) => Promise<void>;
  fetchFacilities: (orgId: string) => Promise<void>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  addFacility: (data: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFacility: (id: string, data: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
}

export const useOrganization = create<OrganizationState>((set, get) => ({
  currentOrganization: null,
  facilities: [],
  loading: false,
  error: null,

  setCurrentOrganization: (org) => set({ currentOrganization: org }),

  fetchOrganization: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.getOrganization(id);
      set({ currentOrganization: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFacilities: async (orgId) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.getFacilities(orgId);
      set({ facilities: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateOrganization: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.updateOrganization(id, data);
      set({ currentOrganization: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addFacility: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.addFacility(data);
      set(state => ({
        facilities: [...state.facilities, response.data],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateFacility: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await emissionsApi.updateFacility(id, data);
      set(state => ({
        facilities: state.facilities.map(f => f.id === id ? response.data : f),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteFacility: async (id) => {
    set({ loading: true, error: null });
    try {
      await emissionsApi.deleteFacility(id);
      set(state => ({
        facilities: state.facilities.filter(f => f.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));