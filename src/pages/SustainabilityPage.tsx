import React, { useState, useEffect } from 'react';
import { Leaf, Target, TrendingUp, Award, AlertCircle, Download } from 'lucide-react';
import { useEmissions } from '../hooks/useEmissions';
import { useOrganization } from '../hooks/useOrganization';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScienceTarget {
  year: number;
  targetReduction: number;
  baselineEmissions: number;
  status: 'on_track' | 'at_risk' | 'off_track';
}

interface Initiative {
  id: string;
  name: string;
  description: string;
  status: 'in_progress' | 'completed' | 'planned';
  impact: number;
  startDate: string;
  endDate: string;
  category: 'energy' | 'waste' | 'supply_chain' | 'transportation' | 'buildings';
}

const SustainabilityPage: React.FC = () => {
  const { aggregatedEmissions, emissions } = useEmissions();
  const { currentOrganization } = useOrganization();
  const [error, setError] = useState<string | null>(null);

  // Science-based targets data
  const [targets] = useState<ScienceTarget[]>([
    {
      year: 2025,
      targetReduction: 25,
      baselineEmissions: 1000000,
      status: 'on_track'
    },
    {
      year: 2030,
      targetReduction: 50,
      baselineEmissions: 1000000,
      status: 'at_risk'
    },
    {
      year: 2050,
      targetReduction: 90,
      baselineEmissions: 1000000,
      status: 'off_track'
    }
  ]);

  // Sustainability initiatives
  const [initiatives] = useState<Initiative[]>([
    {
      id: '1',
      name: 'Renewable Energy Transition',
      description: 'Implementation of solar panels and wind power',
      status: 'in_progress',
      impact: 250000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: 'energy'
    },
    {
      id: '2',
      name: 'Supply Chain Optimization',
      description: 'Reducing scope 3 emissions through supplier engagement',
      status: 'planned',
      impact: 150000,
      startDate: '2024-06-01',
      endDate: '2025-06-01',
      category: 'supply_chain'
    }
  ]);

  // Chart data for emissions trend
  const chartData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Actual Emissions',
        data: [1000000, 950000, 900000, 820000, aggregatedEmissions?.total || 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Target Path',
        data: [1000000, 900000, 800000, 700000, 600000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderDash: [5, 5],
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emissions Reduction Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂e'
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'off_track':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const downloadReport = () => {
    // Implementation for downloading sustainability report
    console.log('Downloading sustainability report...');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Sustainability Goals</h1>
          <button
            onClick={downloadReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Science-Based Targets */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Science-Based Targets</h2>
            </div>
            <div className="space-y-4">
              {targets.map((target) => (
                <div key={target.year} className="border-t border-gray-200 dark:border-gray-700 pt-4 first:border-0 first:pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{target.year} Target</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {target.targetReduction}% reduction from baseline
                      </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(target.status)}`}>
                      {target.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{ width: `${target.targetReduction}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emissions Trend */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Emissions Trend</h2>
            </div>
            <div className="h-64">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>

          {/* Initiatives */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Leaf className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Sustainability Initiatives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initiatives.map((initiative) => (
                <div key={initiative.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{initiative.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{initiative.description}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      initiative.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : initiative.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {initiative.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Impact:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{initiative.impact.toLocaleString()} tCO₂e</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Timeline:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Certifications & Standards</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'GHG Protocol Aligned', description: 'Scope 1, 2, & 3 emissions reporting' },
                { name: 'Science Based Targets', description: 'Validated emission reduction targets' },
                { name: 'CDP Leadership', description: 'Climate change disclosure leadership' },
                { name: 'ISO 14064-1:2018', description: 'GHG quantification and reporting' },
                { name: 'RE100 Member', description: '100% renewable energy commitment' },
                { name: 'Net-Zero Commitment', description: 'Science-based net-zero target' }
              ].map((cert) => (
                <div key={cert.name} className="flex items-start space-x-3 p-4 border rounded-lg dark:border-gray-700">
                  <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{cert.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;