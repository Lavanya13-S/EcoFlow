import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { Dashboard } from './components/Dashboard';
import { AddReading } from './components/AddReading';
import { Analytics } from './components/Analytics';
import { Predictions } from './components/Predictions';
import { LeakAnalyzer } from './components/LeakAnalyzer';
import Goals from './components/Goals';
import Recommendations from './components/Recommendations';
import { Community } from './components/Community';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Navigation } from './components/Navigation';
import { WaterData, UserProfile, Achievement } from './types';
import { generateMockData } from './utils/mockData';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<WaterData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Load saved data on app start
    const savedProfile = loadFromLocalStorage('userProfile');
    const savedData = loadFromLocalStorage('userData');
    const savedAchievements = loadFromLocalStorage('achievements');
    
    if (savedProfile) {
      setUserProfile(savedProfile);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
    
    if (savedData) {
      setUserData(savedData);
    }
    
    if (savedAchievements) {
      setAchievements(savedAchievements);
    }
  }, []);

  useEffect(() => {
    // Initialize with mock data when logged in
    if (isLoggedIn && userData.length === 0) {
      const mockData = generateMockData();
      setUserData(mockData);
      saveToLocalStorage('userData', mockData);

      setAchievements([
        { id: '1', name: 'First Week Saver', description: 'Completed your first week of tracking', earned: true, icon: '🎯' },
        { id: '2', name: 'Leak Detective', description: 'Detected and fixed a potential leak', earned: true, icon: '🔍' },
        { id: '3', name: 'Water Hero', description: 'Achieved 15% monthly savings', earned: false, icon: '🏆' },
        { id: '4', name: 'Goal Crusher', description: 'Met your monthly goal 3 times in a row', earned: false, icon: '💪' },
        { id: '5', name: 'Community Leader', description: 'Ranked in top 10 in your area', earned: false, icon: '👑' },
      ]);
    }
  }, [isLoggedIn, userProfile]);

  // Save data whenever it changes
  useEffect(() => {
    if (userProfile) {
      saveToLocalStorage('userProfile', userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userData.length > 0) {
      saveToLocalStorage('userData', userData);
    }
  }, [userData]);

  useEffect(() => {
    if (achievements.length > 0) {
      saveToLocalStorage('achievements', achievements);
    }
  }, [achievements]);

  const handleLogin = (profile: UserProfile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
    saveToLocalStorage('userProfile', profile);
    setCurrentPage('dashboard');
    
    // Add welcome notification
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Welcome back!',
      message: `Good to see you again, ${profile.name.split(' ')[0]}!`
    });
  };

  const handleSignup = (profile: UserProfile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
    saveToLocalStorage('userProfile', profile);
    setCurrentPage('dashboard');
    
    // Add welcome notification
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Welcome to EcoFlow!',
      message: `Welcome ${profile.name}! Your water conservation journey starts now!`
    });
  };

  const handleAddReading = (reading: WaterData) => {
    const newData = [...userData, reading];
    setUserData(newData);
    saveToLocalStorage('userData', newData);
    
    // Check for achievements
    checkAchievements(newData);
    
    // Add success notification
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Reading Added!',
      message: `Successfully recorded ${reading.usage}L usage for ${new Date(reading.date).toLocaleDateString()}`
    });
    
    // Navigate back to dashboard
    setCurrentPage('dashboard');
  };



  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveToLocalStorage('userProfile', updatedProfile);
    
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Profile Updated!',
      message: 'Your profile has been successfully updated.'
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserData([]);
    setAchievements([]);
    setNotifications([]);
    setCurrentPage('welcome');
    
    // Clear saved data
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userData');
    localStorage.removeItem('achievements');
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const checkAchievements = (data: WaterData[]) => {
    if (!userProfile) return;
    
    const currentMonth = new Date().getMonth();
    const currentMonthData = data.filter(d => new Date(d.date).getMonth() === currentMonth);
    const currentUsage = currentMonthData.reduce((sum, d) => sum + d.usage, 0);
    
    // Check if user met their goal
    if (currentUsage <= userProfile.monthlyGoal && !achievements.find(a => a.id === '3')?.earned) {
      const updatedAchievements = achievements.map(a => 
        a.id === '3' ? { ...a, earned: true } : a
      );
      setAchievements(updatedAchievements);
      
      addNotification({
        id: Date.now().toString(),
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message: 'Water Hero - You achieved 15% monthly savings!'
      });
    }
    
    // Check for consistent tracking (more than 10 readings)
    if (data.length >= 10 && !achievements.find(a => a.id === '4')?.earned) {
      const updatedAchievements = achievements.map(a => 
        a.id === '4' ? { ...a, earned: true } : a
      );
      setAchievements(updatedAchievements);
      
      addNotification({
        id: Date.now().toString(),
        type: 'achievement',
        title: '💪 Achievement Unlocked!',
        message: 'Goal Crusher - Consistent tracking for 10+ readings!'
      });
    }
  };

  // Show welcome page if not logged in and on welcome page
  if (!isLoggedIn && currentPage === 'welcome') {
    return <WelcomePage onNavigate={setCurrentPage} />;
  }

  // Show login/signup pages
  if (!isLoggedIn && currentPage === 'login') {
    return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
  }

  if (!isLoggedIn && currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onNavigate={setCurrentPage} />;
  }

  // Redirect to welcome if not logged in
  if (!isLoggedIn) {
    return <WelcomePage onNavigate={setCurrentPage} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={userData} userProfile={userProfile!} onNavigate={setCurrentPage} />;
      case 'add-reading':
        return <AddReading onAddReading={handleAddReading} />;
      case 'analytics':
        return <Analytics data={userData} />;
      case 'predictions':
        return <Predictions data={userData} userProfile={userProfile!} />;
      case 'leak-analyzer':
        return <LeakAnalyzer data={userData} />;
      case 'goals':
  return <Goals />;
      case 'recommendations':
        return <Recommendations data={userData} userProfile={userProfile!} />;
      case 'community':
        return <Community userProfile={userProfile!} />;
      case 'settings':
        return <Settings userProfile={userProfile!} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />;
      default:
        return <Dashboard data={userData} userProfile={userProfile!} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'achievement' ? 'bg-purple-500 text-white' :
              notification.type === 'warning' ? 'bg-orange-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="font-semibold">{notification.title}</div>
            <div className="text-sm opacity-90">{notification.message}</div>
          </div>
        ))}
      </div>
      
      <main className="pt-20 pb-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;