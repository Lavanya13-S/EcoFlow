import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users, Trophy, Medal, Share2, MapPin, TrendingUp } from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

interface CommunityProps {
  userProfile: UserProfile;
}

export const Community: React.FC<CommunityProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'share'>('leaderboard');
  const [joinedChallenges, setJoinedChallenges] = useState<{[key: string]: {joined: boolean, progress: number, completed?: boolean}}>(() => {
    return loadFromLocalStorage('joinedChallenges') || {};
  });
  const [userRank, setUserRank] = useState(() => {
    return loadFromLocalStorage('userRank') || userProfile.rank || 5;
  });

  // Generate dynamic leaderboard with user's actual name
  const generateLeaderboard = () => {
    const baseUsers = [
      { id: '1', name: 'Sarah Chen', savings: 42, rank: 1, avatar: '👩‍💼', location: userProfile.location },
      { id: '2', name: 'Mike Johnson', savings: 38, rank: 2, avatar: '👨‍🔧', location: userProfile.location },
      { id: '3', name: 'Emma Wilson', savings: 35, rank: 3, avatar: '👩‍🎓', location: userProfile.location },
      { id: '4', name: 'David Park', savings: 32, rank: 4, avatar: '👨‍🍳', location: userProfile.location },
      { id: '6', name: 'Lisa Rodriguez', savings: 25, rank: 6, avatar: '👩‍⚕️', location: userProfile.location },
      { id: '7', name: 'Tom Anderson', savings: 22, rank: 7, avatar: '👨‍🏫', location: userProfile.location },
    ];
    
    // Insert user at their current rank
    const userEntry = {
      id: 'user',
      name: `${userProfile.name} (You)`,
      savings: Math.max(28 - (userRank - 5) * 3, 15),
      rank: userRank,
      avatar: '👤',
      location: userProfile.location
    };
    
    const leaderboard = [...baseUsers];
    leaderboard.splice(userRank - 1, 0, userEntry);
    
    // Adjust ranks
    return leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    })).slice(0, 7);
  };

  const leaderboardData = generateLeaderboard();

  const communityStats = {
    totalMembers: 1247,
    totalSavings: 125000,
    avgSavings: 18,
    topCity: 'San Francisco'
  };

  // Generate dynamic challenges based on current date
  const generateChallenges = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentWeek = Math.ceil(now.getDate() / 7);
    
    const challengeTemplates = [
      {
        name: 'Neighborhood Water Week',
        description: 'Reduce community water usage by 20% this week',
        reward: 'Community Garden Fund',
        type: 'weekly'
      },
      {
        name: 'Leak Detection Drive',
        description: 'Help neighbors identify and fix leaks',
        reward: 'Plumber Workshop',
        type: 'monthly'
      },
      {
        name: 'Smart Irrigation Challenge',
        description: 'Optimize outdoor watering schedules',
        reward: 'Smart Sprinkler System',
        type: 'monthly'
      },
      {
        name: 'Indoor Conservation Sprint',
        description: 'Reduce indoor water usage by 15%',
        reward: 'Eco-Friendly Fixtures',
        type: 'weekly'
      }
    ];
    
    return challengeTemplates.map((template, index) => {
      const isWeekly = template.type === 'weekly';
      const endDate = new Date();
      
      if (isWeekly) {
        endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
      } else {
        endDate.setMonth(endDate.getMonth() + 1, 0);
      }
      
      return {
        id: `${currentMonth}-${currentWeek}-${index}`,
        name: template.name,
        description: template.description,
        participants: 89 + Math.floor(Math.random() * 100),
        progress: 45 + Math.floor(Math.random() * 40),
        endDate: endDate.toISOString().split('T')[0],
        reward: template.reward
      };
    }).slice(0, 2);
  };

  const communityChallenges = generateChallenges();

  const tabs = [
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'challenges', name: 'Community Challenges', icon: Users },
    { id: 'share', name: 'Share & Compare', icon: Share2 }
  ];

  const handleJoinChallenge = (challengeId: string) => {
    const updatedChallenges = {
      ...joinedChallenges,
      [challengeId]: { joined: true, progress: 0 }
    };
    setJoinedChallenges(updatedChallenges);
    saveToLocalStorage('joinedChallenges', updatedChallenges);
    
    const event = new CustomEvent('showNotification', {
      detail: { message: 'Challenge joined! Start making a difference!', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handleChallengeProgress = (challengeId: string, completed: boolean) => {
    const updatedChallenges = {
      ...joinedChallenges,
      [challengeId]: { 
        ...joinedChallenges[challengeId], 
        progress: completed ? 100 : joinedChallenges[challengeId]?.progress || 0,
        completed 
      }
    };
    setJoinedChallenges(updatedChallenges);
    saveToLocalStorage('joinedChallenges', updatedChallenges);
    
    // Update user rank if challenge completed
    if (completed && userRank > 1) {
      const newRank = Math.max(1, userRank - 1);
      setUserRank(newRank);
      saveToLocalStorage('userRank', newRank);
      
      // Update user profile rank
      const updatedProfile = { ...userProfile, rank: newRank };
      saveToLocalStorage('userProfile', updatedProfile);
    }
    
    const event = new CustomEvent('showNotification', {
      detail: { 
        message: completed ? 'Challenge completed! Great work!' : 'Progress updated!', 
        type: completed ? 'success' : 'info' 
      }
    });
    window.dispatchEvent(event);
  };

  const handleSocialShare = (platform: string) => {
    const shareText = `I've saved ${(userProfile.totalSaved / 1000).toFixed(1)}kL of water this month with EcoFlow! That's enough for ${Math.round(userProfile.totalSaved / 150)} average showers. Join me in making every drop count! 💧🌱 #${userRank} in my neighborhood!`;
    const shareUrl = 'https://ecoflow.app';
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
        <p className="text-gray-600">
          Compare with peers, join challenges, and share your conservation achievements.
        </p>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {communityStats.totalMembers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {(communityStats.totalSavings / 1000).toFixed(0)}kL
            </div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {communityStats.avgSavings}%
            </div>
            <div className="text-sm text-gray-600">Avg. Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              #{userRank}
            </div>
            <div className="text-sm text-gray-600">Your Rank</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'leaderboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  🏆 San Francisco Water Savers
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>Your neighborhood</span>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboardData.map((member) => (
                  <div key={member.id} className={`flex items-center justify-between p-4 rounded-lg ${
                    member.name.includes('You') 
                      ? 'bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-all duration-200`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        member.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        member.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        member.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {member.rank <= 3 ? (
                          member.rank === 1 ? '🥇' :
                          member.rank === 2 ? '🥈' :
                          '🥉'
                        ) : member.rank}
                      </div>
                      <div className="text-2xl">{member.avatar}</div>
                      <div>
                        <div className={`font-semibold ${
                          member.name.includes('You') ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">{member.location}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-green-600">{member.savings}%</div>
                      <div className="text-xs text-gray-500">savings</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Community Challenges</h3>
              <div className="space-y-6">
                {communityChallenges.map((challenge) => (
                  <div key={challenge.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{challenge.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{challenge.participants} participants</span>
                          <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-600 font-semibold">{challenge.reward}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {!joinedChallenges[challenge.id]?.joined && (
                        <button 
                          onClick={() => handleJoinChallenge(challenge.id)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        >
                          Join Challenge
                        </button>
                      )}
                      
                      {joinedChallenges[challenge.id]?.joined && !joinedChallenges[challenge.id]?.completed && (
                        <div className="space-y-2">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <span className="text-blue-800 font-medium">Challenge Joined!</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => handleChallengeProgress(challenge.id, true)}
                              className="bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                            >
                              Mark Completed
                            </button>
                            <button 
                              onClick={() => handleChallengeProgress(challenge.id, false)}
                              className="bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                            >
                              Not Completed
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {joinedChallenges[challenge.id]?.completed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <span className="text-green-800 font-medium">✅ Challenge Completed!</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Achievements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Your Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Savings:</span>
                      <span className="font-semibold text-blue-600">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak:</span>
                      <span className="font-semibold text-orange-600">{userProfile.currentStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Saved:</span>
                      <span className="font-semibold text-green-600">{(userProfile.totalSaved / 1000).toFixed(1)}kL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Community Rank:</span>
                      <span className="font-semibold text-purple-600">#{userRank}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Share To:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Twitter</span>
                    </button>
                    <button 
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Facebook</span>
                    </button>
                    <button 
                      onClick={() => handleSocialShare('whatsapp')}
                      className="flex items-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => handleSocialShare('linkedin')}
                      className="flex items-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>LinkedIn</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Ready to Share:</h4>
                <p className="text-sm text-gray-600 italic bg-white p-3 rounded border-l-4 border-green-500">
                  "I've saved {(userProfile.totalSaved / 1000).toFixed(1)}kL of water this month with EcoFlow! 
                  That's enough for {Math.round(userProfile.totalSaved / 150)} average showers. 
                  Join me in making every drop count! 💧🌱 #{userRank} in my neighborhood!"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};