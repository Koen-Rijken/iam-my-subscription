import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Success: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <Logo size="md" className="justify-center mb-6" />
        
        {loading ? (
          <>
            <div className="flex justify-center mb-6">
              <Loader className="w-16 h-16 text-[#2DD4BF] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Processing Your Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please wait while we activate your subscription...
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your subscription has been activated successfully. You can now enjoy all the features of your selected plan.
            </p>
            <button
              onClick={handleReturnHome}
              className="w-full bg-[#2DD4BF] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2DD4BF]/90 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Dashboard</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};