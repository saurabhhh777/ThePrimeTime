import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { io, Socket } from 'socket.io-client';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Clock,
  Code,
  Globe,
  Filter,
  Search,
  Award,
  Users,
  Target,
  Zap,
  BarChart3, 
  FileText, 
  Activity,
  Calendar,
  Folder,
  RefreshCw,
  X,
  ExternalLink,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LeaderboardUser {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
  user_rank: number;
  user_id: string;
  hours_coded: number;
  daily_avg: number;
  language_used: string[];
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileData {
  user: {
    username: string;
    email: string;
    profilePicture: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
  };
  stats: {
    totalHours: number;
    weeklyHours: number;
    monthlyHours: number;
    totalActivities: number;
    totalProjects: number;
    averageSessionDuration: number;
    longestStreak: number;
    currentStreak: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
  recentActivity: Array<{
    date: string;
    hours: number;
    projects: string[];
  }>;
  topLanguages: Array<{
    name: string;
    hours: number;
    percentage: number;
  }>;
  topProjects: Array<{
    name: string;
    hours: number;
    lastActive: string;
  }>;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Real-time states
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalDuration: 0,
    totalLinesChanged: 0,
    totalCharactersTyped: 0,
    totalSessions: 0,
    currentSession: null as any
  });
  const [liveLeaderboard, setLiveLeaderboard] = useState<LeaderboardUser[]>([]);
  
  // User profile modal states
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfileData | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const countries = [
    "all", "India", "USA", "UK", "Australia", "Canada", "Germany", 
    "France", "Italy", "Spain", "Japan", "China", "Russia", 
    "Brazil", "South Africa", "Nigeria", "other"
  ];

  useEffect(() => {
    fetchLeaderboard();
    initializeWebSocket();
  }, [timeFilter]);

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

      // Update live leaderboard with real-time data
      updateLiveLeaderboard(latestUpdate);
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
        console.log('🔌 Leaderboard WebSocket connected');
      });

      socket.on('coding_update', (data: any) => {
        console.log('📊 Leaderboard received coding update:', data);
        setRealTimeUpdates(prev => [...prev, data]);
      });

      socket.on('session_update', (data: any) => {
        console.log('🔄 Leaderboard received session update:', data);
        setRealTimeUpdates(prev => [...prev, data]);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Leaderboard WebSocket disconnected');
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error('❌ Failed to initialize Leaderboard WebSocket:', error);
    }
  };

  const updateLiveLeaderboard = (latestUpdate: any) => {
    // Update the current user's stats in real-time
    if (currentUser && latestUpdate) {
      const updatedCurrentUser = {
        ...currentUser,
        hours_coded: currentUser.hours_coded + (latestUpdate.duration || 0) / (1000 * 60 * 60), // Convert ms to hours
        daily_avg: ((currentUser.hours_coded + (latestUpdate.duration || 0) / (1000 * 60 * 60)) / 30), // Assuming 30 days
        language_used: latestUpdate.language ? 
          [...new Set([...currentUser.language_used, latestUpdate.language])] : 
          currentUser.language_used
      };

      setCurrentUser(updatedCurrentUser);

      // Update the leaderboard data with real-time updates
      setLiveLeaderboard(prev => {
        const updated = prev.map(user => {
          if (user._id === currentUser._id) {
            return updatedCurrentUser;
          }
          return user;
        });
        return updated.sort((a, b) => b.hours_coded - a.hours_coded);
      });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please sign in to view leaderboard");
        setLoading(false);
        return;
      }

      // Try to fetch real data from API
      try {
        const response = await instance.get(`/api/v1/leader/global?period=${timeFilter}&country=${selectedCountry}&limit=50`);
        
        if (response.data.success && response.data.data.length > 0) {
          setLeaderboardData(response.data.data);
          // Set current user as the first one for demo purposes
          setCurrentUser(response.data.data[0]);
          return;
        }
      } catch (apiError) {
        console.log("API not available, using mock data");
      }

      // Fallback to mock data if API fails or returns no data
      const mockData: LeaderboardUser[] = [
        {
          _id: '1',
          user: {
            _id: 'user1',
            username: 'CodeMaster',
            email: 'codemaster@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 1,
          user_id: 'user1',
          hours_coded: 156,
          daily_avg: 5.2,
          language_used: ['JavaScript', 'TypeScript', 'Python'],
          country: 'USA',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '2',
          user: {
            _id: 'user2',
            username: 'DevGuru',
            email: 'devguru@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 2,
          user_id: 'user2',
          hours_coded: 142,
          daily_avg: 4.7,
          language_used: ['Python', 'Java', 'C++'],
          country: 'India',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '3',
          user: {
            _id: 'user3',
            username: 'TechWizard',
            email: 'techwizard@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 3,
          user_id: 'user3',
          hours_coded: 128,
          daily_avg: 4.3,
          language_used: ['React', 'Node.js', 'MongoDB'],
          country: 'UK',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '4',
          user: {
            _id: 'user4',
            username: 'DataNinja',
            email: 'dataninja@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 4,
          user_id: 'user4',
          hours_coded: 115,
          daily_avg: 3.8,
          language_used: ['Python', 'R', 'SQL'],
          country: 'Canada',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '5',
          user: {
            _id: 'user5',
            username: 'FullStackHero',
            email: 'fullstackhero@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 5,
          user_id: 'user5',
          hours_coded: 98,
          daily_avg: 3.3,
          language_used: ['JavaScript', 'Python', 'Go'],
          country: 'Germany',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '6',
          user: {
            _id: 'user6',
            username: 'AlgoMaster',
            email: 'algomaster@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 6,
          user_id: 'user6',
          hours_coded: 87,
          daily_avg: 2.9,
          language_used: ['C++', 'Java', 'Python'],
          country: 'Japan',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '7',
          user: {
            _id: 'user7',
            username: 'CloudArchitect',
            email: 'cloudarchitect@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 7,
          user_id: 'user7',
          hours_coded: 76,
          daily_avg: 2.5,
          language_used: ['Python', 'Terraform', 'Docker'],
          country: 'Australia',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        },
        {
          _id: '8',
          user: {
            _id: 'user8',
            username: 'MobileDev',
            email: 'mobiledev@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          user_rank: 8,
          user_id: 'user8',
          hours_coded: 65,
          daily_avg: 2.2,
          language_used: ['Swift', 'Kotlin', 'React Native'],
          country: 'France',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        }
      ];

      setLeaderboardData(mockData);
      setLiveLeaderboard(mockData); // Initialize live leaderboard
      
      // Set current user as the first one for demo purposes
      setCurrentUser(mockData[0]);
      
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      if (error.response?.status === 401) {
        setError("Please sign in to view leaderboard");
        window.location.href = '/signin';
      } else {
        setError("Failed to load leaderboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Try to fetch real user profile data
      try {
        const response = await instance.get(`/api/v1/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setSelectedUserProfile(response.data.data);
          setShowUserProfile(true);
          return;
        }
      } catch (apiError) {
        console.log("API not available, using mock profile data");
      }

      // Mock profile data
      const mockProfileData: UserProfileData = {
        user: {
          username: 'CodeMaster',
          email: 'codemaster@example.com',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Full-stack developer passionate about creating innovative solutions. Love working with React, Node.js, and Python.',
          location: 'San Francisco, CA',
          website: 'https://codemaster.dev',
          github: 'github.com/codemaster'
        },
        stats: {
          totalHours: 156,
          weeklyHours: 42,
          monthlyHours: 156,
          totalActivities: 89,
          totalProjects: 12,
          averageSessionDuration: 2.3,
          longestStreak: 15,
          currentStreak: 7
        },
        achievements: [
          {
            id: '1',
            name: 'Early Bird',
            description: 'Code for 7 days in a row',
            icon: '🌅',
            unlockedAt: '2024-01-10T00:00:00.000Z'
          },
          {
            id: '2',
            name: 'Language Master',
            description: 'Use 5 different programming languages',
            icon: '🏆',
            unlockedAt: '2024-01-15T00:00:00.000Z'
          },
          {
            id: '3',
            name: 'Night Owl',
            description: 'Code for 3 hours after midnight',
            icon: '🦉',
            unlockedAt: '2024-01-12T00:00:00.000Z'
          }
        ],
        recentActivity: [
          { date: '2024-01-17', hours: 6.5, projects: ['ThePrimeTime Extension', 'Personal Portfolio'] },
          { date: '2024-01-16', hours: 4.2, projects: ['API Backend', 'Mobile App'] },
          { date: '2024-01-15', hours: 7.1, projects: ['E-commerce Platform'] },
          { date: '2024-01-14', hours: 3.8, projects: ['Data Analysis Tool'] },
          { date: '2024-01-13', hours: 5.4, projects: ['ThePrimeTime Extension'] }
        ],
        topLanguages: [
          { name: 'JavaScript', hours: 45, percentage: 35 },
          { name: 'TypeScript', hours: 38, percentage: 29 },
          { name: 'Python', hours: 32, percentage: 25 },
          { name: 'React', hours: 28, percentage: 22 }
        ],
        topProjects: [
          { name: 'ThePrimeTime Extension', hours: 45, lastActive: '2024-01-17' },
          { name: 'Personal Portfolio', hours: 32, lastActive: '2024-01-16' },
          { name: 'API Backend', hours: 28, lastActive: '2024-01-15' },
          { name: 'Mobile App', hours: 22, lastActive: '2024-01-14' }
        ]
      };

      setSelectedUserProfile(mockProfileData);
      setShowUserProfile(true);
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUserClick = (user: LeaderboardUser) => {
    fetchUserProfile(user.user._id);
  };

  const closeUserProfile = () => {
    setShowUserProfile(false);
    setSelectedUserProfile(null);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 3) return <Award className="h-6 w-6 text-orange-400" />;
    return <Star className="h-6 w-6 text-blue-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
    if (rank === 2) return 'bg-gray-500/20 text-gray-300 border-gray-300/30';
    if (rank === 3) return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
  };

  const filteredData = leaderboardData.filter(user => {
    const matchesCountry = selectedCountry === 'all' || user.country === selectedCountry;
    const matchesSearch = user.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

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
                Loading leaderboard...
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

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Global Leaderboard</h1>
                <p className="text-gray-300 text-lg">Compete with developers worldwide</p>
              </div>
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
                    <div><span className="text-gray-400">Duration:</span> <span className="text-green-400">{((realTimeUpdates[realTimeUpdates.length - 1].duration || 0) / (1000 * 60 * 60)).toFixed(2)}h</span></div>
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
                  <div className="font-semibold text-green-400">{((liveStats.currentSession.duration || 0) / (1000 * 60 * 60)).toFixed(2)}h</div>
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
                <div>Live Stats: <span className="font-semibold text-yellow-400">{liveStats.totalDuration > 0 ? 'Active' : 'Inactive'}</span></div>
                <div>Current Session: <span className="font-semibold text-yellow-400">{liveStats.currentSession ? 'Active' : 'None'}</span></div>
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

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {countries.map(country => (
                    <option key={country} value={country} className="bg-black text-white">
                      {country === 'all' ? 'All Countries' : country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="all" className="bg-black text-white">All Time</option>
                  <option value="month" className="bg-black text-white">This Month</option>
                  <option value="week" className="bg-black text-white">This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current User Stats */}
          {currentUser && (
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={currentUser.user.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={currentUser.user.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                    />
                    <div className="absolute -top-1 -right-1">
                      {getRankIcon(currentUser.user_rank)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentUser.user.username}</h3>
                    <p className="text-gray-400">Rank #{currentUser.user_rank} • {currentUser.country}</p>
                    {realTimeUpdates.length > 0 && (
                      <p className="text-xs text-green-400 mt-1">🟢 Live: {realTimeUpdates.length} updates received</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {realTimeUpdates.length > 0 ? 
                        (currentUser.hours_coded + (liveStats.totalDuration / (1000 * 60 * 60))).toFixed(1) : 
                        currentUser.hours_coded}
                    </div>
                    <div className="text-sm text-gray-400">Hours Coded</div>
                    {liveStats.currentSession && (
                      <div className="text-xs text-green-400">🟢 +{((liveStats.currentSession.duration || 0) / (1000 * 60 * 60)).toFixed(2)}h</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {realTimeUpdates.length > 0 ? 
                        ((currentUser.hours_coded + (liveStats.totalDuration / (1000 * 60 * 60))) / 30).toFixed(1) : 
                        currentUser.daily_avg}
                    </div>
                    <div className="text-sm text-gray-400">Daily Avg</div>
                    {liveStats.currentSession && (
                      <div className="text-xs text-green-400">🟢 Live</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {realTimeUpdates.length > 0 ? 
                        [...new Set([...currentUser.language_used, ...realTimeUpdates.map(u => u.language).filter(Boolean)])].length : 
                        currentUser.language_used.length}
                    </div>
                    <div className="text-sm text-gray-400">Languages</div>
                    {realTimeUpdates.length > 0 && (
                      <div className="text-xs text-green-400">🟢 +{realTimeUpdates.filter(u => u.language).length}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Top Developers</h2>
                  <p className="text-gray-400">Showing {filteredData.length} developers</p>
                </div>
                {realTimeUpdates.length > 0 && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>🟢 Live Updates</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Developer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Country</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Hours Coded</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Daily Avg</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Languages</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(realTimeUpdates.length > 0 ? liveLeaderboard : filteredData).map((user, index) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getRankBadge(user.user_rank)}`}>
                            {getRankIcon(user.user_rank)}
                          </div>
                          <span className="text-white font-semibold">#{user.user_rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.user.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                            alt={user.user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-white">{user.user.username}</div>
                            <div className="text-sm text-gray-400">{user.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{user.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-white font-semibold">{user.hours_coded.toFixed(1)}h</span>
                          {user._id === currentUser?._id && realTimeUpdates.length > 0 && (
                            <span className="text-xs text-green-400">🟢 +{((liveStats.totalDuration / (1000 * 60 * 60))).toFixed(2)}h</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-white font-semibold">{user.daily_avg.toFixed(1)}h/day</span>
                          {user._id === currentUser?._id && liveStats.currentSession && (
                            <span className="text-xs text-green-400">🟢 Live</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.language_used.slice(0, 3).map((lang, langIndex) => (
                            <span
                              key={langIndex}
                              className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                            >
                              {lang}
                            </span>
                          ))}
                          {user.language_used.length > 3 && (
                            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                              +{user.language_used.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user._id === currentUser?._id && realTimeUpdates.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm">🟢 Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-400 text-sm">Offline</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Participants</h3>
              </div>
              <p className="text-3xl font-bold text-white">{leaderboardData.length}</p>
              <p className="text-sm text-gray-400 mt-2">Active developers worldwide</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Average Hours</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {Math.round(leaderboardData.reduce((sum, user) => sum + user.hours_coded, 0) / leaderboardData.length)}
              </p>
              <p className="text-sm text-gray-400 mt-2">Per developer this month</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Top Country</h3>
              </div>
              <p className="text-3xl font-bold text-white">USA</p>
              <p className="text-sm text-gray-400 mt-2">Most active developers</p>
            </div>
          </div>
        </main>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && selectedUserProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedUserProfile.user.username}
              </h2>
              <button onClick={closeUserProfile} className="text-white hover:text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <img
                      src={selectedUserProfile.user.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedUserProfile.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedUserProfile.user.username}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  {selectedUserProfile.user.bio || 'No bio available.'}
                </p>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  {selectedUserProfile.user.location || 'Location not specified'}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                  <ExternalLink className="h-4 w-4" />
                  {selectedUserProfile.user.website && (
                    <a href={selectedUserProfile.user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {selectedUserProfile.user.website}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                  <ExternalLink className="h-4 w-4" />
                  {selectedUserProfile.user.github && (
                    <a href={selectedUserProfile.user.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {selectedUserProfile.user.github}
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Stats</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
                  <div className="flex justify-between">
                    <span>Total Hours</span>
                    <span>{selectedUserProfile.stats.totalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Hours</span>
                    <span>{selectedUserProfile.stats.weeklyHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Hours</span>
                    <span>{selectedUserProfile.stats.monthlyHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Session Duration</span>
                    <span>{selectedUserProfile.stats.averageSessionDuration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak</span>
                    <span>{selectedUserProfile.stats.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span>{selectedUserProfile.stats.currentStreak} days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3 text-gray-300 text-sm">
                  {selectedUserProfile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-gray-400 text-xs">{activity.date}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{activity.hours}h on {activity.projects.length} projects</div>
                        <div className="text-gray-400">Projects: {activity.projects.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Activity Calendar</h3>
                </div>
                <div className="text-gray-300 text-sm">
                  {/* Placeholder for activity calendar */}
                  <p>Activity calendar data will be displayed here.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Top Projects</h3>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                {selectedUserProfile.topProjects.map((project, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-gray-400 text-xs">{project.lastActive}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{project.name}</div>
                      <div className="text-gray-400">Hours: {project.hours}h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Achievements</h3>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                {selectedUserProfile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-gray-400 text-xs">{achievement.unlockedAt}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{achievement.name}</div>
                      <div className="text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;