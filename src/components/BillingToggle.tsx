import React from 'react';

interface BillingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
  className?: string;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({
  isAnnual,
  onToggle,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className={`text-sm font-medium transition-colors ${
        !isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
      }`}>
        Monthly
      </span>
      
      <button
        onClick={() => onToggle(!isAnnual)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:ring-offset-2 ${
          isAnnual ? 'bg-[#2DD4BF]' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <div className="flex flex-col items-start mt-2">
        <span className={`text-sm font-medium transition-colors ${
          isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
        }`}>
          Annual
        </span>
        <span className="text-xs text-[#2DD4BF] font-medium leading-none">
          Save 10%
        </span>
      </div>
    </div>
  );
};