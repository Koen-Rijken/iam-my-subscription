import { useState } from 'react';
import { stripePromise } from '../lib/stripe';
import { supabase } from '../lib/supabase';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    planType: string,
    tokenTier: { tokens: number; price: number },
    billingCycle: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planType,
          tokenTier,
          billingCycle,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

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