import React, { useState } from 'react';
import { Bell, AlertCircle, Mail, Calendar, RefreshCw } from 'lucide-react';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'in_app';
  enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  icon: typeof Bell;
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'data_submission',
    name: 'Data Submission Reminders',
    description: 'Get notified when emission data needs to be submitted',
    type: 'email',
    enabled: true,
    frequency: 'weekly',
    icon: Calendar
  },
  {
    id: 'report_generation',
    name: 'Report Generation Alerts',
    description: 'Receive alerts when new reports are generated',
    type: 'email',
    enabled: true,
    frequency: 'immediate',
    icon: Mail
  },
  {
    id: 'system_updates',
    name: 'System Updates',
    description: 'Stay informed about system updates and maintenance',
    type: 'in_app',
    enabled: false,
    frequency: 'immediate',
    icon: RefreshCw
  }
];

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleFrequencyChange = (id: string, frequency: 'immediate' | 'daily' | 'weekly') => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, frequency } : setting
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification settings updated successfully');
    } catch (err) {
      setError('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Bell className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h2>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-100 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 text-sm text-green-600 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {settings.map(setting => {
            const Icon = setting.icon;
            return (
              <div key={setting.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      onChange={() => handleToggle(setting.id)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-0 sm:ml-3 flex-1">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <label className="font-medium text-gray-700 dark:text-gray-300">
                        {setting.name}
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {setting.description}
                    </p>
                    {setting.enabled && (
                      <div className="mt-2">
                        <select
                          value={setting.frequency}
                          onChange={(e) => handleFrequencyChange(setting.id, e.target.value as 'immediate' | 'daily' | 'weekly')}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      setting.type === 'email'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {setting.type === 'email' ? 'Email' : 'In-app'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;