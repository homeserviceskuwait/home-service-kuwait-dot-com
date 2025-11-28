import React from 'react';

interface LogoProps {
  className?: string;
  classNameText?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", classNameText = "text-xl" }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/20 ${className}`}>
        {/* Simplified House SVG Logo */}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2/3 h-2/3">
          <path d="M12 3L2 12H5V20H10V14H14V20H19V12H22L12 3Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default Logo;