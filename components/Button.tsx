import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Yellow button with dark text (High emphasis)
    primary: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/20 focus:ring-yellow-400 border border-transparent",
    // Dark button (Secondary)
    secondary: "bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-800 border border-transparent",
    // Outline button
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-900 focus:ring-slate-500",
    // White button
    white: "bg-white hover:bg-slate-50 text-slate-900 shadow-md border border-transparent"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};