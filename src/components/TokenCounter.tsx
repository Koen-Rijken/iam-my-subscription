import React from 'react';
import { Coins } from 'lucide-react';

interface TokenCounterProps {
  remainingTokens: number;
  className?: string;
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  remainingTokens,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <Coins className="w-5 h-5 text-[#2DD4BF]" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-none text-center">
          Monthly tokens remaining
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white leading-none text-center">
          {remainingTokens.toLocaleString()}
        </span>
      </div>
    </div>
  );
};