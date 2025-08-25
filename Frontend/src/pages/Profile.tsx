import React, { useState, useEffect } from "react";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { ActivityCalendar } from "react-activity-calendar";
import { instance } from "../../lib/axios";
import { Clock, Code, FileText, Calendar, Edit, Settings, Copy, Key, X, Save } from 'lucide-react';

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
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    profilePicture: ""
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
    fetchApiKey();
  }, []);

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
                  <code className="text-white font-mono text-sm break-all">{apiKey || "Loading..."}</code>
                </div>
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
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter email"
                />
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
