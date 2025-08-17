import React, { useState, useEffect } from 'react';
import { Target, Trophy, Flame, TrendingUp, Calendar, Award, Star, Zap } from 'lucide-react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  type: 'reduction' | 'limit' | 'streak';
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    unit: 'liters',
    deadline: '',
    type: 'reduction' as 'reduction' | 'limit' | 'streak',
    description: ''
  });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadGoalsAndAchievements();
  }, []);

  const loadGoalsAndAchievements = () => {
    const userData = loadFromLocalStorage('goalsModuleData');
    const savedGoals = userData?.goals || [];
    const savedAchievements = userData?.achievements || getDefaultAchievements();
    const userStreak = userData?.streak || 0;

    setGoals(savedGoals);
    setAchievements(savedAchievements);
    setStreak(userStreak);

    // Update goal progress based on current usage
    updateGoalProgress(savedGoals);
  };

  const getDefaultAchievements = (): Achievement[] => [
    {
      id: 'first-reading',
      title: 'First Drop',
      description: 'Added your first water reading',
      icon: '💧',
      unlocked: false
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintained conservation for 7 days',
      icon: '🔥',
      unlocked: false
    },
    {
      id: 'goal-achiever',
      title: 'Goal Crusher',
      description: 'Achieved your first conservation goal',
      icon: '🎯',
      unlocked: false
    },
    {
      id: 'water-saver',
      title: 'Water Guardian',
      description: 'Saved over 1000 liters',
      icon: '🌊',
      unlocked: false
    },
    {
      id: 'eco-champion',
      title: 'Eco Champion',
      description: 'Completed 5 conservation goals',
      icon: '🏆',
      unlocked: false
    }
  ];

  const updateGoalProgress = (currentGoals: Goal[]) => {
    const userData = loadFromLocalStorage('goalsModuleData');
    const readings = userData?.readings || [];
    
    if (readings.length === 0) return;

    const updatedGoals = currentGoals.map(goal => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyReadings = readings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate.getMonth() === currentMonth && 
               readingDate.getFullYear() === currentYear;
      });

      if (monthlyReadings.length > 0) {
        const totalUsage = monthlyReadings.reduce((sum, reading) => sum + reading.usage, 0);
        goal.current = totalUsage;
      }

      return goal;
    });

    setGoals(updatedGoals);
    
    // Save updated goals
    const updatedUserData = { ...userData, goals: updatedGoals };
    saveToLocalStorage('goalsModuleData', updatedUserData);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      type: newGoal.type,
      description: newGoal.description
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);

    // Save to storage
    const userData = loadFromLocalStorage('goalsModuleData');
    const updatedUserData = { ...userData, goals: updatedGoals };
    saveToLocalStorage('goalsModuleData', updatedUserData);

    // Reset form
    setNewGoal({
      title: '',
      target: '',
      unit: 'liters',
      deadline: '',
      type: 'reduction',
      description: ''
    });
    setShowNewGoal(false);

    // Show success message
    const event = new CustomEvent('showNotification', {
      detail: { message: 'Goal created successfully!', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.type === 'reduction') {
      return Math.max(0, Math.min(100, ((goal.target - goal.current) / goal.target) * 100));
    } else {
      return Math.min(100, (goal.current / goal.target) * 100);
    }
  };

  const getGoalStatus = (goal: Goal) => {
    const progress = getGoalProgress(goal);
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const isOverdue = now > deadline;

    if (progress >= 100) return 'completed';
    if (isOverdue) return 'overdue';
    if (progress >= 75) return 'on-track';
    return 'behind';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedGoals = goals.filter(g => getGoalStatus(g) === 'completed');
  const incompleteGoals = goals.filter(g => getGoalStatus(g) !== 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Target className="mr-3 text-green-600" />
            Goals & Achievements
          </h1>
          <p className="text-gray-600">
            Set conservation goals, track progress, and unlock achievements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-800">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedGoals.length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{streak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-purple-600">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Target className="mr-2 text-green-600" />
                Active Goals
              </h2>
              <button
                onClick={() => setShowNewGoal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                New Goal
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No goals set yet</p>
                <button
                  onClick={() => setShowNewGoal(true)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create your first goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Active Goals ({incompleteGoals.length})</h4>
                  {incompleteGoals.length === 0 ? (
                    <p className="text-gray-500 text-sm">No active goals</p>
                  ) : (
                    <div className="space-y-3">
                      {incompleteGoals.map(goal => {
                        const progress = getGoalProgress(goal);
                        const status = getGoalStatus(goal);
                        
                        return (
                          <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-800">{goal.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {status.replace('-', ' ')}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{progress.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    status === 'completed' ? 'bg-green-500' :
                                    status === 'on-track' ? 'bg-blue-500' :
                                    status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(100, progress)}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                              </span>
                              <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {completedGoals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Completed Goals ({completedGoals.length})</h4>
                    <div className="space-y-3">
                      {completedGoals.map(goal => {
                        const progress = getGoalProgress(goal);
                        const status = getGoalStatus(goal);
                        
                        return (
                          <div key={goal.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-green-800">{goal.title}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                                ✅ Completed
                              </span>
                            </div>
                            
                            <p className="text-sm text-green-700 mb-3">{goal.description}</p>
                            
                            <div className="flex justify-between text-sm text-green-600">
                              <span>
                                {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                              </span>
                              <span>Completed: {new Date(goal.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Trophy className="mr-2 text-yellow-600" />
              Achievements
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 transition-all ${
                    achievement.unlocked
                      ? 'border-yellow-200 bg-yellow-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`text-2xl mr-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Goal Modal */}
        {showNewGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Goal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Reduce monthly usage by 20%"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="liters">Liters</option>
                      <option value="gallons">Gallons</option>
                      <option value="cubic meters">Cubic Meters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="reduction">Reduction Goal</option>
                    <option value="limit">Usage Limit</option>
                    <option value="streak">Conservation Streak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your conservation goal..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewGoal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}