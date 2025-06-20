import { useState } from 'react';
import { stripePromise } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createCheckoutSession = async (
    planType: string,
    tokenTier: { tokens: number; price: number },
    billingCycle: string
  ) => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planType,
          tokenTier,
          billingCycle,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      if (!data?.url) {
        throw new Error('No checkout URL received from server');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
};