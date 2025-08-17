import React from 'react';
import { Home, BarChart3, TrendingUp, AlertTriangle, Target, Lightbulb, Users, Settings, Plus, LogOut, User } from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isLoggedIn, 
  userProfile, 
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'add-reading', name: 'Add Reading', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'predictions', name: 'Predictions', icon: TrendingUp },
    { id: 'leak-analyzer', name: 'Leak Analyzer', icon: AlertTriangle },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'recommendations', name: 'Tips', icon: Lightbulb },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">EF</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EcoFlow
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User size={16} />
              <span className="text-sm font-medium">{userProfile?.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="bg-transparent border border-green-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};