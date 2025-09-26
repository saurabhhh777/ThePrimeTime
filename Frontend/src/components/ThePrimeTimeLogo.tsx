import React from "react";

interface ThePrimeTimeLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ThePrimeTimeLogo: React.FC<ThePrimeTimeLogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="14"
          y="4"
          width="4"
          height="3"
          rx="1"
          fill="currentColor"
        />
        <line
          x1="15"
          y1="2"
          x2="17"
          y2="2"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="16"
          y1="16"
          x2="10"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="16"
          r="1.5"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default ThePrimeTimeLogo;
