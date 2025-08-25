import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { House, LogOut, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { instance } from '../../../lib/axios';

interface HnavbarProps {
  className?: string;
}

const Hnavbar: React.FC<HnavbarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    // Get current user from token and fetch profile data
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload); // Debug log
        setCurrentUser(payload);
        fetchUserProfile(); // Fetch full user data including username
        fetchNotifications();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await instance.get('/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const userData = response.data.data.user;
        console.log('Fetched user profile data:', userData);
        setCurrentUser((prev: any) => ({
          ...prev,
          username: userData.username,
          email: userData.email
        }));
        console.log('Updated currentUser with username:', userData.username);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await instance.get('/api/v1/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await instance.put(`/api/v1/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to signin page
    navigate('/signin');
  };

  const getProfileLink = () => {
    // Try to get username from currentUser state (which now includes fetched profile data)
    if (currentUser && currentUser.username) {
      const profileLink = `/@${currentUser.username}`;
      console.log('Generated profile link:', profileLink);
      return profileLink;
    }
    
    console.log('No username found, using fallback /profile');
    // If no username in state, return profile as fallback
    return '/profile';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <span className={`flex justify-between items-center bg-black text-white rounded-lg p-4 font-['Poppins'] ${className || ''}`}>
      <div className='flex items-center gap-4'>
        <h2>
            <Link to="/" className="group">
                <House className='text-white text-2xl group-hover:scale-110 group-hover:text-gray-200 transition-all duration-200'/>
            </Link>
        </h2>
      </div>
      <div className='flex items-center gap-4'>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 relative"
            title="Notifications"
          >
            <Bell className='h-4 w-4 group-hover:scale-110 transition-all duration-200'/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl z-50">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-3">Notifications</h3>
                {loadingNotifications ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No notifications</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          notification.read ? 'bg-white/5' : 'bg-white/10'
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <p className="text-white text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
          title="Logout"
        >
          <LogOut className='h-4 w-4 group-hover:scale-110 transition-all duration-200'/>
          <span className="hidden md:inline">Logout</span>
        </button>
        <h2>
          <Link to={getProfileLink()} className="group">
            <img 
              src="https://github.com/shadcn.png" 
              alt="profile" 
              className='size-8 rounded-full group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/50 transition-all duration-200'
            />
          </Link>
        </h2>
      </div>
    </span>
  )
}

export default Hnavbar