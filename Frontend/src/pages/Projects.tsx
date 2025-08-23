import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { 
  Plus, 
  Folder, 
  Clock, 
  Code, 
  FileText, 
  BarChart3, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Timer
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [timeFormat, setTimeFormat] = useState<'detailed' | 'simple' | 'hours'>('detailed');

  useEffect(() => {
    fetchProjects();
    fetchCodingStats();
  }, []);

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

  const createProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await instance.post("/api/v1/projects", newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProjects([response.data.data, ...projects]);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
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

  const getTopLanguages = () => {
    if (!codingStats?.languageStats) return [];
    return Object.entries(codingStats.languageStats)
      .sort(([, a], [, b]) => b.duration - a.duration)
      .slice(0, 3)
      .map(([language, data]) => ({
        language,
        duration: data.duration,
        files: data.files,
        percentage: (data.duration / codingStats.totalDuration) * 100
      }));
  };

  const getTopFolders = () => {
    if (!codingStats?.folderStats) return [];
    return Object.entries(codingStats.folderStats)
      .sort(([, a], [, b]) => b.duration - a.duration)
      .slice(0, 3)
      .map(([folder, data]) => ({
        folder,
        duration: data.duration,
        files: data.files,
        percentage: (data.duration / codingStats.totalDuration) * 100
      }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading projects and coding stats...
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Projects & VS Code Analytics</h1>
              <p className="text-gray-300 text-lg">Track your coding time and project progress</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={timeFormat} 
                onChange={(e) => setTimeFormat(e.target.value as 'detailed' | 'simple' | 'hours')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm"
              >
                <option value="detailed">Detailed Time</option>
                <option value="simple">Simple Time</option>
                <option value="hours">Hours Only</option>
              </select>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                New Project
              </button>
            </div>
          </div>

          {/* VS Code Analytics Summary */}
          {codingStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Total VS Code Time</p>
                    <p className="text-3xl font-bold text-white">
                      {formatDuration(codingStats.totalDuration, timeFormat)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Timer className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Coding Sessions</p>
                    <p className="text-3xl font-bold text-white">
                      {codingStats.totalSessions}
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
                      {codingStats.totalLinesChanged.toLocaleString()}
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
                    <p className="text-sm font-medium text-gray-300 mb-1">Avg Session</p>
                    <p className="text-3xl font-bold text-white">
                      {formatDuration(codingStats.averageSessionDuration, 'simple')}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Zap className="h-8 w-8 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Languages and Folders */}
          {codingStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Code className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Top Languages</h3>
                </div>
                <div className="space-y-4">
                  {getTopLanguages().map((lang, index) => (
                    <div key={lang.language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                        <span className="font-medium text-white">{lang.language}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatDuration(lang.duration, timeFormat)}</div>
                        <div className="text-sm text-gray-400">{lang.files} files</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Folder className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Top Folders</h3>
                </div>
                <div className="space-y-4">
                  {getTopFolders().map((folder, index) => (
                    <div key={folder.folder} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                        <span className="font-medium text-white">{folder.folder}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatDuration(folder.duration, timeFormat)}</div>
                        <div className="text-sm text-gray-400">{folder.files} files</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Folder className="h-6 w-6 text-blue-400" />
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
                      {formatDuration(project.stats.totalDuration, timeFormat)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Coding Sessions</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.stats.sessions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Lines Changed</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.stats.totalLinesChanged.toLocaleString()}
                    </span>
                  </div>

                  {project.stats.lastActivity && (
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
                <p className="text-gray-400 mb-6">Create your first project to start tracking your coding activity</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Create Project
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProject.name.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
