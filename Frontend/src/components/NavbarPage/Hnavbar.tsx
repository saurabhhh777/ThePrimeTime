import React from 'react'
import { Link } from 'react-router-dom'
import {House} from 'lucide-react';

interface HnavbarProps {
  className?: string;
}

const Hnavbar: React.FC<HnavbarProps> = ({ className }) => {
  return (
    <span className={`flex justify-between items-center bg-black text-white rounded-lg p-4 ${className || ''}`}>
      <div className='flex items-center gap-4'>
        <h2>
            <Link to="/">
                <House className='text-white text-2xl'/>
            </Link>
        </h2>
      </div>
      <div className='flex items-center gap-4'>
        <h2>
          <Link to="/profile">
            <img src="https://github.com/shadcn.png" alt="profile" className='size-8 rounded-full'/>
          </Link>
        </h2>
      </div>
    </span>
  )
}

export default Hnavbar