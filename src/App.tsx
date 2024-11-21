import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart3, Building2, Factory, Leaf, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmissionsPage from './pages/EmissionsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AuthLayout from './components/AuthLayout';
import { useAuth } from './lib/auth';

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { name: 'Emissions', icon: Factory, href: '/emissions' },
    { name: 'Organizations', icon: Building2, href: '/organizations' },
    { name: 'Sustainability', icon: Leaf, href: '/sustainability' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <HomePage />
        } />
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          <AuthLayout>
            <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
              <Sidebar 
                navigationItems={navigationItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              
              <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
                <Header 
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/emissions" element={<EmissionsPage />} />
                    <Route path="/organizations" element={<OrganizationsPage />} />
                    <Route path="/sustainability" element={<SustainabilityPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
              </div>
            </div>
          </AuthLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;