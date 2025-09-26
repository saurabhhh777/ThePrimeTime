import { useState, useEffect } from "react";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { 
  Clock, 
  Code, 
  FileText, 
  BarChart3, 
  Activity, 
  Target, 
  Award,
  TrendingUp,
  Zap,




  ChevronDown,
  Play,


} from "lucide-react";
import { io, Socket } from "socket.io-client";

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
  const [period, setPeriod] = useState("30days");
  const [subscription, setSubscription] = useState<any>(null);
  const [, setSocket] = useState<Socket | null>(null);
  const [, setRealTimeUpdates] = useState<any[]>([]);
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

  const initializeWebSocket = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
        auth: { token }
      });

      socket.on("connect", () => {
        console.log("🔌 Frontend WebSocket connected");
      });

      socket.on("codingUpdate", (data) => {
        console.log("📊 Received coding update:", data);
        setRealTimeUpdates(prev => [data, ...prev.slice(0, 9)]);
        
        setLiveStats(prev => ({
          ...prev,
          totalDuration: prev.totalDuration + (data.duration || 0),
          totalLinesChanged: prev.totalLinesChanged + (data.linesChanged || 0),
          totalCharactersTyped: prev.totalCharactersTyped + (data.charactersTyped || 0),
          totalSessions: data.isActive ? prev.totalSessions : prev.totalSessions + 1,
          currentSession: data.isActive ? data : null
        }));
      });

      socket.on("disconnect", () => {
        console.log("🔌 Frontend WebSocket disconnected");
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error("❌ Failed to initialize WebSocket:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found for stats fetch");
        return;
      }

      const statsResponse = await instance.get(`/api/v1/coding-stats/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(statsResponse.data.data);

      try {
        const dashboardResponse = await instance.get("/api/v1/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(dashboardResponse.data.data);
      } catch (dashboardError) {
        console.log("Dashboard API not available, using coding stats only");
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found for subscription fetch");
        return;
      }

      const response = await instance.get("/api/v1/subscription/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubscription(response.data.data);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
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
      case "FREE": return "bg-gray-600 text-white";
      case "BASIC": return "bg-blue-600 text-white";
      case "PRO": return "bg-black text-white";
      case "ENTERPRISE": return "bg-gray-800 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center font-[Inter]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Loading your coding analytics...</div>
          <div className="text-gray-400 text-sm mt-2">This may take a moment</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black font-[Inter]">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-8">
          {/* Clean Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Coding Analytics</h1>
              <p className="text-gray-300 text-lg font-light">Track your productivity and coding patterns</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Enhanced Period Selector */}
              <div className="relative">
                <select 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 pr-10 text-white font-medium hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="30days" className="bg-slate-800 text-white">Last 30 Days</option>
                  <option value="3months" className="bg-slate-800 text-white">Last 3 Months</option>
                  <option value="yearly" className="bg-slate-800 text-white">Last Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
              </div>
              
              {subscription && (
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getSubscriptionColor(subscription.subscriptionType)} backdrop-blur-sm border border-white/20`}>
                  {subscription.subscriptionType}
                </div>
              )}
            </div>
          </div>

          {/* Live Session Indicator */}
          {liveStats.currentSession && (
            <div className="mb-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">Live Coding Session</span>
                </div>
                <div className="flex-1 h-px bg-green-500/30"></div>
                <div className="text-green-300 text-sm">
                  {formatDuration(liveStats.currentSession.duration)}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-gray-300 text-sm mb-1">Current File</div>
                  <div className="text-white font-semibold truncate">{liveStats.currentSession.fileName}</div>
                  <div className="text-gray-400 text-xs">{liveStats.currentSession.language}</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-gray-300 text-sm mb-1">Activity</div>
                  <div className="text-white font-semibold">{liveStats.currentSession.linesChanged} lines</div>
                  <div className="text-gray-400 text-xs">{liveStats.currentSession.charactersTyped} characters</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-gray-300 text-sm mb-1">Session Time</div>
                  <div className="text-green-400 font-semibold">{formatDuration(liveStats.currentSession.duration)}</div>
                  <div className="text-gray-400 text-xs">Active now</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-all duration-300">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {liveStats.totalDuration > 0 ? formatDuration(liveStats.totalDuration) :
                     stats ? formatDuration(stats.summary.totalDuration) : 
                     dashboardData ? formatDuration(dashboardData.ide_stats.totalTime) : "0h 0m"}
                  </div>
                  <div className="text-blue-300 text-sm font-medium">Total Coding</div>
                </div>
              </div>
              {liveStats.currentSession && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live: {formatDuration(liveStats.currentSession.duration)}</span>
                </div>
              )}
            </div>

            <div className="group relative bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-green-500/20 rounded-2xl group-hover:bg-green-500/30 transition-all duration-300">
                  <Code className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {liveStats.totalSessions > 0 ? liveStats.totalSessions :
                     stats ? stats.summary.totalSessions : 
                     dashboardData ? dashboardData.ide_stats.sessions : 0}
                  </div>
                  <div className="text-green-300 text-sm font-medium">Sessions</div>
                </div>
              </div>
              {liveStats.currentSession && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Play className="w-4 h-4" />
                  <span>Active Session</span>
                </div>
              )}
            </div>

            <div className="group relative bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:bg-purple-500/30 transition-all duration-300">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {liveStats.totalLinesChanged > 0 ? liveStats.totalLinesChanged.toLocaleString() :
                     stats ? stats.summary.totalLinesChanged.toLocaleString() : 0}
                  </div>
                  <div className="text-purple-300 text-sm font-medium">Lines Changed</div>
                </div>
              </div>
              {liveStats.currentSession && liveStats.currentSession.linesChanged > 0 && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{liveStats.currentSession.linesChanged} today</span>
                </div>
              )}
            </div>

            <div className="group relative bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-orange-500/20 rounded-2xl group-hover:bg-orange-500/30 transition-all duration-300">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {liveStats.totalCharactersTyped > 0 ? liveStats.totalCharactersTyped.toLocaleString() :
                     stats ? stats.summary.totalCharactersTyped.toLocaleString() : 0}
                  </div>
                  <div className="text-orange-300 text-sm font-medium">Characters</div>
                </div>
              </div>
              {liveStats.currentSession && liveStats.currentSession.charactersTyped > 0 && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Zap className="w-4 h-4" />
                  <span>+{liveStats.currentSession.charactersTyped} today</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Top Languages */}
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Top Languages</h3>
              </div>
              <div className="space-y-4">
                {getTopLanguages().map(([language, data], index) => (
                  <div key={language} className="group bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-300" : index === 2 ? "bg-orange-400" : "bg-gray-500"}`}></div>
                        <div>
                          <div className="font-bold text-white text-lg">{language}</div>
                          <div className="text-gray-400 text-sm">{data.files} files</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white text-lg">{formatTime(data.duration)}</div>
                        <div className="text-gray-400 text-sm">
                          {Math.round((data.duration / (stats?.summary.totalDuration || 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500" 
                        style={{ width: `${Math.round((data.duration / (stats?.summary.totalDuration || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Folders */}
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500/20 rounded-2xl">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Active Folders</h3>
              </div>
              <div className="space-y-4">
                {getTopFolders().map(([folder, data], index) => (
                  <div key={folder} className="group bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${index === 0 ? "bg-green-400" : index === 1 ? "bg-blue-400" : index === 2 ? "bg-purple-400" : "bg-gray-500"}`}></div>
                        <div>
                          <div className="font-bold text-white text-lg truncate">{folder}</div>
                          <div className="text-gray-400 text-sm">{data.files} files</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white text-lg">{formatTime(data.duration)}</div>
                        <div className="text-gray-400 text-sm">
                          {Math.round((data.duration / (stats?.summary.totalDuration || 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500" 
                        style={{ width: `${Math.round((data.duration / (stats?.summary.totalDuration || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-yellow-500/20 rounded-2xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Recent Sessions</h3>
            </div>
            <div className="space-y-3">
              {stats?.codingStats.slice(0, 8).map((session, index) => (
                <div key={index} className="group bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div>
                        <div className="font-bold text-white text-lg">{session.fileName}</div>
                        <div className="text-gray-400 text-sm">{session.language} • {session.folder}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-lg">{formatTime(session.duration)}</div>
                      <div className="text-gray-400 text-sm">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Upgrade Banner */}
          {subscription?.subscriptionType === "FREE" && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-300 text-lg">Get access to unlimited data history, custom date ranges, and advanced analytics.</p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
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
