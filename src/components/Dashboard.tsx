import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEmissions } from '../hooks/useEmissions';
import { useOrganization } from '../hooks/useOrganization';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { aggregatedEmissions } = useEmissions();
  const { currentOrganization } = useOrganization();

  const pieChartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        data: [
          aggregatedEmissions?.scope1Total || 0,
          aggregatedEmissions?.scope2Total || 0,
          aggregatedEmissions?.scope3Total || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(168, 85, 247, 0.8)'  // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? 'rgb(156, 163, 175)' : 'rgb(55, 65, 81)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value.toLocaleString()} tCO₂e (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Carbon Emissions Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Emissions</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {aggregatedEmissions?.total?.toLocaleString() || 0} tCO₂e
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                        <span className="ml-1">12%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Organizations Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Organizations</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">58</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Verification Status</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {currentOrganization?.verificationStatus || 'N/A'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Emissions Pie Chart */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              GHG Emissions Distribution
            </h2>
            <div className="h-[300px] flex items-center justify-center">
              {aggregatedEmissions && aggregatedEmissions.total > 0 ? (
                <Pie data={pieChartData} options={pieChartOptions} />
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No emissions data available
                </div>
              )}
            </div>
            {aggregatedEmissions && aggregatedEmissions.total > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {((aggregatedEmissions.scope1Total / aggregatedEmissions.total) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Scope 1</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {((aggregatedEmissions.scope2Total / aggregatedEmissions.total) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Scope 2</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {((aggregatedEmissions.scope3Total / aggregatedEmissions.total) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Scope 3</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {[1, 2, 3].map((item, itemIdx) => (
                  <li key={item}>
                    <div className="relative pb-8">
                      {itemIdx !== 2 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <BarChart3 className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              New emission data uploaded <a href="#" className="font-medium text-gray-900 dark:text-white">Organization {item}</a>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {item}h ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;