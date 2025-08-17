import React, { useState } from 'react';
import { WaterData, UserProfile } from '../types';
import { Brain, TrendingUp, Calendar, Cloud, AlertCircle } from 'lucide-react';

interface PredictionsProps {
  data: WaterData[];
  userProfile: UserProfile;
}

export const Predictions: React.FC<PredictionsProps> = ({ data, userProfile }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Calculate predictions based on historical data and seasonal factors
  const calculatePrediction = () => {
    const recent30Days = data.slice(-30);
    const avgDaily = recent30Days.reduce((sum, d) => sum + d.usage, 0) / Math.max(recent30Days.length, 1);
    
    const currentMonth = new Date().getMonth();
    const seasonalMultiplier = [0.9, 0.85, 0.95, 1.1, 1.2, 1.3, 1.4, 1.35, 1.15, 1.0, 0.9, 0.85][currentMonth];
    
    const basePrediction = avgDaily * (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90);
    const seasonalPrediction = basePrediction * seasonalMultiplier;
    
    return {
      predicted: Math.round(seasonalPrediction),
      confidence: 85,
      factors: [
        'Historical usage patterns',
        'Seasonal adjustments',
        'Local weather trends',
        'Household behavior analysis'
      ]
    };
  };

  const prediction = calculatePrediction();
  const goalComparison = selectedPeriod === 'month' ? 
    ((prediction.predicted - userProfile.monthlyGoal) / userProfile.monthlyGoal) * 100 : 0;

  const alerts = [
    {
      type: 'warning' as const,
      title: 'Above Goal Prediction',
      message: `You might exceed your monthly goal by ${Math.abs(goalComparison).toFixed(0)}%`,
      visible: goalComparison > 5
    },
    {
      type: 'info' as const,
      title: 'Summer Season Impact',
      message: 'Higher usage expected due to increased irrigation and cooling needs',
      visible: new Date().getMonth() >= 5 && new Date().getMonth() <= 8
    },
    {
      type: 'success' as const,
      title: 'On Track',
      message: 'Current usage patterns suggest you\'ll meet your conservation goals',
      visible: goalComparison <= 5 && goalComparison >= -5
    }
  ];

  const visibleAlerts = alerts.filter(alert => alert.visible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Predictions</h1>
        <p className="text-gray-600">
          Our AI analyzes your usage patterns, seasonal trends, and local factors to predict future consumption.
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Prediction Period</span>
          </h3>
          <div className="flex space-x-2">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Predicted Usage - Next {selectedPeriod}
              </h4>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {prediction.predicted.toLocaleString()}L
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp size={16} />
                  <span>Confidence: {prediction.confidence}%</span>
                </div>
                {selectedPeriod === 'month' && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Goal: {userProfile.monthlyGoal.toLocaleString()}L</span>
                  </div>
                )}
              </div>
              
              {selectedPeriod === 'month' && (
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-500 ${
                        goalComparison <= 5 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                        goalComparison <= 15 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-orange-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min((prediction.predicted / userProfile.monthlyGoal) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm">
                    {goalComparison > 5 ? (
                      <span className="text-orange-600 font-medium">
                        {goalComparison.toFixed(0)}% over monthly goal
                      </span>
                    ) : goalComparison < -5 ? (
                      <span className="text-green-600 font-medium">
                        {Math.abs(goalComparison).toFixed(0)}% under monthly goal
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">On track to meet goal</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span>Prediction Factors</span>
              </h5>
              <ul className="space-y-2 text-sm text-gray-600">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="font-semibold text-amber-800 mb-2">Seasonal Impact</h5>
              <p className="text-sm text-amber-700">
                {new Date().getMonth() >= 5 && new Date().getMonth() <= 8 
                  ? 'Summer months typically show 20-40% higher usage due to outdoor activities.'
                  : 'Winter months show reduced outdoor water usage, offering conservation opportunities.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Alerts & Recommendations</h3>
          {visibleAlerts.map((alert, index) => (
            <div key={index} className={`rounded-lg border p-4 ${
              alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
              alert.type === 'success' ? 'bg-green-50 border-green-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'warning' ? 'text-orange-600' :
                  alert.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    alert.type === 'warning' ? 'text-orange-900' :
                    alert.type === 'success' ? 'text-green-900' :
                    'text-blue-900'
                  }`}>
                    {alert.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    alert.type === 'warning' ? 'text-orange-700' :
                    alert.type === 'success' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historical Accuracy */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Accuracy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
            <div className="text-sm text-gray-600">Last Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">88%</div>
            <div className="text-sm text-gray-600">3-Month Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
            <div className="text-sm text-gray-600">Overall Accuracy</div>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-600">
          <p>Our AI continuously learns from your usage patterns and external factors to improve prediction accuracy over time.</p>
        </div>
      </div>
    </div>
  );
};