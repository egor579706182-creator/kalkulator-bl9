import React from 'react';
import { ButtonVariant } from '../types';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = ButtonVariant.PRIMARY, 
  className = '' 
}) => {
  const baseStyles = "h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-medium transition-all duration-150 active:scale-95 select-none touch-manipulation shadow-lg";
  
  const variants = {
    [ButtonVariant.PRIMARY]: "bg-gray-700 hover:bg-gray-600 text-white",
    [ButtonVariant.SECONDARY]: "bg-gray-300 hover:bg-gray-200 text-gray-900 font-semibold",
    [ButtonVariant.ACCENT]: "bg-orange-500 hover:bg-orange-400 text-white font-semibold",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};