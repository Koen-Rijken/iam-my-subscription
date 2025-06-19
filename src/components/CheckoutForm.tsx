import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { createPaymentIntent } from '../api/stripe-server';

interface CheckoutFormProps {
  amount: number;
  currency: string;
  planName: string;
  tokens: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  currency,
  planName,
  tokens,
  onSuccess,
  onError,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setCardError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: 'Customer Name', // In a real app, get this from user input
        },
      });

      if (paymentMethodError) {
        setCardError(paymentMethodError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // Create payment intent via our API
      const { client_secret } = await createPaymentIntent({
        amount: amount * 100, // Convert to cents
        currency,
        payment_method_id: paymentMethod.id,
        plan_name: planName,
        tokens,
      });

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(client_secret);

      if (confirmError) {
        setCardError(confirmError.message || 'Payment confirmation failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      setCardError('An unexpected error occurred');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl">
            <CreditCard className="w-8 h-8 text-[#2DD4BF]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your Purchase
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {planName} - {tokens.toLocaleString()} tokens
        </p>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          €{amount.toFixed(2)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
            <CardNumberElement options={cardElementOptions} />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expiry Date
            </label>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <CardExpiryElement options={cardElementOptions} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CVC
            </label>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <CardCvcElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {cardError && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{cardError}</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 py-3 px-6 bg-[#2DD4BF] text-white rounded-xl font-semibold hover:bg-[#2DD4BF]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay €{amount.toFixed(2)}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};