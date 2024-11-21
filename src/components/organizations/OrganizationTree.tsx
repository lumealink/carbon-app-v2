import React, { useState } from 'react';
import { ChevronRight, Building2, Plus, Trash2, Edit, Factory, Users } from 'lucide-react';
import { Organization } from '../../types/organization';

interface OrganizationTreeProps {
  organizations: Organization[];
  onAdd: () => void;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  userRole?: 'root' | 'subsidiary' | 'supplier';
  userOrgId?: string;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  organizations,
  onAdd,
  onEdit,
  onDelete,
  userRole,
  userOrgId
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Build tree structure
  const buildTree = (orgs: Organization[], parentId: string | undefined = undefined): Organization[] => {
    return orgs
      .filter(org => org.parentOrganizationId === parentId)
      .map(org => ({
        ...org,
        children: buildTree(orgs, org.id)
      }));
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (expandedIds.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const canEditOrganization = (org: Organization) => {
    if (!userRole || !userOrgId) return false;
    if (userRole === 'root') return true;
    return org.id === userOrgId;
  };

  const canDeleteOrganization = (org: Organization) => {
    return userRole === 'root';
  };

  const tree = buildTree(organizations);

  const getIcon = (type: string) => {
    switch (type) {
      case 'site':
        return Factory;
      case 'supplier':
        return Users;
      default:
        return Building2;
    }
  };

  const renderOrganization = (org: Organization & { children?: Organization[] }, level = 0) => {
    const Icon = getIcon(org.type);
    const hasChildren = org.children && org.children.length > 0;
    const isExpanded = expandedIds.has(org.id);
    
    return (
      <div key={org.id} className="mb-2">
        <div 
          className={`flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
            level > 0 ? 'ml-6' : ''
          }`}
          onClick={() => hasChildren && toggleExpand(org.id)}
        >
          <ChevronRight 
            className={`h-4 w-4 mr-2 transition-transform ${
              hasChildren ? 'cursor-pointer' : 'invisible'
            } ${isExpanded ? 'transform rotate-90' : ''}`}
          />
          <Icon className="h-5 w-5 mr-2 text-gray-400" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {org.type} · {org.boundaryApproach}
              {org.ownership && ` · ${org.ownership}% ownership`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {canEditOrganization(org) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(org);
                }}
                className="p-1 text-gray-400 hover:text-gray-500"
                title="Edit organization"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {canDeleteOrganization(org) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(org);
                }}
                className="p-1 text-gray-400 hover:text-gray-500"
                title="Delete organization"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {isExpanded && org.children?.map(child => renderOrganization(child, level + 1))}
      </div>
    );
  };

  if (organizations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Organization Structure</h2>
          {userRole === 'root' && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Organization
            </button>
          )}
        </div>
        
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Organizations</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {userRole === 'root' ? 'Get started by creating your first organization' : 'No organizations available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Organization Structure</h2>
        {userRole === 'root' && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Organization
          </button>
        )}
      </div>

      <div className="space-y-2">
        {tree.map(org => renderOrganization(org))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Organization Structure Guide
        </h3>
        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <li>• Sites: Operational facilities or locations</li>
          <li>• Subsidiaries: Organizations under financial/operational control</li>
          <li>• Suppliers: External organizations in value chain</li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationTree;