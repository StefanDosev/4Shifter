import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle = 'font-bold border-2 border-black rounded-lg transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer';

  const variants = {
    primary: 'bg-neo-black text-white shadow-neo hover:bg-gray-800',
    secondary: 'bg-white text-black shadow-neo hover:bg-gray-50',
    danger: 'bg-red-500 text-white shadow-neo hover:bg-red-600',
    ghost: 'bg-transparent border-transparent shadow-none hover:bg-gray-200 border-0 active:translate-x-0 active:translate-y-0',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
