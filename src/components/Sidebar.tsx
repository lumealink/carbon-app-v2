import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarProps {
  navigationItems: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems, isOpen }) => {
  const location = useLocation();

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
      lg:translate-x-0 lg:static lg:inset-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="h-16 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <img 
          src="https://lumealink.com/wp-content/uploads/2024/10/Lumealink-Color-Logo-copy-w-scaled.gif" 
          alt="Lumealink Logo" 
          className="h-6 w-auto mb-1"
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Carbon Tracker</h1>
      </div>

      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md 
                ${location.pathname === item.href
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;