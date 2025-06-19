import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'lg'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} w-auto`}
        viewBox="0 0 343.69 483.58"
        fill={isDark ? '#fff' : '#000'}
      >
        <path d="M171.84,34.39L34.39,171.84l137.46,137.46,137.46-137.46L171.84,34.39ZM171.84,68.1l103.74,103.74-91.89,91.89v-129.77l37.88,37.88-23.58,23.58v33.71s57.29-57.29,57.29-57.29l-83.44-83.44-83.44,83.44,57.15,57.15v-33.71l-23.44-23.44,37.74-37.74v129.49l-91.75-91.75,103.74-103.74ZM171.84,0L0,171.84l171.84,171.84,171.84-171.84L171.84,0ZM14.16,171.84L171.84,14.16l157.68,157.68-157.68,157.68L14.16,171.84ZM22,383.58v100H0v-100h22ZM44,422.58v22h22v-22h-22ZM91.35,483.5l41.33-72.25,41.33,72.25h25.35l-57.12-99.87h-19.1l-57.12,99.87h25.35ZM318.34,383.58l-41.33,72.25-41.33-72.25h-25.35v100h22v-61.54l35.12,61.4h19.1l35.12-61.4v61.54h22v-100h-25.34Z" />
      </svg>
    </div>
  );
};