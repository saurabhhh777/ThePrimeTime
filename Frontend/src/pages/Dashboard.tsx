import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import axios from 'axios';
import { Clock, Code, FileText, BarChart3, Calendar, TrendingUp, Zap, Crown } from 'lucide-react';

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
      const response = await axios.get(`/api/v1/coding-stats/stats?period=${period}`, {
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
      const response = await axios.get('/api/v1/subscription/user', {
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
      case 'FREE': return 'bg-gray-500';
      case 'BASIC': return 'bg-blue-500';
      case 'PRO': return 'bg-purple-500';
      case 'ENTERPRISE': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading your coding analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coding Analytics</h1>
              <p className="text-gray-600">Track your productivity and coding patterns</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="yearly">Last Year</option>
              </select>
              {subscription && (
                <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getSubscriptionColor(subscription.subscriptionType)}`}>
                  {subscription.subscriptionType}
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Coding Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? formatDuration(stats.summary.totalDuration) : '0h 0m'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coding Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? stats.summary.totalSessions : 0}
                  </p>
                </div>
                <Code className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lines Changed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? stats.summary.totalLinesChanged.toLocaleString() : 0}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Characters Typed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? stats.summary.totalCharactersTyped.toLocaleString() : 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Languages */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Programming Languages</h3>
              <div className="space-y-4">
                {getTopLanguages().map(([language, data]) => (
                  <div key={language} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-700">{language}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatTime(data.duration)}</div>
                      <div className="text-sm text-gray-500">{data.files} files</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Folders */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Folders</h3>
              <div className="space-y-4">
                {getTopFolders().map(([folder, data]) => (
                  <div key={folder} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-700">{folder}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatTime(data.duration)}</div>
                      <div className="text-sm text-gray-500">{data.files} files</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Coding Sessions</h3>
            <div className="space-y-3">
              {stats?.codingStats.slice(0, 10).map((session, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{session.fileName}</div>
                      <div className="text-sm text-gray-500">{session.language} • {session.folder}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatTime(session.duration)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Upgrade Banner */}
          {subscription?.subscriptionType === 'FREE' && (
            <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                  <p className="text-blue-100">Get access to unlimited data history, custom date ranges, and advanced analytics.</p>
                </div>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
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
