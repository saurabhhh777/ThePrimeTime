import React from 'react'
import { Link } from 'react-router-dom'
import {House} from 'lucide-react';

interface HnavbarProps {
  className?: string;
}

const Hnavbar: React.FC<HnavbarProps> = ({ className }) => {
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
        <h2>
          <Link to="/profile" className="group">
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