import React from 'react'
import {Timer} from 'lucide-react';
import {Link, useLocation} from "react-router-dom";

interface VnavbarProps {
  className?: string;
}

const Vnavbar: React.FC<VnavbarProps> = ({ className }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`flex flex-col justify-between bg-black w-64 p-6 rounded-lg font-['Poppins'] ${className || ''}`}>
        <div className="space-y-6">
            <h2>
                <a href="/" className="flex items-center gap-2 group">
                    <Timer className='text-white text-2xl group-hover:scale-110 transition-transform duration-200'/>
                    <h2 className="text-white text-xl font-bold group-hover:text-gray-200 transition-colors">ThePrimeTime</h2>
                </a>
            </h2>
            <hr className='border-gray-700'/>
            <h2>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/projects" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/projects') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Projects
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/leaderboard" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/leaderboard') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Leaderboard
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/reports" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/reports') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Reports
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/invoice" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/invoice') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Invoice
                </Link>
            </h2>
            
        </div>
        <div className="space-y-4">
            <h2>
                <Link 
                  to="/blog" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/blog') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Blog
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/api-docs" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/api-docs') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Api Docs
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/faq" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/faq') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Faq
                </Link>
            </h2>
            <h2>
                <Link 
                  to="/settings" 
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/settings') 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Settings
                </Link>
            </h2>
        </div>
    </div>
  )
}

export default Vnavbar