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

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-white text-xl text-center">
              <div className="mb-4">Leaderboard Component</div>
              <p className="text-gray-400 text-sm">Real-time leaderboard coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;