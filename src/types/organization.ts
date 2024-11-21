import { z } from 'zod';

export type OrganizationBoundaryApproach = 'financial_control' | 'operational_control' | 'equity_share';
export type OrganizationType = 'site' | 'subsidiary' | 'supplier';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  boundaryApproach: OrganizationBoundaryApproach;
  ownership?: number;
  parentOrganizationId?: string;
  description?: string;
  address: string;
  country: string;
  industry: string;
  esgContactName: string;
  esgContactPhone: string;
  esgContactEmail: string;
  reportingYear: number;
  verificationStatus: 'unverified' | 'verified' | 'pending';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export const ORGANIZATION_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'site', label: 'Site' },
  { value: 'subsidiary', label: 'Subsidiary' },
  { value: 'supplier', label: 'Supplier' }
];

export const BOUNDARY_APPROACHES: { value: OrganizationBoundaryApproach; label: string; description: string }[] = [
  {
    value: 'financial_control',
    label: 'Financial Control',
    description: 'Organization has ability to direct financial and operating policies'
  },
  {
    value: 'operational_control',
    label: 'Operational Control',
    description: 'Organization has full authority to introduce and implement operating policies'
  },
  {
    value: 'equity_share',
    label: 'Equity Share',
    description: 'Accounts for GHG emissions based on share of equity in the operation'
  }
];