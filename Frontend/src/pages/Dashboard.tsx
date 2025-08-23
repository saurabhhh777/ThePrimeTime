import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from '../../lib/axios';
import { Clock, Code, FileText, BarChart3, Calendar, TrendingUp, Zap, Crown, Activity, Target, Award } from 'lucide-react';

interface CodingStats {
  codingStats: any[];
  summary: {
    totalDuration: number;
    totalLinesChanged: number;
    totalCharactersTyped: number;
    totalSessions: number;
    averageSessionDuration: number;
  };
  languageStats: Record<string, any>;
  folderStats: Record<string, any>;
  userSubscription: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<CodingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchSubscription();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await instance.get(`/api/v1/coding-stats/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await instance.get('/api/v1/subscription/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTopLanguages = () => {
    if (!stats?.languageStats) return [];
    return Object.entries(stats.languageStats)
      .sort(([, a], [, b]) => b.duration - a.duration)
      .slice(0, 5);
  };

  const getTopFolders = () => {
    if (!stats?.folderStats) return [];
    return Object.entries(stats.folderStats)
      .sort(([, a], [, b]) => b.duration - a.duration)
      .slice(0, 5);
  };

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'FREE': return 'bg-gradient-to-r from-gray-500 to-gray-600';
      case 'BASIC': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'PRO': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'ENTERPRISE': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading your coding analytics...
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Coding Analytics</h1>
              <p className="text-gray-300 text-lg">Track your productivity and coding patterns</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm"
              >
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="yearly">Last Year</option>
              </select>
              {subscription && (
                <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getSubscriptionColor(subscription.subscriptionType)} backdrop-blur-sm`}>
                  {subscription.subscriptionType}
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Coding Time</p>
                  <p className="text-3xl font-bold text-white">
                    {stats ? formatDuration(stats.summary.totalDuration) : '0h 0m'}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Coding Sessions</p>
                  <p className="text-3xl font-bold text-white">
                    {stats ? stats.summary.totalSessions : 0}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Code className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Lines Changed</p>
                  <p className="text-3xl font-bold text-white">
                    {stats ? stats.summary.totalLinesChanged.toLocaleString() : 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <FileText className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Characters Typed</p>
                  <p className="text-3xl font-bold text-white">
                    {stats ? stats.summary.totalCharactersTyped.toLocaleString() : 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Languages */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Top Programming Languages</h3>
              </div>
              <div className="space-y-4">
                {getTopLanguages().map(([language, data], index) => (
                  <div key={language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                      <span className="font-medium text-white">{language}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatTime(data.duration)}</div>
                      <div className="text-sm text-gray-400">{data.files} files</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Folders */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Most Active Folders</h3>
              </div>
              <div className="space-y-4">
                {getTopFolders().map(([folder, data], index) => (
                  <div key={folder} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                      <span className="font-medium text-white">{folder}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatTime(data.duration)}</div>
                      <div className="text-sm text-gray-400">{data.files} files</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Recent Coding Sessions</h3>
            </div>
            <div className="space-y-3">
              {stats?.codingStats.slice(0, 10).map((session, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <div className="font-medium text-white">{session.fileName}</div>
                      <div className="text-sm text-gray-400">{session.language} • {session.folder}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{formatTime(session.duration)}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Upgrade Banner */}
          {subscription?.subscriptionType === 'FREE' && (
            <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-300">Get access to unlimited data history, custom date ranges, and advanced analytics.</p>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
