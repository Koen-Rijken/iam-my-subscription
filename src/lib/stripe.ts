import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export { stripePromise };