import { create } from 'zustand';
import { authApi } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: 'root' | 'subsidiary' | 'supplier';
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  clearError: () => void;
  canAccessOrganization: (orgId: string) => boolean;
  canAccessEmissions: (orgId: string) => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, error: null });
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      const { token, user } = response;
      localStorage.setItem('token', token);
      set({ token, user, loading: false, error: null });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Invalid credentials'
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await authApi.register(data);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false,
        error: error.message || 'Registration failed. Please try again.'
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      set({ token: null, user: null, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: 'Logout failed' });
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!get().token;
  },

  clearError: () => set({ error: null }),

  canAccessOrganization: (orgId: string) => {
    const { user } = get();
    if (!user) return false;

    // Root users can access all organizations
    if (user.role === 'root') return true;

    // Users can only access their own organization
    return user.organizationId === orgId;
  },

  canAccessEmissions: (orgId: string) => {
    const { user } = get();
    if (!user) return false;

    // Root users can access all emissions
    if (user.role === 'root') return true;

    // Users can only access emissions from their own organization
    // and their parent/sibling organizations if they're a subsidiary/supplier
    return user.organizationId === orgId;
  }
}));