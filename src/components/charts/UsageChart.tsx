import React from 'react';
import { WaterData } from '../../types';

interface UsageChartProps {
  data: WaterData[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No data available to display chart</p>
      </div>
    );
  }

  const maxUsage = Math.max(...data.map(d => d.usage), 1);
  const chartHeight = 200;

  return (
    <div className="relative w-full">
      <div className="flex items-end justify-between space-x-1" style={{ height: `${chartHeight}px` }}>
        {data.slice(-14).map((item, index) => {
          const height = (item.usage / maxUsage) * (chartHeight - 40);
          const date = new Date(item.date);
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="relative">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-green-400 rounded-t-sm hover:from-blue-600 hover:to-green-500 transition-all duration-200 cursor-pointer min-w-[20px]"
                  style={{ height: `${height}px`, minHeight: '4px' }}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {item.usage}L
                    <div className="text-gray-300">{date.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                {date.getDate()}/{date.getMonth() + 1}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-16 w-12 text-right">
        <span>{Math.round(maxUsage)}L</span>
        <span>{Math.round(maxUsage * 0.75)}L</span>
        <span>{Math.round(maxUsage * 0.5)}L</span>
        <span>{Math.round(maxUsage * 0.25)}L</span>
        <span>0L</span>
      </div>
    </div>
  );
};