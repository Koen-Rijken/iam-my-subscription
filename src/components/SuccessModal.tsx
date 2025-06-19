import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  tokens: number;
  amount: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  planName,
  tokens,
  amount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your subscription to <strong>{planName}</strong> has been activated.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Plan:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{planName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Tokens:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold text-gray-900 dark:text-white">€{amount.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-[#2DD4BF] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2DD4BF]/90 transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};