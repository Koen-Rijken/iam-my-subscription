import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { MySubscription } from '../types/subscription';

interface DebugWindowProps {
  subscription: MySubscription;
  className?: string;
}

export const DebugWindow: React.FC<DebugWindowProps> = ({
  subscription,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'null';
    return date.toISOString();
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object' && value instanceof Date) {
      return formatDate(value);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-900 text-green-400 rounded-lg shadow-2xl border border-gray-700 font-mono text-xs z-50 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4" />
          <span className="font-semibold">MySubscription Debug</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-3 max-h-96 overflow-y-auto">
          <div className="space-y-1">
            {Object.entries(subscription).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="text-blue-400 min-w-0 flex-shrink-0 mr-2">
                  {key}:
                </span>
                <span className="text-green-400 break-all">
                  {formatValue(key, value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!isExpanded && (
        <div className="px-3 pb-3 text-gray-400">
          <div className="truncate">
            Plan: {subscription.planName} | Tokens: {subscription.remainingTokens}
          </div>
        </div>
      )}
    </div>
  );
};