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
  Folder
} from 'lucide-react';

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

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please sign in to view reports");
        setLoading(false);
        return;
      }

      const response = await instance.get(`/api/v1/reports?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error}</div>
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No report data available</div>
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
              <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
              <p className="text-gray-300 text-lg">Comprehensive insights into your coding productivity</p>
            </div>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="yearly">Last Year</option>
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Coding Time</p>
                  <p className="text-3xl font-bold text-white">
                    {formatDuration(reportData.summary.totalDuration)}
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
                    {reportData.summary.totalSessions}
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
                    {reportData.summary.totalLinesChanged.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-300 mb-1">Files Worked</p>
                  <p className="text-3xl font-bold text-white">
                    {reportData.summary.totalFiles}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Folder className="h-8 w-8 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Language Distribution */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Code className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Language Distribution</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(reportData.languages)
                  .sort(([, a], [, b]) => b.duration - a.duration)
                  .slice(0, 5)
                  .map(([language, data]) => (
                    <div key={language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
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

            {/* Most Productive Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Most Productive Hours</h3>
              </div>
              <div className="space-y-4">
                {reportData.productiveHours.map((hourData, index) => (
                  <div key={hourData.hour} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                      <span className="font-medium text-white">{hourData.hour}:00</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatTime(hourData.duration)}</div>
                      <div className="text-sm text-gray-400">{hourData.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Performance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Project Performance</h3>
            </div>
            <div className="space-y-4">
              {reportData.projects.slice(0, 5).map((project, index) => (
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
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Award className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Most Used Language</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.mostUsedLanguage}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Peak Hour</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.mostProductiveHour}:00</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Folder className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Total Projects</h4>
              </div>
              <p className="text-2xl font-bold text-white">{reportData.insights.totalProjects}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-400" />
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