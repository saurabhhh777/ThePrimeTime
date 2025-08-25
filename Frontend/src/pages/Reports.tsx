import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { 
  BarChart3, 
  Clock, 
  Code, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  Target,
  Award,
  Zap,
  Users,
  Folder,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportData {
  period: string;
  summary: {
    totalDuration: number;
    totalLinesChanged: number;
    totalCharactersTyped: number;
    totalSessions: number;
    totalFiles: number;
    averageSessionDuration: number;
    averageLinesPerSession: number;
    averageCharsPerSession: number;
  };
  languages: Record<string, any>;
  dailyActivity: Record<string, number>;
  weeklyActivity: Record<string, number>;
  hourlyActivity: Record<string, number>;
  projects: Array<{
    id: string;
    name: string;
    duration: number;
    linesChanged: number;
    charactersTyped: number;
    sessions: number;
    percentage: number;
  }>;
  productiveHours: Array<{
    hour: number;
    duration: number;
    percentage: number;
  }>;
  insights: {
    mostUsedLanguage: string;
    mostProductiveHour: number;
    totalProjects: number;
    averageProjectDuration: number;
  };
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30days');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please sign in to view reports");
        setLoading(false);
        return;
      }

      const response = await instance.get(`/api/v1/reports?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError("Failed to load reports");
      }
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      if (error.response?.status === 401) {
        setError("Please sign in to view reports");
        window.location.href = '/signin';
      } else {
        setError("Failed to load reports. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
    toast.success('Reports refreshed successfully');
  };

  const formatDuration = (ms: number) => {
    if (!ms || ms === 0) return '0m';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (ms: number) => {
    if (!ms || ms === 0) return '0m';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
        <div className="ml-[16.5rem] mr-1">
          <Hnavbar className="mt-1" />
          <main className="mt-1 ml-1 mr-1 p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-white text-xl flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                Loading reports...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
        <div className="ml-[16.5rem] mr-1">
          <Hnavbar className="mt-1" />
          <main className="mt-1 ml-1 mr-1 p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-white text-xl text-center">
                <div className="mb-4">{error}</div>
                <button 
                  onClick={() => window.location.href = '/signin'} 
                  className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
        <div className="ml-[16.5rem] mr-1">
          <Hnavbar className="mt-1" />
          <main className="mt-1 ml-1 mr-1 p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-white text-xl text-center">
                <div className="mb-4">No report data available</div>
                <button 
                  onClick={handleRefresh}
                  className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Refresh Data
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check if there's any real data
  const hasRealData = reportData.summary.totalDuration > 0 || 
                     reportData.summary.totalSessions > 0 || 
                     Object.keys(reportData.languages).length > 0;

  if (!hasRealData) {
    return (
      <div className="min-h-screen bg-black font-['Poppins']">
        <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
        <div className="ml-[16.5rem] mr-1">
          <Hnavbar className="mt-1" />
          <main className="mt-1 ml-1 mr-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
                <p className="text-gray-300 text-lg">Comprehensive insights into your coding productivity</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 text-white backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="7days" className="bg-black text-white">Last 7 Days</option>
                  <option value="30days" className="bg-black text-white">Last 30 Days</option>
                  <option value="3months" className="bg-black text-white">Last 3 Months</option>
                  <option value="yearly" className="bg-black text-white">Last Year</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* No Data Message */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Coding Data Available</h3>
                  <p className="text-gray-400 mb-6">
                    No coding activity has been tracked for this period. Connect your VS Code extension to start generating reports.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">How to get started:</h4>
                    <ol className="text-gray-300 text-sm space-y-1 text-left">
                      <li>1. Install the ThePrimeTime VS Code extension</li>
                      <li>2. Get your API token from the Profile page</li>
                      <li>3. Enter the token in the extension settings</li>
                      <li>4. Start coding - reports will be generated automatically!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </main>
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
              <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
              <p className="text-gray-300 text-lg">Comprehensive insights into your coding productivity</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 text-white backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="7days" className="bg-black text-white">Last 7 Days</option>
                <option value="30days" className="bg-black text-white">Last 30 Days</option>
                <option value="3months" className="bg-black text-white">Last 3 Months</option>
                <option value="yearly" className="bg-black text-white">Last Year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Coding Time</p>
                  <p className="text-3xl font-bold text-white">
                    {formatDuration(reportData.summary.totalDuration)}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Coding Sessions</p>
                  <p className="text-3xl font-bold text-white">
                    {reportData.summary.totalSessions}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Code className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Lines Changed</p>
                  <p className="text-3xl font-bold text-white">
                    {reportData.summary.totalLinesChanged.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Files Worked</p>
                  <p className="text-3xl font-bold text-white">
                    {reportData.summary.totalFiles}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Folder className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Language Distribution */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Language Distribution</h3>
              </div>
              <div className="space-y-4">
                {Object.keys(reportData.languages).length > 0 ? (
                  Object.entries(reportData.languages)
                    .sort(([, a], [, b]) => b.duration - a.duration)
                    .slice(0, 5)
                    .map(([language, data]) => (
                      <div key={language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          <span className="font-medium text-white">{language}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">{formatTime(data.duration)}</div>
                          <div className="text-sm text-gray-400">{data.files} files</div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No language data available
                  </div>
                )}
              </div>
            </div>

            {/* Most Productive Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Most Productive Hours</h3>
              </div>
              <div className="space-y-4">
                {reportData.productiveHours.length > 0 ? (
                  reportData.productiveHours.map((hourData, index) => (
                    <div key={hourData.hour} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                        <span className="font-medium text-white">{hourData.hour}:00</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatTime(hourData.duration)}</div>
                        <div className="text-sm text-gray-400">{hourData.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No productivity data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Performance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Project Performance</h3>
            </div>
            <div className="space-y-4">
              {reportData.projects.length > 0 ? (
                reportData.projects.slice(0, 5).map((project, index) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-yellow-500/20' : index === 1 ? 'bg-gray-500/20' : index === 2 ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{project.name}</div>
                        <div className="text-sm text-gray-400">{project.sessions} sessions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatTime(project.duration)}</div>
                      <div className="text-sm text-gray-400">{project.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No project data available
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Most Used Language</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.mostUsedLanguage}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Peak Hour</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.mostProductiveHour}:00</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Total Projects</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.totalProjects}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Avg Session</h4>
              </div>
              <p className="text-2xl font-bold text-white">{formatTime(reportData.summary.averageSessionDuration)}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;