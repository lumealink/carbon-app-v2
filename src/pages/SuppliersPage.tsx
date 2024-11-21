import React from 'react';
import { Users, Plus, FileText } from 'lucide-react';

const SuppliersPage: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Suppliers</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add Supplier
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3].map((supplier) => (
              <li key={supplier}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-6 w-6 text-gray-400" />
                      <p className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                        Supplier {supplier}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-1" />
                        View Reports
                      </button>
                      <button className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400">
                        Manage
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex space-x-6">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        Category: Raw Materials
                      </p>
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        Risk Level: Medium
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      Last assessment: 3 months ago
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;