import { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from '../../lib/axios';
import { Clock, Code, FileText, BarChart3, Activity, Target, Award } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

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

interface DashboardData {
  ide_stats: {
    totalTime: number;
    sessions: number;
    projects: any[];
  };
  git_stats: {
    commits: number;
    repositories: any[];
    contributions: any[];
  };
  lastUpdated: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<CodingStats | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [subscription, setSubscription] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalDuration: 0,
    totalLinesChanged: 0,
    totalCharactersTyped: 0,
    totalSessions: 0,
    currentSession: null as any
  });

  useEffect(() => {
    fetchStats();
    fetchSubscription();
    initializeWebSocket();
  }, [period]);

  // Process real-time updates to calculate live stats
  useEffect(() => {
    if (realTimeUpdates.length > 0) {
      const latestUpdate = realTimeUpdates[realTimeUpdates.length - 1];
      
      setLiveStats(prev => ({
        totalDuration: latestUpdate.duration || prev.totalDuration,
        totalLinesChanged: latestUpdate.linesChanged || prev.totalLinesChanged,
        totalCharactersTyped: latestUpdate.charactersTyped || prev.totalCharactersTyped,
        totalSessions: prev.totalSessions + (latestUpdate.isActive ? 0 : 1),
        currentSession: latestUpdate.isActive ? latestUpdate : null
      }));
    }
  }, [realTimeUpdates]);

  const initializeWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const socket = io('http://localhost:7000', {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('🔌 Frontend WebSocket connected');
      });

      socket.on('coding_update', (data: any) => {
        console.log('📊 Real-time coding update received:', data);
        setRealTimeUpdates(prev => [...prev, data]);
        
        // Refresh stats when new data arrives
        fetchStats();
      });

      socket.on('session_update', (data: any) => {
        console.log('🔄 Real-time session update received:', data);
        setRealTimeUpdates(prev => [...prev, data]);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Frontend WebSocket disconnected');
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found for stats fetch');
        return;
      }

      console.log('Fetching stats with token:', token.substring(0, 20) + '...');
      
      // Fetch coding stats
      const statsResponse = await instance.get(`/api/v1/coding-stats/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Stats response:', statsResponse.data);
      setStats(statsResponse.data.data);

      // Fetch dashboard data
      try {
        const dashboardResponse = await instance.get('/api/v1/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Dashboard response:', dashboardResponse.data);
        setDashboardData(dashboardResponse.data.data);
      } catch (dashboardError) {
        console.log('Dashboard API not available, using coding stats only');
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found for subscription fetch');
        return;
      }

      const response = await instance.get('/api/v1/subscription/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Subscription response:', response.data);
      setSubscription(response.data.data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      if (error.response) {
        console.error('Subscription response data:', error.response.data);
        console.error('Subscription response status:', error.response.status);
      }
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
      case 'FREE': return 'bg-gray-600 text-white';
      case 'BASIC': return 'bg-blue-600 text-white';
      case 'PRO': return 'bg-black text-white';
      case 'ENTERPRISE': return 'bg-gray-800 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading your coding analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
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
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white text-white backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="30days" className="bg-black text-white">Last 30 Days</option>
                <option value="3months" className="bg-black text-white">Last 3 Months</option>
                <option value="yearly" className="bg-black text-white">Last Year</option>
              </select>
              {subscription && (
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getSubscriptionColor(subscription.subscriptionType)} backdrop-blur-sm`}>
                  {subscription.subscriptionType}
                </div>
              )}
            </div>
          </div>

          {/* Debug Section - Temporary */}
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <h3 className="text-white font-bold mb-2">Debug Info:</h3>
            <div className="text-white text-sm space-y-1">
              <div>Stats Data: {stats ? '✅ Loaded' : '❌ Not loaded'}</div>
              <div>Dashboard Data: {dashboardData ? '✅ Loaded' : '❌ Not loaded'}</div>
              <div>Stats Summary: {stats?.summary ? JSON.stringify(stats.summary) : 'No summary'}</div>
              <div>Dashboard IDE Stats: {dashboardData?.ide_stats ? JSON.stringify(dashboardData.ide_stats) : 'No IDE stats'}</div>
            </div>
          </div>

          {/* Real-time Updates Section */}
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <h3 className="text-white font-bold mb-2">Real-time Connection Status:</h3>
            <div className="text-white text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${socket ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>WebSocket: {socket ? '✅ Connected' : '❌ Disconnected'}</span>
              </div>
              <div>Updates Received: <span className="font-semibold text-green-400">{realTimeUpdates.length}</span></div>
              {realTimeUpdates.length > 0 && (
                <div className="mt-3">
                  <div className="font-semibold mb-2">Latest Activity:</div>
                  <div className="bg-black/30 p-3 rounded text-xs space-y-1">
                    <div><span className="text-gray-400">File:</span> <span className="text-white">{realTimeUpdates[realTimeUpdates.length - 1].fileName}</span></div>
                    <div><span className="text-gray-400">Language:</span> <span className="text-white">{realTimeUpdates[realTimeUpdates.length - 1].language}</span></div>
                    <div><span className="text-gray-400">Duration:</span> <span className="text-green-400">{formatDuration(realTimeUpdates[realTimeUpdates.length - 1].duration)}</span></div>
                    <div><span className="text-gray-400">Lines Changed:</span> <span className="text-white">{realTimeUpdates[realTimeUpdates.length - 1].linesChanged}</span></div>
                    <div><span className="text-gray-400">Characters:</span> <span className="text-white">{realTimeUpdates[realTimeUpdates.length - 1].charactersTyped}</span></div>
                    <div><span className="text-gray-400">Status:</span> <span className={`${realTimeUpdates[realTimeUpdates.length - 1].isActive ? 'text-green-400' : 'text-yellow-400'}`}>
                      {realTimeUpdates[realTimeUpdates.length - 1].isActive ? '🟢 Active' : '🟡 Session Ended'}
                    </span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Session Display */}
          {liveStats.currentSession && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h3 className="text-white font-bold mb-2">🟢 Live Coding Session:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                <div className="bg-black/30 p-3 rounded">
                  <div className="text-sm text-gray-300">Current File</div>
                  <div className="font-semibold">{liveStats.currentSession.fileName}</div>
                  <div className="text-xs text-gray-400">{liveStats.currentSession.language}</div>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <div className="text-sm text-gray-300">Session Duration</div>
                  <div className="font-semibold text-green-400">{formatDuration(liveStats.currentSession.duration)}</div>
                  <div className="text-xs text-gray-400">Active Now</div>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <div className="text-sm text-gray-300">Activity</div>
                  <div className="font-semibold">{liveStats.currentSession.linesChanged} lines, {liveStats.currentSession.charactersTyped} chars</div>
                  <div className="text-xs text-gray-400">This session</div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Coding Time</p>
                  <p className="text-3xl font-bold text-white">
                    {liveStats.totalDuration > 0 ? formatDuration(liveStats.totalDuration) :
                     stats ? formatDuration(stats.summary.totalDuration) : 
                     dashboardData ? formatDuration(dashboardData.ide_stats.totalTime) : '0h 0m'}
                  </p>
                  {liveStats.currentSession && (
                    <p className="text-xs text-green-400 mt-1">🟢 Live: {formatDuration(liveStats.currentSession.duration)}</p>
                  )}
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Coding Sessions</p>
                  <p className="text-3xl font-bold text-white">
                    {liveStats.totalSessions > 0 ? liveStats.totalSessions :
                     stats ? stats.summary.totalSessions : 
                     dashboardData ? dashboardData.ide_stats.sessions : 0}
                  </p>
                  {liveStats.currentSession && (
                    <p className="text-xs text-green-400 mt-1">🟢 Active Session</p>
                  )}
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Code className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Lines Changed</p>
                  <p className="text-3xl font-bold text-white">
                    {liveStats.totalLinesChanged > 0 ? liveStats.totalLinesChanged.toLocaleString() :
                     stats ? stats.summary.totalLinesChanged.toLocaleString() : 0}
                  </p>
                  {liveStats.currentSession && liveStats.currentSession.linesChanged > 0 && (
                    <p className="text-xs text-green-400 mt-1">🟢 +{liveStats.currentSession.linesChanged}</p>
                  )}
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Characters Typed</p>
                  <p className="text-3xl font-bold text-white">
                    {liveStats.totalCharactersTyped > 0 ? liveStats.totalCharactersTyped.toLocaleString() :
                     stats ? stats.summary.totalCharactersTyped.toLocaleString() : 0}
                  </p>
                  {liveStats.currentSession && liveStats.currentSession.charactersTyped > 0 && (
                    <p className="text-xs text-green-400 mt-1">🟢 +{liveStats.currentSession.charactersTyped}</p>
                  )}
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Languages */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Top Programming Languages</h3>
              </div>
              <div className="space-y-4">
                {getTopLanguages().map(([language, data], index) => (
                  <div key={language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-gray-500' : 'bg-gray-600'}`}></div>
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
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Most Active Folders</h3>
              </div>
              <div className="space-y-4">
                {getTopFolders().map(([folder, data], index) => (
                  <div key={folder} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-gray-500' : 'bg-gray-600'}`}></div>
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
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Recent Coding Sessions</h3>
            </div>
            <div className="space-y-3">
              {stats?.codingStats.slice(0, 10).map((session, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
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
            <div className="mt-6 bg-gradient-to-r from-white/10 to-gray-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-300">Get access to unlimited data history, custom date ranges, and advanced analytics.</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
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
