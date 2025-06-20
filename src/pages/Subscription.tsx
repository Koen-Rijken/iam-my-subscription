import React from 'react';
import { Gift, TrendingUp, Building2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { PricingCard } from '../components/PricingCard';
import { TokenCounter } from '../components/TokenCounter';
import { BillingToggle } from '../components/BillingToggle';
import { DebugWindow } from '../components/DebugWindow';
import { MySubscription, createDefaultSubscription } from '../types/subscription';

export const Subscription: React.FC = () => {
  const [isAnnualBilling, setIsAnnualBilling] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<{cardIndex: number, tierIndex: number} | null>(null);
  const [subscription, setSubscription] = React.useState<MySubscription>(createDefaultSubscription());

  // Update subscription when tier is selected
  React.useEffect(() => {
    if (selectedTier !== null) {
      const plans = getPricingPlans();
      const selectedPlan = plans[selectedTier.cardIndex];
      
      const updates: Partial<MySubscription> = {
        updatedAt: new Date(),
      };

      // Update plan type and name
      if (selectedTier.cardIndex === 0) {
        updates.planType = 'freemium';
        updates.planName = 'Freemium SaaS';
        updates.tokenTier = null;
        updates.nextBillingDate = null;
      } else if (selectedTier.cardIndex === 1) {
        updates.planType = 'developer';
        updates.planName = 'Developer SaaS';
        updates.tokenTier = selectedPlan.tokenTiers![selectedTier.tierIndex];
        updates.nextBillingDate = new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000);
      } else if (selectedTier.cardIndex === 2) {
        updates.planType = 'enterprise';
        updates.planName = 'Enterprise SaaS';
        updates.tokenTier = selectedPlan.tokenTiers![selectedTier.tierIndex];
        updates.nextBillingDate = new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000);
      }

      // Update billing cycle
      updates.billingCycle = isAnnualBilling ? 'annual' : 'monthly';

      // Update features
      updates.features = selectedPlan.features;

      // Update tokens if a tier is selected
      if (updates.tokenTier) {
        updates.totalTokensPurchased = updates.tokenTier.tokens;
        updates.remainingTokens = updates.tokenTier.tokens;
      }

      setSubscription(prev => ({ ...prev, ...updates }));
    }
  }, [selectedTier, isAnnualBilling]);

  // Update subscription when billing cycle changes
  React.useEffect(() => {
    setSubscription(prev => ({
      ...prev,
      billingCycle: isAnnualBilling ? 'annual' : 'monthly',
      updatedAt: new Date(),
      nextBillingDate: prev.nextBillingDate ? new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000) : null
    }));
  }, [isAnnualBilling]);

  // Handle plan selection (demo mode - no actual payment processing)
  const handlePlanActivation = (cardIndex: number, tierIndex: number) => {
    const plans = getPricingPlans();
    const selectedPlan = plans[cardIndex];
    
    // Update subscription state to reflect the selected plan
    setSubscription(prev => ({
      ...prev,
      isActive: true,
      updatedAt: new Date(),
    }));
    
    // Show success message
    if (cardIndex === 0) {
      alert('Free plan activated successfully!');
    } else {
      const tokenTier = selectedPlan.tokenTiers![tierIndex];
      alert(`Successfully activated ${selectedPlan.title} with ${tokenTier.tokens.toLocaleString()} tokens for €${tokenTier.price}/month!`);
    }
  };

  // Function to apply discount if annual billing is selected
  const applyDiscount = (price: number) => {
    return isAnnualBilling ? Math.round(price * 0.9 * 100) / 100 : price;
  };

  // Create pricing plans with dynamic pricing
  const getPricingPlans = () => [
    {
      title: 'Freemium SaaS',
      description: 'Forever free for small projects and testing. Never Billed!',
      buttonText: 'Activate Free Plan',
      icon: <Gift className="w-8 h-8 text-[#2DD4BF]" />,
      features: [
        'Basic authentication flows',
        'Basic user management',
        'Standard API & SDK access'
      ],
      monthlyTokens: 500,
      monthlyPrice: 0, // Free plan is always free
      isFree: true
    },
    {
      title: 'Developer SaaS',
      description: 'Supporting more applications and higher authentication needs.',
      buttonText: 'Activate Plan',
      icon: <TrendingUp className="w-8 h-8 text-[#2DD4BF]" />,
      features: [
        'Same as Freemium SaaS',
        'Priority support',
        'Advanced analytics'
      ],
      tokenTiers: [
        { tokens: 1000, price: applyDiscount(1) },
        { tokens: 5000, price: applyDiscount(4) },
        { tokens: 10000, price: applyDiscount(7) }
      ],
      isPopular: true
    },
    {
      title: 'Enterprise SaaS',
      description: 'Solution for organizations with complex requirements.',
      buttonText: 'Activate Plan',
      icon: <Building2 className="w-8 h-8 text-[#2DD4BF]" />,
      features: [
        'Same as Developer SaaS',
        'SAML and OIDC integration',
        'Hierarchical organization',
        'Active Directory integration',
        'User synchronization & provisioning',
        'Enterprise SLA'
      ],
      tokenTiers: [
        { tokens: 1000, price: applyDiscount(5) },
        { tokens: 5000, price: applyDiscount(20) },
        { tokens: 10000, price: applyDiscount(35) }
      ],
      isPopular: false
    }
  ];

  const pricingPlans = getPricingPlans();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Scale seamlessly with our flexible subscription plans. From free tier to enterprise solutions, 
            we have the perfect fit for your authentication needs.
          </p>
        </div>

        {/* Token Counter and Billing Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 max-w-7xl mx-auto">
          <TokenCounter remainingTokens={subscription.remainingTokens} className="shadow-lg" />
          <BillingToggle 
            isAnnual={isAnnualBilling}
            onToggle={setIsAnnualBilling}
            className="shadow-lg bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Current Plan Status */}
        <div className="bg-gradient-to-r from-[#2DD4BF]/10 to-blue-500/10 rounded-2xl p-6 mb-12 border border-[#2DD4BF]/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Plan: {subscription.planName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {subscription.isActive ? 'Active' : 'Inactive'} • 
              {subscription.remainingTokens.toLocaleString()} tokens remaining • 
              {subscription.billingCycle === 'annual' ? 'Annual' : 'Monthly'} billing
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              cardIndex={index}
              title={plan.title}
              description={plan.description}
              icon={plan.icon}
              features={plan.features}
              tokenTiers={plan.tokenTiers}
              monthlyTokens={plan.monthlyTokens}
              monthlyPrice={plan.monthlyPrice}
              isPopular={plan.isPopular}
              isFree={plan.isFree}
              buttonText={plan.buttonText}
              selectedTier={selectedTier}
              onTierSelect={setSelectedTier}
              onPurchase={handlePlanActivation}
            />
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How Our Token System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#2DD4BF] mb-2">∞</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                No Expiration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Purchased tokens never expire and roll over month to month
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#2DD4BF] mb-2">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Token = 1 Active User
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Each token covers unlimited authentication requests for 1 monthly active user
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#2DD4BF] mb-2">24/7</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Global Infrastructure
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                99.9% uptime with global CDN and redundant systems
              </p>
            </div>
          </div>
        </div>


        {/* FAQ or Contact Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Questions About Our Plans?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our team is here to help you choose the right plan and discuss custom enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#2DD4BF] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2DD4BF]/90 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Schedule a Demo
            </button>
            <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </main>
      
      {/* Debug Window */}
      <DebugWindow subscription={subscription} />
    </div>
  );
};