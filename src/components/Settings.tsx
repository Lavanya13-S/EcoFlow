import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Globe, Database, Trash2, Save, X, Eye, EyeOff, Smartphone, QrCode, AlertTriangle, Download, FileText, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

interface SettingsProps {
  userProfile: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    location?: string;
    householdSize?: number;
    propertyType?: string;
    monthlyGoal?: number;
    currentStreak?: number;
    totalSaved?: number;
    rank?: number;
  };
  onUpdateProfile: (profile: any) => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [notification, setNotification] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 2FA state
  const [twoFAData, setTwoFAData] = useState({
    enabled: false,
    verificationCode: ''
  });

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const originalProfile = {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    };
    const hasProfileChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(hasProfileChanges);
  }, [profile, userProfile]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    const updatedProfile = { ...userProfile, ...profile };
    onUpdateProfile(updatedProfile);
    saveToLocalStorage('userProfile', updatedProfile);
    setHasChanges(false);
    showNotification('Profile updated successfully!');
  };

  const handleResetChanges = () => {
    setProfile({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    });
    setHasChanges(false);
    showNotification('Changes reverted');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showNotification('Password must be at least 8 characters');
      return;
    }
    if (!passwordData.currentPassword) {
      showNotification('Please enter your current password');
      return;
    }

    // Simulate password change
    showNotification('Password changed successfully!');
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEnable2FA = () => {
    if (twoFAData.verificationCode.length !== 6) {
      showNotification('Please enter a 6-digit verification code');
      return;
    }

    setTwoFAData(prev => ({ ...prev, enabled: !prev.enabled }));
    showNotification(twoFAData.enabled ? '2FA disabled successfully!' : '2FA enabled successfully!');
    setShow2FA(false);
    setTwoFAData(prev => ({ ...prev, verificationCode: '' }));
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      showNotification('Please type "DELETE" to confirm');
      return;
    }

    // Clear all data and logout
    localStorage.clear();
    showNotification('Account deleted successfully');
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  // Helper function to export data as PDF
  const handleExportData = (period: 'daily' | 'weekly' | 'monthly') => {
    const userData = loadFromLocalStorage('userData') || [];
    const userProfileData = loadFromLocalStorage('userProfile') || {};
    
    // Filter data based on period
    const now = new Date();
    let filteredData = [];
    let title = '';
    
    switch (period) {
      case 'daily':
        const today = now.toISOString().split('T')[0];
        filteredData = userData.filter(d => d.date === today);
        title = `Daily Water Usage Report - ${now.toLocaleDateString()}`;
        break;
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = userData.filter(d => new Date(d.date) >= weekAgo);
        title = `Weekly Water Usage Report - ${weekAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`;
        break;
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = userData.filter(d => new Date(d.date) >= monthAgo);
        title = `Monthly Water Usage Report - ${monthAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`;
        break;
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('EcoFlow Water Usage Report', 20, 20);
    
    doc.setFontSize(16);
    doc.text(title, 20, 35);
    
    // User info
    doc.setFontSize(12);
    doc.text(`User: ${userProfileData.name || 'N/A'}`, 20, 50);
    doc.text(`Email: ${userProfileData.email || 'N/A'}`, 20, 60);
    doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 70);
    
    // Summary statistics
    const totalUsage = filteredData.reduce((sum, d) => sum + d.usage, 0);
    const avgUsage = filteredData.length > 0 ? totalUsage / filteredData.length : 0;
    const maxUsage = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.usage)) : 0;
    
    doc.text('Summary:', 20, 85);
    doc.text(`Total Usage: ${totalUsage.toLocaleString()}L`, 30, 95);
    doc.text(`Average Daily: ${Math.round(avgUsage)}L`, 30, 105);
    doc.text(`Peak Usage: ${Math.round(maxUsage)}L`, 30, 115);
    doc.text(`Data Points: ${filteredData.length}`, 30, 125);
    
    // Table data
    if (filteredData.length > 0) {
      const tableData = filteredData.map(d => [
        new Date(d.date).toLocaleDateString(),
        `${d.usage}L`,
        `${d.reading}`,
        d.source
      ]);
      
      autoTable(doc, {
        head: [['Date', 'Usage', 'Reading', 'Source']],
        body: tableData,
        startY: 140,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 }
      });
    } else {
      doc.text('No data available for the selected period.', 20, 140);
    }
    
    // Save the PDF
    doc.save(`water-usage-${period}-${now.toISOString().split('T')[0]}.pdf`);
    
    showNotification(`${period.charAt(0).toUpperCase() + period.slice(1)} report downloaded successfully!`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Globe },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 bg-green-500 text-white">
          <div className="font-semibold">Success!</div>
          <div className="text-sm opacity-90">{notification}</div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences, security settings, and data.
        </p>
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {hasChanges && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-yellow-800 mb-3">
                    <AlertTriangle size={20} />
                    <span className="font-medium">You have unsaved changes</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleResetChanges}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h2>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Password</h3>
                      <p className="text-gray-600 text-sm">Keep your account secure with a strong password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Change Password
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-gray-600 text-sm">
                        Add an extra layer of security to your account
                        {twoFAData.enabled && <span className="text-green-600 font-medium"> (Enabled)</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShow2FA(true)}
                    className={`px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg ${
                      twoFAData.enabled
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    }`}
                  >
                    {twoFAData.enabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Bell },
                  { id: 'push', label: 'Push Notifications', desc: 'Browser notifications', icon: Globe },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Text message notifications', icon: Smartphone },
                  { id: 'usage', label: 'Usage Alerts', desc: 'High usage warnings', icon: AlertTriangle }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="space-y-4">
                {[
                  { id: 'profile', label: 'Profile Visibility', desc: 'Control who can see your profile', icon: User },
                  { id: 'usage', label: 'Usage Data Sharing', desc: 'Share anonymous usage data', icon: Database },
                  { id: 'analytics', label: 'Analytics Tracking', desc: 'Help improve our service', icon: Globe },
                  { id: 'marketing', label: 'Marketing Communications', desc: 'Receive promotional content', icon: Bell }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Export Usage Data</h3>
                      <p className="text-gray-600 text-sm">Download your water usage data in PDF format</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleExportData('daily')}
                      className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Daily Report</span>
                    </button>
                    <button
                      onClick={() => handleExportData('weekly')}
                      className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Weekly Report</span>
                    </button>
                    <button
                      onClick={() => handleExportData('monthly')}
                      className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      <Database className="w-4 h-4" />
                      <span>Monthly Report</span>
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900">Delete Account</h3>
                      <p className="text-red-700 text-sm">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteAccount(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {twoFAData.enabled ? 'Disable' : 'Enable'} Two-Factor Authentication
            </h3>
            
            {!twoFAData.enabled && (
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                  <QrCode className="w-24 h-24 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Scan this QR code with your authenticator app</p>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {twoFAData.enabled ? 'Enter code to disable' : 'Enter verification code'}
              </label>
              <input
                type="text"
                value={twoFAData.verificationCode}
                onChange={(e) => setTwoFAData(prev => ({ ...prev, verificationCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShow2FA(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnable2FA}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  twoFAData.enabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {twoFAData.enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Delete Account</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete your account and all associated data.
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type "DELETE" to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};