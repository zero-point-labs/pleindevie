import React from 'react';

interface CheckIconProps {
  className?: string;
  size?: number;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ 
  className = "w-5 h-5", 
  size = 20 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
