import React, { useState, useEffect } from "react";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { ActivityCalendar } from "react-activity-calendar";
import { instance } from "../../lib/axios";
import { Clock, Code, Calendar, Edit, Settings, Copy, Key, X, Save, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProfileData {
  user: {
    username: string;
    email: string;
    profilePicture: string;
  };
  activityCalendar: Array<{ date: string; count: number; level: number }>;
  stats: {
    weeklyHours: number;
    monthlyHours: number;
    totalActivities: number;
  };
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    profilePicture: ""
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Date picker states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchApiKey();
  }, []);

  // Date picker functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}${minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`}${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    
    const suffix = dateNum === 1 || dateNum === 21 || dateNum === 31 ? 'st' :
                  dateNum === 2 || dateNum === 22 ? 'nd' :
                  dateNum === 3 || dateNum === 23 ? 'rd' : 'th';
    
    return `${day}, ${dateNum}${suffix} ${month}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    const newTime = new Date(selectedTime);
    if (type === 'hours') {
      newTime.setHours(value);
    } else {
      newTime.setMinutes(value);
    }
    setSelectedTime(newTime);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("No authentication token found. Please sign in.");
        setLoading(false);
        return;
      }

      const response = await instance.get("/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data.data);
      
      // Initialize edit form with current data
      setEditForm({
        username: response.data.data.user.username,
        email: response.data.data.user.email,
        profilePicture: response.data.data.user.profilePicture
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await instance.get("/api/v1/account/api-key", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setApiKey(response.data.data.apiKey);
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await instance.put("/api/v1/user/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Update local state with new data
        setProfileData(prev => prev ? {
          ...prev,
          user: {
            ...prev.user,
            ...editForm
          }
        } : null);
        setShowEditModal(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original data
    if (profileData) {
      setEditForm({
        username: profileData.user.username,
        email: profileData.user.email,
        profilePicture: profileData.user.profilePicture
      });
    }
    setShowEditModal(false);
  };

  // Mock function to get hours for a specific date
  const getHoursForDate = (date: string) => {
    // This would normally come from your backend
    // For now, returning mock data based on the activity level
    const activity = profileData?.activityCalendar.find(a => a.date === date);
    if (activity) {
      return activity.level * 2; // Mock: level 1 = 2 hours, level 2 = 4 hours, etc.
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error || "Failed to load profile"}</div>
          <button 
            onClick={() => window.location.href = '/signin'} 
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Go to Sign In
          </button>
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
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <img
                    src={profileData.user.profilePicture}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                    alt="Profile Picture"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{profileData.user.username}</h1>
                  <p className="text-gray-300 text-lg mb-4">@{profileData.user.username.toLowerCase().replace(/\s+/g, '')}</p>
                  <p className="text-gray-400">{profileData.user.email}</p>
                </div>
                <button 
                  onClick={handleEditProfile}
                  className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* API Token Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">API Token</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Use this token in your VS Code extension to enable coding tracking.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
                  <code className="text-white font-mono text-sm break-all">
                    {showApiKey ? (apiKey || "Loading...") : "••••••••••••••••••••"}
                  </code>
                </div>
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-1 space-y-6">
                {/* Date & Time Picker */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Date & Time Picker</h3>
                  
                  {/* Time and Date Display */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-4">
                      {/* Analog Clock */}
                      <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="absolute w-1 h-6 bg-black rounded-full transform -translate-y-3" 
                             style={{ 
                               transform: `rotate(${selectedTime.getHours() * 30 + selectedTime.getMinutes() * 0.5}deg) translateY(-3px)` 
                             }}></div>
                        <div className="absolute w-0.5 h-8 bg-blue-500 rounded-full transform -translate-y-4" 
                             style={{ 
                               transform: `rotate(${selectedTime.getMinutes() * 6}deg) translateY(-4px)` 
                             }}></div>
                        <div className="absolute w-1 h-1 bg-black rounded-full"></div>
                        {/* Hour markers */}
                        {[12, 3, 6, 9].map((hour, index) => (
                          <div key={hour} className="absolute w-0.5 h-1 bg-black rounded-full"
                               style={{
                                 transform: `rotate(${hour * 30}deg) translateY(-8px)`
                               }}></div>
                        ))}
                      </div>
                      
                      {/* Time and Date Text */}
                      <div>
                        <div className="text-2xl font-bold text-white">{formatTime(selectedTime)}</div>
                        <div className="text-gray-300">{formatDate(selectedDate)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Date Picker Toggle */}
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    {showDatePicker ? 'Hide Calendar' : 'Show Calendar'}
                  </button>

                  {/* Calendar */}
                  {showDatePicker && (
                    <div className="mt-4 bg-white/5 rounded-xl p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-white">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateMonth('prev')}
                            className="p-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigateMonth('next')}
                            className="p-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Days of Week */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="text-center text-sm text-gray-400 py-1">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => (
                          <button
                            key={index}
                            onClick={() => date && handleDateSelect(date)}
                            disabled={!date}
                            className={`
                              w-8 h-8 rounded-lg text-sm font-medium transition-colors
                              ${!date ? 'invisible' : ''}
                              ${date && isSameDay(date, selectedDate) 
                                ? 'bg-white text-black' 
                                : date && isToday(date)
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'text-white hover:bg-white/10'
                              }
                            `}
                          >
                            {date ? date.getDate() : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Picker */}
                  <div className="mt-4 bg-white/5 rounded-xl p-4">
                    <h4 className="text-lg font-medium text-white mb-3">Time</h4>
                    <div className="flex gap-4">
                      {/* Hours */}
                      <div className="flex-1">
                        <label className="block text-sm text-gray-300 mb-2">Hours</label>
                        <select
                          value={selectedTime.getHours()}
                          onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/50"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i} className="bg-black text-white">
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Minutes */}
                      <div className="flex-1">
                        <label className="block text-sm text-gray-300 mb-2">Minutes</label>
                        <select
                          value={selectedTime.getMinutes()}
                          onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/50"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i} className="bg-black text-white">
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-300">Weekly Hours</span>
                      </div>
                      <span className="text-white font-semibold">{profileData.stats.weeklyHours}h</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-300">Monthly Hours</span>
                      </div>
                      <span className="text-white font-semibold">{profileData.stats.monthlyHours}h</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-300">Total Activities</span>
                      </div>
                      <span className="text-white font-semibold">{profileData.stats.totalActivities}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {profileData.activityCalendar.slice(-5).reverse().map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.level === 4 ? 'bg-white' : 
                            activity.level === 3 ? 'bg-gray-400' : 
                            activity.level === 2 ? 'bg-gray-500' : 'bg-gray-600'
                          }`}></div>
                          <span className="text-gray-300">{activity.date}</span>
                        </div>
                        <span className="text-white font-semibold">{activity.count} activities</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6">Activity Calendar</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <ActivityCalendar 
                      data={profileData.activityCalendar}
                      theme={{
                        light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                      }}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-gray-400 text-sm">
                        Hover over green squares to see coding hours
                      </p>
                    </div>
                  </div>
                  
                  {/* Custom Calendar with Hover Tooltips */}
                  <div className="mt-6 bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Detailed Activity</h4>
                    <div className="grid grid-cols-7 gap-1">
                      {profileData.activityCalendar.map((activity, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded-sm transition-all duration-200 ${
                              activity.level === 4 ? 'bg-green-500' : 
                              activity.level === 3 ? 'bg-green-400' : 
                              activity.level === 2 ? 'bg-green-300' : 
                              activity.level === 1 ? 'bg-green-200' : 'bg-gray-700'
                            }`}
                          />
                          {/* Tooltip */}
                          {activity.level > 0 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {activity.date}: {getHoursForDate(activity.date)} hours
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                  placeholder="Email cannot be changed"
                />
                <p className="text-xs text-gray-500 mt-1">Email address cannot be modified for security reasons</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm(prev => ({ ...prev, profilePicture: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter profile picture URL"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Profile;
