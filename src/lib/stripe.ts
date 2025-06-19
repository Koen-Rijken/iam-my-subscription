import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Price IDs for your products (you'll need to create these in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  developer: {
    monthly: {
      1000: 'price_developer_1000_monthly',
      5000: 'price_developer_5000_monthly',
      10000: 'price_developer_10000_monthly',
    },
    annual: {
      1000: 'price_developer_1000_annual',
      5000: 'price_developer_5000_annual',
      10000: 'price_developer_10000_annual',
    }
  },
  enterprise: {
    monthly: {
      1000: 'price_enterprise_1000_monthly',
      5000: 'price_enterprise_5000_monthly',
      10000: 'price_enterprise_10000_monthly',
    },
    annual: {
      1000: 'price_enterprise_1000_annual',
      5000: 'price_enterprise_5000_annual',
      10000: 'price_enterprise_10000_annual',
    }
  }
};

// Helper function to get price ID
export const getPriceId = (
  planType: 'developer' | 'enterprise',
  tokens: number,
  billingCycle: 'monthly' | 'annual'
): string => {
  return STRIPE_PRICE_IDS[planType][billingCycle][tokens as keyof typeof STRIPE_PRICE_IDS.developer.monthly];
};