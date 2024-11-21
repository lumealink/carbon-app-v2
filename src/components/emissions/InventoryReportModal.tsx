import React, { useState } from 'react';
import { X, FileText, Download, Calendar, Loader } from 'lucide-react';
import { useEmissions } from '../../hooks/useEmissions';
import { useOrganization } from '../../hooks/useOrganization';
import { generateGHGReport } from '../../utils/reportGenerator';

interface InventoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InventoryReportModal: React.FC<InventoryReportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('detailed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const { emissions, aggregatedEmissions } = useEmissions();
  const { currentOrganization } = useOrganization();

  const generateReport = async () => {
    if (!currentOrganization || !emissions || !aggregatedEmissions) return;
    
    setIsGenerating(true);
    try {
      const reportData = {
        organization: currentOrganization,
        emissions: {
          scope1: emissions.filter(e => e.scope === 'scope1'),
          scope2: emissions.filter(e => e.scope === 'scope2'),
          scope3: emissions.filter(e => e.scope === 'scope3')
        },
        aggregatedEmissions,
        period: { startDate, endDate }
      };

      const fileName = `ghg-inventory-${currentOrganization.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;

      if (format === 'pdf') {
        const pdf = generateGHGReport(reportData, reportType);
        pdf.save(`${fileName}.pdf`);
      } else {
        // Generate CSV format
        const headers = ['Source', 'Scope', 'Category', 'Activity', 'Quantity', 'Unit', 'Emissions (tCO2e)', 'Location', 'Period', 'Verification'];
        const rows = emissions.map(e => [
          e.source,
          e.scope,
          e.category,
          e.activity,
          e.quantity,
          e.unit,
          e.calculatedEmissions,
          e.location,
          `${e.startDate} to ${e.endDate}`,
          e.verificationStatus
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Generate GHG Inventory Report
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="verification">Verification Report</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    format === 'pdf'
                      ? 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900 dark:text-blue-200'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('excel')}
                  className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    format === 'excel'
                      ? 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900 dark:text-blue-200'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Excel
                </button>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Report Contents</h4>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Organization and boundary information</li>
                <li>• Emissions data by scope and category</li>
                <li>• Activity data and calculation methodologies</li>
                <li>• Verification status and uncertainties</li>
                <li>• GHG Protocol compliance statement</li>
              </ul>
            </div>

            <button
              onClick={generateReport}
              disabled={isGenerating || !startDate || !endDate}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportModal;