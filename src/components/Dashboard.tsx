import React from 'react';
import { WaterData, UserProfile } from '../types';
import { Droplets, TrendingUp, Target, AlertTriangle, Award } from 'lucide-react';
import { UsageChart } from './charts/UsageChart';

interface DashboardProps {
  data: WaterData[];
  userProfile: UserProfile;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, userProfile, onNavigate }) => {
  const currentMonth = new Date().getMonth();
  const currentMonthData = data.filter(d => new Date(d.date).getMonth() === currentMonth);
  const currentUsage = currentMonthData.reduce((sum, d) => sum + d.usage, 0);
  const previousMonthData = data.filter(d => new Date(d.date).getMonth() === currentMonth - 1);
  const previousUsage = previousMonthData.reduce((sum, d) => sum + d.usage, 0);
  
  const usageChange = previousUsage ? ((currentUsage - previousUsage) / previousUsage) * 100 : 0;
  const goalProgress = (currentUsage / userProfile.monthlyGoal) * 100;
  
  // Calculate real-time insights
  const avgDaily = currentUsage / Math.max(new Date().getDate(), 1);
  const projectedMonthly = avgDaily * 30;
  const daysLeft = 30 - new Date().getDate();
  const dailyTargetRemaining = Math.max(0, (userProfile.monthlyGoal - currentUsage) / Math.max(daysLeft, 1));

  const stats = [
    {
      title: 'This Month',
      value: `${currentUsage.toLocaleString()}L`,
      change: usageChange,
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Goal Progress',
      value: `${Math.round(goalProgress)}%`,
      change: goalProgress - 100,
      icon: Target,
      color: goalProgress <= 100 ? 'green' : 'red'
    },
    {
      title: 'Current Streak',
      value: `${userProfile.currentStreak} days`,
      change: 0,
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Total Saved',
      value: `${(userProfile.totalSaved / 1000).toFixed(1)}kL`,
      change: 15.2,
      icon: TrendingUp,
      color: 'emerald'
    }
  ];

  const quickTips = [
    "A 5-minute shower uses about 50L less water than a bath!",
    "Fix leaky faucets - they can waste up to 750L per day.",
    "Run dishwashers and washing machines only with full loads.",
    "Water your garden early morning or evening to reduce evaporation.",
    "Install low-flow showerheads to save 40% on shower water usage."
  ];
  
  const randomTip = quickTips[Math.floor(Math.random() * quickTips.length)];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userProfile.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          This month you've used {currentUsage.toLocaleString()} liters — 
          {usageChange > 0 ? (
            <span className="text-orange-600 font-semibold"> {usageChange.toFixed(1)}% more than last month</span>
          ) : (
            <span className="text-green-600 font-semibold"> {Math.abs(usageChange).toFixed(1)}% less than last month</span>
          )}
        </p>
        {projectedMonthly > userProfile.monthlyGoal && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm">
              ⚠️ At current usage rate, you'll use {Math.round(projectedMonthly).toLocaleString()}L this month. 
              Try to use less than {Math.round(dailyTargetRemaining)}L per day to meet your goal!
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.change > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    <TrendingUp size={14} className={stat.change < 0 ? 'rotate-180' : ''} />
                    <span>{Math.abs(stat.change).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trend</h3>
          <UsageChart data={data.slice(-30)} />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('add-reading')}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Add New Reading
            </button>
            <button 
              onClick={() => onNavigate('add-reading')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Upload Water Bill
            </button>
            <button 
              onClick={() => onNavigate('analytics')}
              className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-200 transition-colors duration-200"
            >
              View Detailed Analytics
            </button>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertTriangle size={20} />
                <span className="font-medium">Conservation Tip</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                {randomTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Goal Progress</h3>
          <span className="text-sm text-gray-600">{currentUsage.toLocaleString()}L / {userProfile.monthlyGoal.toLocaleString()}L</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                goalProgress <= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-red-500'
              }`}
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
          {goalProgress > 100 && (
            <div className="mt-2 text-center">
              <span className="text-red-600 text-sm font-medium">
                You're {Math.round(goalProgress - 100)}% over your monthly goal
              </span>
            </div>
          )}
          {goalProgress <= 100 && (
            <div className="mt-2 text-center">
              <span className="text-green-600 text-sm font-medium">
                Great job! You're on track to meet your goal. Keep it up! 🎉
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{Math.round(avgDaily)}L</div>
            <div className="text-sm text-blue-700">Daily Average</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{Math.round(projectedMonthly).toLocaleString()}L</div>
            <div className="text-sm text-green-700">Projected Monthly</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">{Math.round(dailyTargetRemaining)}L</div>
            <div className="text-sm text-purple-700">Daily Target Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};