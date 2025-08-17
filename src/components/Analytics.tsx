import React, { useState } from 'react';
import { WaterData } from '../types';
import { Calendar, BarChart, TrendingUp, Droplets } from 'lucide-react';
import { UsageChart } from './charts/UsageChart';

interface AnalyticsProps {
  data: WaterData[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return data.filter(d => new Date(d.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();
  const totalUsage = filteredData.reduce((sum, d) => sum + d.usage, 0);
  const averageDaily = totalUsage / Math.max(1, filteredData.length);
  const peakUsage = Math.max(...filteredData.map(d => d.usage), 0);
  const peakDay = filteredData.find(d => d.usage === peakUsage);

  const insights = [
    {
      title: 'Total Usage',
      value: `${totalUsage.toLocaleString()}L`,
      icon: Droplets,
      color: 'blue',
      description: `Over the last ${timeframe}`
    },
    {
      title: 'Daily Average',
      value: `${Math.round(averageDaily)}L`,
      icon: BarChart,
      color: 'green',
      description: 'Average consumption per day'
    },
    {
      title: 'Peak Usage',
      value: `${Math.round(peakUsage)}L`,
      icon: TrendingUp,
      color: 'orange',
      description: peakDay ? `On ${new Date(peakDay.date).toLocaleDateString()}` : 'No data'
    },
    {
      title: 'Data Points',
      value: filteredData.length.toString(),
      icon: Calendar,
      color: 'purple',
      description: 'Readings recorded'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage Analytics</h1>
        <p className="text-gray-600">
          See when you consume the most, track seasonal changes, and compare with previous periods.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Time Period</h3>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${insight.color}-100 mb-3`}>
                  <Icon className={`w-6 h-6 text-${insight.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
                <div className="text-sm font-medium text-gray-700">{insight.title}</div>
                <div className="text-xs text-gray-500 mt-1">{insight.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Trend</h3>
        <UsageChart data={filteredData} />
      </div>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Pattern</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const dayData = filteredData.filter(d => new Date(d.date).getDay() === (index + 1) % 7);
              const avgUsage = dayData.length > 0 ? dayData.reduce((sum, d) => sum + d.usage, 0) / dayData.length : 0;
              const maxAvg = Math.max(120, Math.max(...filteredData.map(d => d.usage), 120)); // Dynamic max for better visualization
              
              return (
                <div key={day} className="flex items-center space-x-3">
                  <div className="w-10 text-sm text-gray-600 font-medium">{day}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((avgUsage / maxAvg) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-20 text-right font-medium">
                    {Math.round(avgUsage)}L
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-1">Peak Usage Day</h4>
              <p className="text-blue-700 text-sm">
                {peakDay ? `${new Date(peakDay.date).toLocaleDateString()} with ${Math.round(peakUsage)}L` : 'No data available'}
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-1">Most Efficient Day</h4>
              <p className="text-green-700 text-sm">
                Typically {averageDaily < 80 ? 'weekdays' : 'weekends'} with lower usage
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-1">Usage Trend</h4>
              <p className="text-amber-700 text-sm">
                {filteredData.length > 7 ? 'Showing steady consumption patterns' : 'Need more data for trend analysis'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};