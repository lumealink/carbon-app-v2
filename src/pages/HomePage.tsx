import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Cloud, Globe, Shield, Leaf, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src="https://lumealink.com/wp-content/uploads/2024/10/Lumealink-Color-Logo-copy-w-scaled.gif" 
                alt="Lumealink Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Carbon Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Measure and Reduce Your</span>
              <span className="block text-blue-600">Carbon Footprint</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Comprehensive cloud-based carbon accounting software for businesses committed to sustainability. Track, analyze, and reduce your environmental impact.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Comprehensive Carbon Management
            </h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  title: 'Accurate Tracking',
                  description: 'Real-time monitoring of your carbon emissions across all operations and facilities.'
                },
                {
                  icon: Globe,
                  title: 'Global Standards',
                  description: 'Compliant with GHG Protocol, ISO 14064, and other international standards.'
                },
                {
                  icon: Shield,
                  title: 'Data Security',
                  description: 'Enterprise-grade security ensuring your environmental data stays protected.'
                },
                {
                  icon: Leaf,
                  title: 'Sustainability Goals',
                  description: 'Set and track environmental targets aligned with science-based initiatives.'
                }
              ].map((feature) => (
                <div key={feature.title} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white text-center">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to reduce your carbon footprint?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="https://lumealink.com/wp-content/uploads/2024/10/Lumealink-Color-Logo-copy-w-scaled.gif" 
                alt="Lumealink Logo" 
                className="h-6 w-auto"
              />
              <span className="ml-2 text-gray-900 dark:text-white font-semibold">Carbon Tracker</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Lumealink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;