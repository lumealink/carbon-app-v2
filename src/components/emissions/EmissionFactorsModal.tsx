import React, { useState } from 'react';
import { X, Search, Download } from 'lucide-react';

const EMISSION_FACTORS_DATA = [
  { id: 1, category: 'Electricity', region: 'Global', value: 0.483, unit: 'kgCO2e/kWh', source: 'IEA 2023', year: 2023 },
  { id: 2, category: 'Natural Gas', region: 'Global', value: 0.202, unit: 'kgCO2e/kWh', source: 'GHG Protocol', year: 2023 },
  { id: 3, category: 'Diesel', region: 'Global', value: 2.68, unit: 'kgCO2e/L', source: 'DEFRA', year: 2023 },
  { id: 4, category: 'Air Travel', region: 'Global', value: 0.121, unit: 'kgCO2e/km', source: 'EPA', year: 2023 },
  { id: 5, category: 'Rail Travel', region: 'Global', value: 0.037, unit: 'kgCO2e/km', source: 'DEFRA', year: 2023 }
];

interface EmissionFactorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmissionFactorsModal: React.FC<EmissionFactorsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');

  const filteredFactors = EMISSION_FACTORS_DATA.filter(factor => {
    const matchesSearch = factor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factor.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || factor.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const sources = [...new Set(EMISSION_FACTORS_DATA.map(factor => factor.source))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Emission Factors Database
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search emission factors..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFactors.map((factor) => (
                  <tr key={factor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {factor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {factor.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {factor.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {factor.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {factor.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionFactorsModal;