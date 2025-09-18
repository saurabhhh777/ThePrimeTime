import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";

const Profile = () => {
  const { username } = useParams();
  const location = useLocation();
  const [testState, setTestState] = useState('initial');

  console.log('=== PROFILE COMPONENT DEBUG ===');
  console.log('Component rendered');
  console.log('Username:', username);
  console.log('Location:', location);
  console.log('Test state:', testState);

  useEffect(() => {
    console.log('useEffect triggered');
    setTestState('useEffect completed');
  }, []);

  // Simple working profile page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Hero Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-3">@{username || 'username'}</h1>
                  <p className="text-gray-300 text-xl leading-relaxed max-w-2xl">
                    Passionate developer and coding enthusiast. Love building amazing software and contributing to open source projects.
                  </p>
                </div>
                
                {/* Profile Details */}
                <div className="flex flex-wrap gap-6 text-gray-300">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                    <div className="w-5 h-5 bg-blue-400 rounded-full"></div>
                    <span className="font-medium">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                    <div className="w-5 h-5 bg-purple-400 rounded-full"></div>
                    <span className="font-medium">Joined January 2024</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                    <div className="w-5 h-5 bg-green-400 rounded-full"></div>
                    <span className="font-medium">Available for hire</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-col gap-4">
                <div className="text-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
                  <div className="text-3xl font-bold text-white mb-2">1,247.5h</div>
                  <div className="text-blue-300 text-sm font-medium">Total Coding</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                  <div className="text-3xl font-bold text-white mb-2">12</div>
                  <div className="text-orange-300 text-sm font-medium">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-blue-400 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">This Week</h3>
                  <p className="text-gray-400 text-sm">Coding Hours</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">42.3h</div>
              <div className="text-green-400 text-sm">+12% from last week</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-green-400 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Sessions</h3>
                  <p className="text-gray-400 text-sm">Total Count</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">834</div>
              <div className="text-blue-400 text-sm">Avg 89.2m/session</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-purple-400 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Projects</h3>
                  <p className="text-gray-400 text-sm">Active Count</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">23</div>
              <div className="text-purple-400 text-sm">8 languages used</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-orange-400 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Streak</h3>
                  <p className="text-gray-400 text-sm">Current Days</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">12</div>
              <div className="text-orange-400 text-sm">Best: 45 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Languages */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-green-400 rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">Top Languages</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">TypeScript</span>
                    <span className="text-gray-300 font-medium">456.2h (36.6%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500" style={{ width: '36.6%' }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">JavaScript</span>
                    <span className="text-gray-300 font-medium">298.7h (23.9%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500" style={{ width: '23.9%' }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">Python</span>
                    <span className="text-gray-300 font-medium">187.3h (15.0%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500" style={{ width: '15.0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Projects */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-purple-400 rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">Top Projects</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">ThePrimeTime</div>
                      <div className="text-gray-400 text-sm">Last active: Today</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">234.5h</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Portfolio Website</div>
                      <div className="text-gray-400 text-sm">Last active: Yesterday</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">156.7h</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">E-commerce App</div>
                      <div className="text-gray-400 text-sm">Last active: 2 days ago</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">123.4h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-blue-400 rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Today</div>
                      <div className="text-gray-400 text-sm">3 sessions • TypeScript, React</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">8.5h</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Yesterday</div>
                      <div className="text-gray-400 text-sm">2 sessions • Python, JavaScript</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">6.2h</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">2 days ago</div>
                      <div className="text-gray-400 text-sm">2 sessions • TypeScript</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">4.8h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <div className="w-7 h-7 bg-yellow-400 rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">Achievements</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">⚔️</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Code Warrior</div>
                      <div className="text-gray-400 text-sm mb-2">Coded for 100+ hours</div>
                      <div className="text-yellow-400 text-sm font-medium">Today</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🎯</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Language Master</div>
                      <div className="text-gray-400 text-sm mb-2">Used 5+ programming languages</div>
                      <div className="text-yellow-400 text-sm font-medium">Yesterday</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🦉</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-1">Night Owl</div>
                      <div className="text-gray-400 text-sm mb-2">Coded after midnight 10 times</div>
                      <div className="text-yellow-400 text-sm font-medium">2 days ago</div>
                    </div>
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
