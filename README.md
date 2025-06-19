# My Subscription App

A modern subscription management application built with React, TypeScript, and Stripe integration.

## Features

- 🎨 Beautiful, responsive design with dark/light theme support
- 💳 Stripe payment integration
- 📊 Real-time subscription management
- 🔧 Debug window for development
- 📱 Mobile-friendly interface

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Stripe keys in `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```
4. Start the development server: `npm run dev`

## Stripe Integration

This app includes a complete Stripe integration with:
- Secure payment processing
- Multiple subscription tiers
- Annual/monthly billing options
- Real-time payment status updates

### Setting up Stripe

1. Create a Stripe account at https://dashboard.stripe.com/register
2. Get your API keys from the Developers section
3. Replace the placeholder keys in `.env` with your actual keys
4. For production, make sure to use live keys and implement proper backend security

## Development

The app uses:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Stripe Elements** for secure payment forms
- **Lucide React** for icons
- **Vite** for fast development

## Production Notes

For production deployment:
1. Implement proper backend API endpoints for Stripe operations
2. Use environment variables for all sensitive keys
3. Implement proper error handling and logging
4. Add user authentication and session management
5. Set up webhooks for subscription status updates
