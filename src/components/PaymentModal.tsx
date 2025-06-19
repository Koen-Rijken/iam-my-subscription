import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';
import { stripePromise } from '../lib/stripe';
import { CheckoutForm } from './CheckoutForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  planName: string;
  tokens: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency,
  planName,
  tokens,
  onSuccess,
  onError
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            currency={currency}
            planName={planName}
            tokens={tokens}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};