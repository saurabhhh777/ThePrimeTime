import React, { useState, useEffect } from "react";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { ActivityCalendar } from "react-activity-calendar";
import { instance } from "../../lib/axios";
import { Clock, Code, FileText, Calendar, Edit, Settings } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
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
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error || "Failed to load profile"}</div>
          <button 
            onClick={() => window.location.href = '/signin'} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                    <Edit className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{profileData.user.username}</h1>
                  <p className="text-gray-300 text-lg mb-4">@{profileData.user.username.toLowerCase().replace(/\s+/g, '')}</p>
                  <p className="text-gray-400">{profileData.user.email}</p>
                </div>
                <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Edit Profile
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
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-gray-300">Weekly Hours</span>
                      </div>
                      <span className="text-white font-semibold">{profileData.stats.weeklyHours}h</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-400" />
                        </div>
                        <span className="text-gray-300">Monthly Hours</span>
                      </div>
                      <span className="text-white font-semibold">{profileData.stats.monthlyHours}h</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Code className="h-5 w-5 text-purple-400" />
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
                            activity.level === 4 ? 'bg-green-400' : 
                            activity.level === 3 ? 'bg-blue-400' : 
                            activity.level === 2 ? 'bg-yellow-400' : 'bg-gray-400'
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
    </div>
  );
};

export default Profile;
