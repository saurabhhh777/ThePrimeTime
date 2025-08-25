import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  Key,
  Mail,
  Smartphone,
  Trash2,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Calendar,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserSettings {
  username: string;
  email: string;
  profilePicture: string;
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showStats: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    username: '',
    email: '',
    profilePicture: '',
    notifications: {
      email: true,
      push: true,
      weekly: false,
      monthly: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showStats: true
    },
    theme: 'dark',
    language: 'en',
    timezone: 'UTC'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to access settings');
        return;
      }

      const response = await instance.get("/api/v1/user/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data;
      setSettings({
        username: userData.username || '',
        email: userData.email || '',
        profilePicture: userData.profilePicture || '',
        theme: userData.theme || 'dark',
        language: userData.language || 'en',
        timezone: userData.timezone || 'UTC',
        notifications: userData.notifications || {
          email: true,
          push: true,
          weekly: false,
          monthly: true
        },
        privacy: userData.privacy || {
          profileVisibility: 'public',
          showEmail: false,
          showStats: true
        }
      });
    } catch (error: any) {
      console.error("Error fetching user settings:", error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await instance.put("/api/v1/user/settings", {
        username: settings.username,
        profilePicture: settings.profilePicture,
        theme: settings.theme,
        language: settings.language,
        timezone: settings.timezone,
        notifications: settings.notifications,
        privacy: settings.privacy
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Settings updated successfully!');
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      setSaving(true);
      const token = localStorage.getItem('token');
      
      await instance.put("/api/v1/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password updated successfully!');
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      await instance.delete("/api/v1/user/account", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      window.location.href = '/signin';
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete account');
      }
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theprimetime-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Settings</h1>
            <p className="text-gray-300 text-lg">Manage your account preferences and security</p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-72 space-y-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'profile' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <User className="h-6 w-6" />
                <div>
                  <div className="font-medium">Profile</div>
                  <div className="text-xs opacity-70">Manage your account details</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'security' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Shield className="h-6 w-6" />
                <div>
                  <div className="font-medium">Security</div>
                  <div className="text-xs opacity-70">Password and account security</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'notifications' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Bell className="h-6 w-6" />
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-xs opacity-70">Email and push notifications</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'privacy' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Key className="h-6 w-6" />
                <div>
                  <div className="font-medium">Privacy</div>
                  <div className="text-xs opacity-70">Control your data visibility</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'appearance' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Palette className="h-6 w-6" />
                <div>
                  <div className="font-medium">Appearance</div>
                  <div className="text-xs opacity-70">Theme and display settings</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
                  activeTab === 'data' 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Download className="h-6 w-6" />
                <div>
                  <div className="font-medium">Data & Export</div>
                  <div className="text-xs opacity-70">Export data and account management</div>
                </div>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
                      <p className="text-gray-300">Update your personal information and account details</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Username
                        </label>
                        <input
                          type="text"
                          value={settings.username}
                          onChange={(e) => setSettings({...settings, username: e.target.value})}
                          className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          placeholder="Enter your username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          disabled
                          className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed opacity-60"
                          placeholder="Email cannot be changed"
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Email address cannot be modified for security reasons
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Profile Picture URL
                        </label>
                        <input
                          type="url"
                          value={settings.profilePicture}
                          onChange={(e) => setSettings({...settings, profilePicture: e.target.value})}
                          className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          placeholder="Enter profile picture URL"
                        />
                        <p className="text-xs text-gray-400 mt-2">Provide a direct link to your profile image</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Security Settings</h2>
                      <p className="text-gray-300">Manage your password and account security</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200 pr-12"
                            placeholder="Enter your current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          placeholder="Enter your new password"
                        />
                        <p className="text-xs text-gray-400 mt-2">Password must be at least 6 characters long</p>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          placeholder="Confirm your new password"
                        />
                      </div>
                      
                      <button
                        onClick={updatePassword}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {saving ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Notification Preferences</h2>
                      <p className="text-gray-300">Choose how and when you want to be notified</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Mail className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Email Notifications</h3>
                            <p className="text-gray-400">Receive important updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, email: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-500/20 rounded-lg">
                            <Bell className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Push Notifications</h3>
                            <p className="text-gray-400">Get instant notifications in your browser</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, push: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Calendar className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Weekly Reports</h3>
                            <p className="text-gray-400">Receive weekly coding activity summaries</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.weekly}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, weekly: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-orange-500/20 rounded-lg">
                            <Calendar className="h-6 w-6 text-orange-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Monthly Reports</h3>
                            <p className="text-gray-400">Get comprehensive monthly activity reports</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.monthly}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, monthly: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Privacy Settings</h2>
                      <p className="text-gray-300">Control who can see your information and activity</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-3">
                          Profile Visibility
                        </label>
                        <div className="relative">
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => setSettings({
                              ...settings, 
                              privacy: {...settings.privacy, profileVisibility: e.target.value as 'public' | 'private'}
                            })}
                            className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 1rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '3rem'
                            }}
                          >
                            <option value="public" className="bg-black text-white">Public - Anyone can see your profile</option>
                            <option value="private" className="bg-black text-white">Private - Only you can see your profile</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-500/20 rounded-lg">
                            <Mail className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Show Email Address</h3>
                            <p className="text-gray-400">Allow others to see your email address</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showEmail}
                            onChange={(e) => setSettings({
                              ...settings, 
                              privacy: {...settings.privacy, showEmail: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Show Coding Statistics</h3>
                            <p className="text-gray-400">Allow others to see your coding activity and stats</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showStats}
                            onChange={(e) => setSettings({
                              ...settings, 
                              privacy: {...settings.privacy, showStats: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Appearance Settings</h2>
                      <p className="text-gray-300">Customize how ThePrimeTime looks and feels</p>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-4">
                          Theme Selection
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <button
                            onClick={() => setSettings({...settings, theme: 'light'})}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                              settings.theme === 'light' 
                                ? 'border-white bg-white text-black shadow-lg' 
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                            }`}
                          >
                            <Sun className="h-8 w-8 mx-auto mb-3" />
                            <div className="font-semibold">Light</div>
                            <div className="text-xs opacity-70 mt-1">Clean and bright</div>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, theme: 'dark'})}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                              settings.theme === 'dark' 
                                ? 'border-white bg-white text-black shadow-lg' 
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                            }`}
                          >
                            <Moon className="h-8 w-8 mx-auto mb-3" />
                            <div className="font-semibold">Dark</div>
                            <div className="text-xs opacity-70 mt-1">Easy on the eyes</div>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, theme: 'system'})}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                              settings.theme === 'system' 
                                ? 'border-white bg-white text-black shadow-lg' 
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                            }`}
                          >
                            <Monitor className="h-8 w-8 mx-auto mb-3" />
                            <div className="font-semibold">System</div>
                            <div className="text-xs opacity-70 mt-1">Follows your OS</div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white text-sm font-semibold mb-3">
                            Language
                          </label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          >
                            <option value="en" className="bg-black text-white">English</option>
                            <option value="es" className="bg-black text-white">Español</option>
                            <option value="fr" className="bg-black text-white">Français</option>
                            <option value="de" className="bg-black text-white">Deutsch</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-semibold mb-3">
                            Timezone
                          </label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                            className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                          >
                            <option value="UTC" className="bg-black text-white">UTC (Coordinated Universal Time)</option>
                            <option value="EST" className="bg-black text-white">EST (Eastern Standard Time)</option>
                            <option value="PST" className="bg-black text-white">PST (Pacific Standard Time)</option>
                            <option value="GMT" className="bg-black text-white">GMT (Greenwich Mean Time)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Export Settings */}
                {activeTab === 'data' && (
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Data & Export</h2>
                      <p className="text-gray-300">Manage your data and account settings</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-green-500/20 rounded-lg">
                            <Download className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">Export Settings</h3>
                            <p className="text-gray-400">Download your settings and preferences as a JSON file</p>
                          </div>
                        </div>
                        <button
                          onClick={exportData}
                          className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
                        >
                          <Download className="h-4 w-4" />
                          Export Settings
                        </button>
                      </div>
                      
                      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-red-500/20 rounded-lg">
                            <Trash2 className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-red-400 font-semibold text-lg">Danger Zone</h3>
                            <p className="text-gray-400">Permanently delete your account and all associated data</p>
                          </div>
                        </div>
                        <button
                          onClick={deleteAccount}
                          disabled={saving}
                          className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          {saving ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {activeTab !== 'security' && activeTab !== 'data' && (
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <button
                      onClick={updateSettings}
                      disabled={saving}
                      className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;