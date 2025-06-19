# My Subscription App

A modern subscription management application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful, responsive design with dark/light theme support
- 📊 Real-time subscription management
- 🔧 Debug window for development
- 📱 Mobile-friendly interface
- 🌙 Dark mode by default

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Development

The app uses:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development

## Features

### Subscription Plans
- **Freemium SaaS**: Forever free plan with 500 tokens
- **Developer SaaS**: Paid plans with multiple token tiers
- **Enterprise SaaS**: Advanced plans with enterprise features

### Token System
- Tokens never expire and roll over month to month
- Each token covers unlimited authentication requests for 1 monthly active user
- Global infrastructure with 99.9% uptime

### Theme Support
- Dark mode by default
- Light/dark theme toggle
- Respects system preferences

## Production Notes

For production deployment:
1. Implement proper backend API endpoints
2. Add user authentication and session management
3. Implement proper error handling and logging
4. Set up database for subscription management