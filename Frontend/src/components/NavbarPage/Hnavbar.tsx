import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { House, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface HnavbarProps {
  className?: string;
}

const Hnavbar: React.FC<HnavbarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to signin page
    navigate('/signin');
  };

  const getProfileLink = () => {
    if (currentUser && currentUser.username) {
      return `/@${currentUser.username}`;
    }
    return '/profile';
  };

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