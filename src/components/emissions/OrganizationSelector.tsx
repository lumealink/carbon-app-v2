import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { Organization } from '../../types/organization';
import { useOrganization } from '../../hooks/useOrganization';
import { useAuth } from '../../lib/auth';

interface OrganizationSelectorProps {
  organizations: Organization[];
  onSelect: (org: Organization) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  organizations,
  onSelect
}) => {
  const { currentOrganization } = useOrganization();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get accessible organizations based on user role and organization structure
  const getAccessibleOrganizations = () => {
    if (!user || !currentOrganization) return [];

    switch (user.role) {
      case 'root':
        // Root users can see all organizations
        return organizations;
      case 'subsidiary':
      case 'supplier':
        // Get the organization family tree (parent and siblings)
        const parentOrg = organizations.find(org => org.id === currentOrganization.parentOrganizationId);
        if (!parentOrg) return [currentOrganization];

        return organizations.filter(org => 
          // Include self
          org.id === currentOrganization.id ||
          // Include parent
          org.id === parentOrg.id ||
          // Include siblings (other orgs with same parent)
          org.parentOrganizationId === parentOrg.id
        );
      default:
        return [currentOrganization];
    }
  };

  const accessibleOrganizations = getAccessibleOrganizations();

  // If user only has access to their own organization, don't show the selector
  if (accessibleOrganizations.length <= 1) {
    return null;
  }

  const handleSelect = (org: Organization) => {
    onSelect(org);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
      >
        <Building2 className="h-5 w-5 mr-2 text-gray-400" />
        {currentOrganization?.name || 'Select Organization'}
        <ChevronDown className={`h-5 w-5 ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700">
          {accessibleOrganizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelect(org)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium">{org.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {org.type} · {org.boundaryApproach.replace('_', ' ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;