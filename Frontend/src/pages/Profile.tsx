import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { ActivityCalendar } from "react-activity-calendar";
import { instance } from "../../lib/axios";
import { Clock, Code, Calendar, Edit, Settings, Copy, Key, X, Save, Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

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
  const { username } = useParams();
  const navigate = useNavigate();
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
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Date picker states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    checkCurrentUser();
    if (username) {
      fetchProfileByUsername(username);
    } else {
      fetchOwnProfile();
    }
  }, [username]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const fetchOwnProfile = async () => {
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
      setIsOwnProfile(true);
      
      // Initialize edit form with current data
      setEditForm({
        username: response.data.data.user.username,
        email: response.data.data.user.email,
        profilePicture: response.data.data.user.profilePicture
      });

      // Fetch API key for own profile
      fetchApiKey();
    } catch (error) {
      console.error("Error fetching own profile data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileByUsername = async (targetUsername: string) => {
    try {
      setLoading(true);
      console.log('Fetching profile for username:', targetUsername);
      
      const token = localStorage.getItem('token');
      
      // Check if this is the current user's profile
      if (currentUser && currentUser.username === targetUsername) {
        console.log('This is the current user\'s profile, fetching own profile');
        setIsOwnProfile(true);
        fetchOwnProfile();
        return;
      }

      console.log('Fetching other user\'s profile from API');
      
      // Fetch other user's profile
      const response = await instance.get(`/api/v1/user/profile/${targetUsername}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      console.log('Profile API response:', response.data);
      
      if (response.data.success) {
        setProfileData(response.data.data);
        setIsOwnProfile(false);
      } else {
        setError(response.data.message || "Failed to load profile");
      }
    } catch (error: any) {
      console.error("Error fetching profile by username:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 404) {
        setError("User not found. The profile you're looking for doesn't exist.");
      } else if (error.response?.status === 401) {
        setError("Authentication required to view this profile.");
      } else {
        setError("Failed to load profile. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

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
      
      const response = await instance.put("/api/v1/user/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setShowEditModal(false);
        // Refresh profile data
        fetchOwnProfile();
        // Update URL if username changed
        if (editForm.username !== profileData?.user.username) {
          navigate(`/@${editForm.username}`);
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleGoToOwnProfile = () => {
    if (currentUser) {
      navigate(`/@${currentUser.username}`);
    } else {
      navigate('/profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <div className="flex">
          <Vnavbar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <div className="flex">
          <Vnavbar />
          <div className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Failed to load profile data</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={handleGoToOwnProfile}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <div className="flex">
          <Vnavbar />
          <div className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
              <button
                onClick={handleGoToOwnProfile}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <div className="flex">
        <Vnavbar />
        <div className="flex-1 p-8">
          <Hnavbar />
          
          {/* Back Button for Other User's Profile */}
          {!isOwnProfile && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-gray-300 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <img
                    src={profileData.user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
                  />
                  <h2 className="text-2xl font-bold text-white mb-2">{profileData.user.username}</h2>
                  <p className="text-gray-400">{profileData.user.email}</p>
                  
                  {/* Edit Button - Only show for own profile */}
                  {isOwnProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* API Key Section - Only show for own profile */}
                {isOwnProfile && apiKey && (
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">API Key</h3>
                    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Activity Calendar</h3>
                <ActivityCalendar
                  data={profileData.activityCalendar}
                  theme={{
                    light: ['#1a1a1a', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    dark: ['#1a1a1a', '#0e4429', '#006d32', '#26a641', '#39d353'],
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Weekly Hours</h3>
              </div>
              <p className="text-3xl font-bold text-white">{profileData.stats.weeklyHours}h</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Monthly Hours</h3>
              </div>
              <p className="text-3xl font-bold text-white">{profileData.stats.monthlyHours}h</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Activities</h3>
              </div>
              <p className="text-3xl font-bold text-white">{profileData.stats.totalActivities}</p>
            </div>
          </div>

          {/* Current Time Display - Only show for own profile */}
          {isOwnProfile && (
            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Current Time</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-300 mb-2">Hours</label>
                    <div className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center">
                      {selectedTime.getHours().toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-300 mb-2">Minutes</label>
                    <div className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center">
                      {selectedTime.getMinutes().toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white text-lg">{formatDate(selectedTime)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal - Only for own profile */}
      {isOwnProfile && showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({...editForm, profilePicture: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
