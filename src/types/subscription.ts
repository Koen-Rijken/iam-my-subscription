export interface MySubscription {
  id: string;
  userId: string;
  planType: 'freemium' | 'developer' | 'enterprise';
  planName: string;
  tokenTier: {
    tokens: number;
    price: number;
  } | null;
  billingCycle: 'monthly' | 'annual';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  nextBillingDate: Date | null;
  remainingTokens: number;
  totalTokensPurchased: number;
  features: string[];
}

export const createDefaultSubscription = (): MySubscription => ({
  id: 'sub_' + Math.random().toString(36).substr(2, 9),
  userId: 'user_' + Math.random().toString(36).substr(2, 9),
  planType: 'freemium',
  planName: 'Freemium SaaS',
  tokenTier: null,
  billingCycle: 'monthly',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  nextBillingDate: null,
  remainingTokens: 500,
  totalTokensPurchased: 500,
  features: [
    'Basic authentication flows',
    'Basic user management',
    'Standard API & SDK access'
  ]
});