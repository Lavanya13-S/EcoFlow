import React, { useState, useEffect } from 'react';
import { Lightbulb, Droplets, Home, TreePine, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'overall' | 'indoor' | 'outdoor';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  savings: string;
}

interface TipStatus {
  status: 'not_started' | 'active' | 'completed' | 'not_completed';
  startedAt?: string;
}

interface RecommendationsProps {
  data: any;
  userProfile: any;
}

const Recommendations: React.FC<RecommendationsProps> = ({ data, userProfile }) => {
  const [tipStatuses, setTipStatuses] = useState<Record<string, TipStatus>>({});
  const [notification, setNotification] = useState<string>('');

  const tips: Tip[] = [
    // Overall Tips
    {
      id: 'overall-1',
      title: 'Monitor Daily Usage',
      description: 'Check your water meter daily to track consumption patterns and identify unusual spikes.',
      category: 'overall',
      difficulty: 'Easy',
      savings: '10-15%'
    },
    {
      id: 'overall-2',
      title: 'Fix Leaks Immediately',
      description: 'Repair any leaks as soon as they are detected to prevent water waste.',
      category: 'overall',
      difficulty: 'Medium',
      savings: '20-30%'
    },
    {
      id: 'overall-3',
      title: 'Install Water-Efficient Fixtures',
      description: 'Replace old fixtures with water-efficient models to reduce overall consumption.',
      category: 'overall',
      difficulty: 'Hard',
      savings: '25-40%'
    },
    // Indoor Tips
    {
      id: 'indoor-1',
      title: 'Take Shorter Showers',
      description: 'Reduce shower time by 2-3 minutes to save significant amounts of water.',
      category: 'indoor',
      difficulty: 'Easy',
      savings: '15-20%'
    },
    {
      id: 'indoor-2',
      title: 'Fix Dripping Faucets',
      description: 'Repair leaky faucets and running toilets to eliminate continuous water waste.',
      category: 'indoor',
      difficulty: 'Medium',
      savings: '10-25%'
    },
    {
      id: 'indoor-3',
      title: 'Install Low-Flow Showerheads',
      description: 'Replace standard showerheads with low-flow models to reduce water usage.',
      category: 'indoor',
      difficulty: 'Medium',
      savings: '20-30%'
    },
    // Outdoor Tips
    {
      id: 'outdoor-1',
      title: 'Water Plants Early Morning',
      description: 'Water your garden early in the morning to reduce evaporation losses.',
      category: 'outdoor',
      difficulty: 'Easy',
      savings: '15-25%'
    },
    {
      id: 'outdoor-2',
      title: 'Use Drip Irrigation',
      description: 'Install drip irrigation systems for efficient watering of plants and gardens.',
      category: 'outdoor',
      difficulty: 'Hard',
      savings: '30-50%'
    },
    {
      id: 'outdoor-3',
      title: 'Collect Rainwater',
      description: 'Set up rain barrels to collect and reuse rainwater for outdoor watering.',
      category: 'outdoor',
      difficulty: 'Medium',
      savings: '20-35%'
    }
  ];

  useEffect(() => {
    const savedStatuses = localStorage.getItem('tipStatuses');
    if (savedStatuses) {
      setTipStatuses(JSON.parse(savedStatuses));
    }
  }, []);

  const saveTipStatuses = (newStatuses: Record<string, TipStatus>) => {
    setTipStatuses(newStatuses);
    localStorage.setItem('tipStatuses', JSON.stringify(newStatuses));
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const startTip = (tipId: string) => {
    const newStatuses = {
      ...tipStatuses,
      [tipId]: {
        status: 'active' as const,
        startedAt: new Date().toISOString()
      }
    };
    saveTipStatuses(newStatuses);
    showNotification('Tip started!');
  };

  const completeTip = (tipId: string, completed: boolean) => {
    const newStatuses = {
      ...tipStatuses,
      [tipId]: {
        ...tipStatuses[tipId],
        status: completed ? 'completed' as const : 'not_completed' as const
      }
    };
    saveTipStatuses(newStatuses);
    showNotification(completed ? 'Tip completed!' : 'Tip marked as not completed');
  };

  const retryTip = (tipId: string) => {
    const newStatuses = {
      ...tipStatuses,
      [tipId]: {
        status: 'active' as const,
        startedAt: new Date().toISOString()
      }
    };
    saveTipStatuses(newStatuses);
    showNotification('Tip restarted!');
  };

  const renderTipButton = (tip: Tip) => {
    const status = tipStatuses[tip.id]?.status || 'not_started';

    switch (status) {
      case 'not_started':
        return (
          <button
            onClick={() => startTip(tip.id)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start This Tip
          </button>
        );
      case 'active':
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <Lightbulb className="w-4 h-4" />
              Tip Active
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => completeTip(tip.id, true)}
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                Completed
              </button>
              <button
                onClick={() => completeTip(tip.id, false)}
                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-3 h-3" />
                Not Completed
              </button>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            ✅ Completed
          </div>
        );
      case 'not_completed':
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <XCircle className="w-4 h-4" />
              ❌ Not Completed
            </div>
            <button
              onClick={() => retryTip(tip.id)}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'overall': return <Droplets className="w-5 h-5" />;
      case 'indoor': return <Home className="w-5 h-5" />;
      case 'outdoor': return <TreePine className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'overall': return 'border-blue-200 bg-blue-50';
      case 'indoor': return 'border-green-200 bg-green-50';
      case 'outdoor': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'overall': return 'Overall Conservation';
      case 'indoor': return 'Indoor Conservation';
      case 'outdoor': return 'Outdoor Conservation';
      default: return 'Conservation Tips';
    }
  };

  const groupedTips = tips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, Tip[]>);

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Water Conservation Tips</h2>
        <p className="text-gray-600">Personalized recommendations to help you save water and reduce costs</p>
      </div>

      {Object.entries(groupedTips).map(([category, categoryTips]) => (
        <div key={category} className={`border-2 rounded-xl p-6 ${getCategoryColor(category)}`}>
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(category)}
            <h3 className="text-xl font-semibold text-gray-800">
              {getCategoryTitle(category)}
            </h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                    {tip.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {tip.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500">
                    Potential savings: <span className="font-medium text-green-600">{tip.savings}</span>
                  </span>
                </div>
                
                {renderTipButton(tip)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;