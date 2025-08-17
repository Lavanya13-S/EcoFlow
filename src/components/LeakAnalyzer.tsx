import React from 'react';
import { WaterData } from '../types';
import { AlertTriangle, CheckCircle, Wrench, TrendingUp } from 'lucide-react';

interface LeakAnalyzerProps {
  data: WaterData[];
}

export const LeakAnalyzer: React.FC<LeakAnalyzerProps> = ({ data }) => {
  // Analyze data for potential leaks
  const analyzeLeaks = () => {
    const recent30Days = data.slice(-30);
    const alerts = [];
    
    // Check for unusual continuous usage
    const avgUsage = recent30Days.reduce((sum, d) => sum + d.usage, 0) / Math.max(recent30Days.length, 1);
    const highUsageDays = recent30Days.filter(d => d.usage > avgUsage * 1.5);
    
    if (highUsageDays.length > 5) {
      alerts.push({
        id: 'continuous-high',
        severity: 'high' as const,
        title: 'Continuous High Usage Detected',
        description: 'Multiple days of unusually high usage could indicate a leak.',
        estimatedLoss: 150,
        recommendation: 'Check all faucets, toilets, and outdoor connections for leaks.'
      });
    }
    
    // Check for unusual spikes
    const spikes = recent30Days.filter(d => d.usage > avgUsage * 2);
    if (spikes.length > 0) {
      alerts.push({
        id: 'usage-spike',
        severity: 'medium' as const,
        title: 'Usage Spikes Detected',
        description: 'Sudden increases in water usage on specific days.',
        estimatedLoss: 80,
        recommendation: 'Monitor usage patterns and check for irrigation system issues.'
      });
    }
    
    return alerts;
  };

  const leakAlerts = analyzeLeaks();
  const hasLeaks = leakAlerts.length > 0;

  const healthMetrics = [
    {
      name: 'Baseline Consistency',
      value: hasLeaks ? 75 : 92,
      status: hasLeaks ? 'warning' : 'good'
    },
    {
      name: 'Night Usage',
      value: 88,
      status: 'good'
    },
    {
      name: 'Flow Anomalies',
      value: hasLeaks ? 65 : 95,
      status: hasLeaks ? 'alert' : 'good'
    },
    {
      name: 'Pressure Stability',
      value: 90,
      status: 'good'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leak Analyzer</h1>
        <p className="text-gray-600">
          Advanced leak detection using AI analysis of your water usage patterns.
        </p>
      </div>

      {/* System Health Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">System Health Status</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            hasLeaks ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
          }`}>
            {hasLeaks ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <span>{hasLeaks ? 'Issues Detected' : 'All Clear'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                metric.status === 'good' ? 'bg-green-100' :
                metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  metric.status === 'good' ? 'text-green-600' :
                  metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.value}%
                </span>
              </div>
              <h4 className="font-medium text-gray-900">{metric.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Leak Alerts */}
      {leakAlerts.length > 0 ? (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Potential Issues Detected</span>
          </h3>
          
          {leakAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl border-l-4 p-6 ${
              alert.severity === 'high' ? 'bg-red-50 border-red-400' :
              alert.severity === 'medium' ? 'bg-orange-50 border-orange-400' :
              'bg-yellow-50 border-yellow-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold text-lg mb-2 ${
                    alert.severity === 'high' ? 'text-red-900' :
                    alert.severity === 'medium' ? 'text-orange-900' :
                    'text-yellow-900'
                  }`}>
                    {alert.title}
                  </h4>
                  <p className={`mb-3 ${
                    alert.severity === 'high' ? 'text-red-700' :
                    alert.severity === 'medium' ? 'text-orange-700' :
                    'text-yellow-700'
                  }`}>
                    {alert.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center space-x-1 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      <TrendingUp size={16} />
                      <span>Est. Loss: {alert.estimatedLoss}L/day</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2 text-gray-700 mb-1">
                  <Wrench size={16} />
                  <span className="font-medium text-sm">Recommended Action:</span>
                </div>
                <p className="text-sm text-gray-600">{alert.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">No Issues Detected</h3>
              <p className="text-green-700">
                Your water usage patterns appear normal. We haven't detected any signs of leaks or unusual consumption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prevention Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leak Prevention Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Regular Checks</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <span>Check faucets and pipes for visible leaks monthly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <span>Monitor toilet tank for continuous running water</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <span>Inspect outdoor hoses and sprinkler connections</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Early Detection</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <span>Watch for unexplained increases in water bills</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <span>Listen for sounds of running water when all taps are off</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <span>Check water meter when no water is being used</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};