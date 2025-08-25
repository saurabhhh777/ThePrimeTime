import React from 'react'
import {Timer} from 'lucide-react';
import {Link} from "react-router-dom";

interface VnavbarProps {
  className?: string;
}

const Vnavbar: React.FC<VnavbarProps> = ({ className }) => {
  return (
    <div className={`flex flex-col justify-between bg-black w-64 p-6 rounded-lg font-['Poppins'] ${className || ''}`}>
        <div className="space-y-6">
            <h2>
                <a href="/" className="flex items-center gap-2">
                    <Timer className='text-white text-2xl'/>
                    <h2 className="text-white text-xl font-bold">ThePrimeTime</h2>
                </a>
            </h2>
            <hr className='border-gray-700'/>
            <h2>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            </h2>
            <h2>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
            </h2>
            <h2>
                <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link>
            </h2>
            <h2>
                <Link to="/reports" className="text-gray-300 hover:text-white transition-colors">Reports</Link>
            </h2>
            <h2>
                <Link to="/invoice" className="text-gray-300 hover:text-white transition-colors">Invoice</Link>
            </h2>
            
        </div>
        <div className="space-y-4">
            <h2>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            </h2>
            <h2>
                <Link to="/api-docs" className="text-gray-300 hover:text-white transition-colors">Api Docs</Link>
            </h2>
            <h2>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">Faq</Link>
            </h2>
            <h2>
                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">Settings</Link>
            </h2>
        </div>
    </div>
  )
}

export default Vnavbar