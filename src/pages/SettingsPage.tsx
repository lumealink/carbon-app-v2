import React, { useState } from 'react';
import { Settings, Bell, Shield, Users, Globe, Menu } from 'lucide-react';
import SecuritySettings from '../components/settings/SecuritySettings';
import TeamManagement from '../components/settings/TeamManagement';
import NotificationSettings from '../components/settings/NotificationSettings';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'team', name: 'Team', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return <SecuritySettings />;
      case 'team':
        return <TeamManagement />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                {/* General Settings */}
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    General Settings
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reporting Period
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Set your default reporting period</p>
                      </div>
                      <select className="mt-1 sm:mt-0 block w-full sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Calendar Year</option>
                        <option>Fiscal Year</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Standards */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    GHG Protocol Standards
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Emission Factors Source
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred emission factors database</p>
                      </div>
                      <select className="mt-1 sm:mt-0 block w-full sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>GHG Protocol</option>
                        <option>EPA</option>
                        <option>DEFRA</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <button
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {/* Mobile Navigation */}
          <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    } group flex items-center w-full px-3 py-2 text-base font-medium rounded-md`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;