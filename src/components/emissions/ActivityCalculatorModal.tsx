import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';

interface ActivityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityCalculatorModal: React.FC<ActivityCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [activityType, setActivityType] = useState('electricity');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [result, setResult] = useState<number | null>(null);

  const calculateEmissions = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    let factor = 0;
    switch (activityType) {
      case 'electricity':
        factor = 0.483; // kgCO2e/kWh
        break;
      case 'natural_gas':
        factor = 0.202; // kgCO2e/kWh
        break;
      case 'diesel':
        factor = 2.68; // kgCO2e/L
        break;
      default:
        factor = 0;
    }

    setResult(numValue * factor);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Activity Data Calculator
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Activity Type
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="electricity">Electricity Consumption</option>
                <option value="natural_gas">Natural Gas</option>
                <option value="diesel">Diesel Fuel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Value
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter value"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="kWh">kWh</option>
                  <option value="L">L</option>
                  <option value="m3">m³</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateEmissions}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Emissions
            </button>

            {result !== null && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {result.toFixed(2)} kgCO₂e
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Based on {value} {unit} of {activityType.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalculatorModal;