import { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { io, Socket } from 'socket.io-client';
import { 
  Folder, 
  Clock, 
  Code, 
  FileText, 
  BarChart3, 
  Edit,
  Trash2,
  Eye,
  Activity,
  Zap,
  
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalDuration: number;
    totalLinesChanged: number;
    totalCharactersTyped: number;
    sessions: number;
    lastActivity: string | null;
  };
}

interface CodingStats {
  totalDuration: number;
  totalLinesChanged: number;
  totalCharactersTyped: number;
  totalSessions: number;
  averageSessionDuration: number;
  languageStats: Record<string, any>;
  folderStats: Record<string, any>;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [codingStats, setCodingStats] = useState<CodingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalDuration: 0,
    totalLinesChanged: 0,
    totalCharactersTyped: 0,
    totalSessions: 0,
    currentSession: null as any
  });

  const [timeFormat, setTimeFormat] = useState<'detailed' | 'simple' | 'hours'>('detailed');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');

  useEffect(() => {
    fetchProjects();
    fetchCodingStats();
    initializeWebSocket();
  }, []);

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
        console.log('🔌 Projects WebSocket connected');
      });

      socket.on('coding_update', (data: any) => {
        console.log('📊 Projects received coding update:', data);
        setRealTimeUpdates(prev => [...prev, data]);
        
        // Refresh stats when new data arrives
        fetchCodingStats();
      });

      socket.on('session_update', (data: any) => {
        console.log('🔄 Projects received session update:', data);
        setRealTimeUpdates(prev => [...prev, data]);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Projects WebSocket disconnected');
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error('❌ Failed to initialize Projects WebSocket:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please sign in to view projects");
        setLoading(false);
        return;
      }

      const response = await instance.get("/api/v1/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchCodingStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await instance.get("/api/v1/coding-stats/stats?period=30days", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCodingStats(response.data.data);
    } catch (error) {
      console.error("Error fetching coding stats:", error);
    }
  };



  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await instance.delete(`/api/v1/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const formatDuration = (ms: number, format: 'detailed' | 'simple' | 'hours' = 'detailed') => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    switch (format) {
      case 'simple':
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      case 'hours':
        return `${(ms / (1000 * 60 * 60)).toFixed(1)}h`;
      case 'detailed':
      default:
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectChartData = () => {
    return projects.map(project => ({
      name: project.name,
      duration: project.stats?.totalDuration || 0,
      sessions: project.stats?.sessions || 0,
      linesChanged: project.stats?.totalLinesChanged || 0,
      hours: (project.stats?.totalDuration || 0) / (1000 * 60 * 60)
    })).sort((a, b) => b.duration - a.duration);
  };

  const getTopLanguages = () => {
    // First try to get from real-time updates
    if (realTimeUpdates.length > 0) {
      const languageMap = new Map<string, { duration: number, files: number }>();
      
      realTimeUpdates.forEach(update => {
        if (update.language) {
          const existing = languageMap.get(update.language) || { duration: 0, files: 1 };
          existing.duration += update.duration || 0;
          existing.files = Math.max(existing.files, 1);
          languageMap.set(update.language, existing);
        }
      });
      
      if (languageMap.size > 0) {
        return Array.from(languageMap.entries())
          .sort(([, a], [, b]) => b.duration - a.duration)
          .slice(0, 5)
          .map(([language, data]) => ({
            language,
            duration: data.duration,
            files: data.files,
            percentage: ((data.duration) / (liveStats.totalDuration || 1)) * 100,
            hours: data.duration / (1000 * 60 * 60)
          }));
      }
    }
    
    // Only use codingStats if it has very recent data (within last hour)
    if (codingStats?.languageStats && Object.keys(codingStats.languageStats).length > 0) {
      // Check if the data is very recent
      const hasRecentData = Object.values(codingStats.languageStats).some((data: any) => {
        const hours = (data.duration || 0) / (1000 * 60 * 60);
        return hours > 0 && hours < 10; // Reasonable range for recent data
      });
      
      if (hasRecentData) {
        return Object.entries(codingStats.languageStats)
          .sort(([, a], [, b]) => (b.duration || 0) - (a.duration || 0))
          .slice(0, 5)
          .map(([language, data]) => ({
            language,
            duration: data.duration || 0,
            files: data.files || 0,
            percentage: ((data.duration || 0) / (codingStats.totalDuration || 1)) * 100,
            hours: (data.duration || 0) / (1000 * 60 * 60)
          }));
      }
    }
    
    return [];
  };

  const getTopFolders = () => {
    // First try to get from real-time updates
    if (realTimeUpdates.length > 0) {
      const folderMap = new Map<string, { duration: number, files: number }>();
      
      realTimeUpdates.forEach(update => {
        if (update.folder) {
          // Use the folder name sent by the extension (workspace folder name)
          const folder = update.folder;
          const existing = folderMap.get(folder) || { duration: 0, files: 1 };
          existing.duration += update.duration || 0;
          existing.files = Math.max(existing.files, 1);
          folderMap.set(folder, existing);
        }
      });
      
      if (folderMap.size > 0) {
        return Array.from(folderMap.entries())
          .sort(([, a], [, b]) => b.duration - a.duration)
          .slice(0, 5)
          .map(([folder, data]) => ({
            folder,
            duration: data.duration,
            files: data.files,
            percentage: ((data.duration) / (liveStats.totalDuration || 1)) * 100,
            hours: data.duration / (1000 * 60 * 60)
          }));
      }
    }
    
    // Only use codingStats if it has very recent data (within last hour)
    if (codingStats?.folderStats && Object.keys(codingStats.folderStats).length > 0) {
      // Check if the data is very recent
      const hasRecentData = Object.values(codingStats.folderStats).some((data: any) => {
        const hours = (data.duration || 0) / (1000 * 60 * 60);
        return hours > 0 && hours < 10; // Reasonable range for recent data
      });
      
      if (hasRecentData) {
        return Object.entries(codingStats.folderStats)
          .sort(([, a], [, b]) => (b.duration || 0) - (a.duration || 0))
          .slice(0, 5)
          .map(([folder, data]) => ({
            folder,
            duration: data.duration || 0,
            files: data.files || 0,
            percentage: ((data.duration || 0) / (codingStats.totalDuration || 1)) * 100,
            hours: (data.duration || 0) / (1000 * 60 * 60)
          }));
      }
    }
    
    return [];
  };

  const renderBarChart = (data: any[], _title: string, color: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No data available
        </div>
      );
    }
    
    const maxValue = Math.max(...data.map(d => d.hours || 0));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white font-medium truncate">{item.name || item.language || item.folder}</span>
              <span className="text-gray-400">{(item.hours || 0).toFixed(1)}h</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${maxValue > 0 ? ((item.hours || 0) / maxValue) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = (data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No data available
        </div>
      );
    }
    
    const total = data.reduce((sum, item) => sum + (item.hours || 0), 0);
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`
                }}
              />
              <span className="text-white font-medium truncate">{item.name || item.language || item.folder}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{(item.hours || 0).toFixed(1)}h</div>
              <div className="text-gray-400 text-xs">{total > 0 ? (((item.hours || 0) / total) * 100).toFixed(1) : '0'}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = (data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No data available
        </div>
      );
    }
    
    // Mock line chart data - in real app, this would be time-series data
    return (
      <div className="space-y-3">
        <div className="text-center text-gray-400 text-sm mb-4">
          Time progression over the last 30 days
        </div>
        <div className="h-32 bg-white/5 rounded-lg p-4 flex items-end justify-between">
          {data.slice(0, 7).map((item, index) => {
            const maxHours = Math.max(...data.map(d => d.hours || 0));
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-4 bg-blue-400 rounded-t transition-all duration-300 hover:bg-blue-300"
                  style={{ height: `${maxHours > 0 ? ((item.hours || 0) / maxHours) * 100 : 0}%` }}
                />
                <div className="text-xs text-gray-400 mt-1">{index + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading projects and VS Code analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error}</div>
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

  const projectChartData = getProjectChartData();
  const topLanguages = getTopLanguages();
  const topFolders = getTopFolders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">VS Code Project Analytics</h1>
              <p className="text-gray-300 text-lg">Visualize your coding time across projects</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={timeFormat} 
                onChange={(e) => setTimeFormat(e.target.value as 'detailed' | 'simple' | 'hours')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
              >
                <option value="detailed">Detailed Time</option>
                <option value="simple">Simple Time</option>
                <option value="hours">Hours Only</option>
              </select>
            </div>
          </div>

          {/* Real-time Connection Status */}
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
                    <div><span className="text-gray-400">Folder:</span> <span className="text-purple-400">{realTimeUpdates[realTimeUpdates.length - 1].folder || 'Unknown'}</span></div>
                    <div><span className="text-gray-400">Duration:</span> <span className="text-green-400">{formatDuration(realTimeUpdates[realTimeUpdates.length - 1].duration, timeFormat)}</span></div>
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
                  <div className="text-xs text-purple-400 mt-1">
                    📁 {liveStats.currentSession.folder || 'Unknown'}
                  </div>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <div className="text-sm text-gray-300">Session Duration</div>
                  <div className="font-semibold text-green-400">{formatDuration(liveStats.currentSession.duration, timeFormat)}</div>
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

          {/* Debug: Real-time Data */}
          {realTimeUpdates.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <h3 className="text-white font-bold mb-2">🔍 Debug: Real-time Data Received:</h3>
              <div className="text-white text-sm space-y-2">
                <div>Total Updates: <span className="font-semibold text-yellow-400">{realTimeUpdates.length}</span></div>
                <div>Languages Found: <span className="font-semibold text-yellow-400">{getTopLanguages().length}</span></div>
                <div>Folders Found: <span className="font-semibold text-yellow-400">{getTopFolders().length}</span></div>
                <div className="mt-3">
                  <div className="font-semibold mb-2">Latest Update Data:</div>
                  <div className="bg-black/30 p-3 rounded text-xs space-y-1">
                    <pre className="text-green-400 overflow-x-auto">
                      {JSON.stringify(realTimeUpdates[realTimeUpdates.length - 1], null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VS Code Analytics Summary */}
          {(codingStats || liveStats.totalDuration > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Total VS Code Time</p>
                    <p className="text-3xl font-bold text-white">
                      {liveStats.totalDuration > 0 ? formatDuration(liveStats.totalDuration, timeFormat) :
                       codingStats ? formatDuration(codingStats.totalDuration || 0, timeFormat) : '0h 0m'}
                    </p>
                    {liveStats.currentSession && (
                      <p className="text-xs text-green-400 mt-1">🟢 Live: {formatDuration(liveStats.currentSession.duration, timeFormat)}</p>
                    )}
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <img src="/favicon-32x32.png" alt="ThePrimeTime Logo" className="h-8 w-8" />
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
                       codingStats ? codingStats.totalSessions || 0 : 0}
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
                       codingStats ? (codingStats.totalLinesChanged || 0).toLocaleString() : '0'}
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
                    <p className="text-sm font-medium text-gray-300 mb-1">Avg Session</p>
                    <p className="text-3xl font-bold text-white">
                      {liveStats.totalDuration > 0 && liveStats.totalSessions > 0 ? 
                       formatDuration(liveStats.totalDuration / liveStats.totalSessions, 'simple') :
                       codingStats ? formatDuration(codingStats.averageSessionDuration || 0, 'simple') : '0m'}
                    </p>
                    {liveStats.currentSession && (
                      <p className="text-xs text-green-400 mt-1">🟢 Current: {formatDuration(liveStats.currentSession.duration, 'simple')}</p>
                    )}
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Time Distribution Chart */}
          {projectChartData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Project Time Distribution</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedChart('bar')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'bar' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <BarChart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedChart('pie')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'pie' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <PieChart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedChart('line')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'line' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <LineChart className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="h-64">
                {selectedChart === 'bar' && renderBarChart(projectChartData, 'Projects', 'bg-blue-500')}
                {selectedChart === 'pie' && renderPieChart(projectChartData)}
                {selectedChart === 'line' && renderLineChart(projectChartData)}
              </div>
            </div>
          )}

          {/* Language and Folder Analytics */}
          {(codingStats || realTimeUpdates.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Top Languages</h3>
                  {realTimeUpdates.length > 0 && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">🟢 Live</span>
                  )}
                </div>
                {renderBarChart(topLanguages, 'Languages', 'bg-green-500')}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Top Folders</h3>
                  {realTimeUpdates.length > 0 && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">🟢 Live</span>
                  )}
                </div>
                {renderBarChart(topFolders, 'Folders', 'bg-purple-500')}
              </div>
            </div>
          )}

          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Folder className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">
                  {project.description || "No description provided"}
                </p>

                {/* Project Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">VS Code Time</span>
                    </div>
                    <span className="text-white font-semibold">
                      {formatDuration(project.stats?.totalDuration || 0, timeFormat)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Coding Sessions</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.stats?.sessions || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Lines Changed</span>
                    </div>
                    <span className="text-white font-semibold">
                      {(project.stats?.totalLinesChanged || 0).toLocaleString()}
                    </span>
                  </div>

                  {project.stats?.lastActivity && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-300 text-sm">Last Activity</span>
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {formatDate(project.stats.lastActivity)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Install the VS Code extension and connect your API token to start tracking your coding activity automatically</p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">How to get started:</h4>
                  <ol className="text-gray-300 text-sm space-y-1 text-left max-w-md mx-auto">
                    <li>1. Install the ThePrimeTime VS Code extension</li>
                    <li>2. Get your API token from the Profile page</li>
                    <li>3. Enter the token in the extension settings</li>
                    <li>4. Start coding - data will be tracked automatically!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>


    </div>
  );
};

export default Projects;
