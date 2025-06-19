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
  const [mySubscription, setMySubscription] = React.useState<MySubscription>(createDefaultSubscription());

  // Update subscription when tier is selected
  React.useEffect(() => {
    if (selectedTier !== null) {
      const plans = getPricingPlans();
      const selectedPlan = plans[selectedTier.cardIndex];
      
      setMySubscription(prev => {
        const updated: MySubscription = {
          ...prev,
          updatedAt: new Date(),
        };

        // Update plan type and name
        if (selectedTier.cardIndex === 0) {
          updated.planType = 'freemium';
          updated.planName = 'Freemium SaaS';
          updated.tokenTier = null;
          updated.nextBillingDate = null;
        } else if (selectedTier.cardIndex === 1) {
          updated.planType = 'developer';
          updated.planName = 'Developer SaaS';
          updated.tokenTier = selectedPlan.tokenTiers![selectedTier.tierIndex];
          updated.nextBillingDate = new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000);
        } else if (selectedTier.cardIndex === 2) {
          updated.planType = 'enterprise';
          updated.planName = 'Enterprise SaaS';
          updated.tokenTier = selectedPlan.tokenTiers![selectedTier.tierIndex];
          updated.nextBillingDate = new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000);
        }

        // Update billing cycle
        updated.billingCycle = isAnnualBilling ? 'annual' : 'monthly';

        // Update features
        updated.features = selectedPlan.features;

        // Update tokens if a tier is selected
        if (updated.tokenTier) {
          updated.totalTokensPurchased = updated.tokenTier.tokens;
          updated.remainingTokens = updated.tokenTier.tokens;
        }

        return updated;
      });
    }
  }, [selectedTier, isAnnualBilling]);

  // Update subscription when billing cycle changes
  React.useEffect(() => {
    setMySubscription(prev => ({
      ...prev,
      billingCycle: isAnnualBilling ? 'annual' : 'monthly',
      updatedAt: new Date(),
      nextBillingDate: prev.nextBillingDate ? new Date(Date.now() + (isAnnualBilling ? 365 : 30) * 24 * 60 * 60 * 1000) : null
    }));
  }, [isAnnualBilling]);

  // Function to apply discount if annual billing is selected
  const applyDiscount = (price: number) => {
    return isAnnualBilling ? Math.round(price * 0.9 * 100) / 100 : price;
  };

  // Create pricing plans with dynamic pricing
  const getPricingPlans = () => [
    {
      title: 'Freemium SaaS',
      description: 'Forever free for small projects and testing. Never Billed!',
      buttonText: 'Current Plan',
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
      buttonText: 'Select Plan',
      icon: <TrendingUp className="w-8 h-8 text-[#2DD4BF]" />,
      features: [
        'Same as Freemium SaaS'
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
      buttonText: 'Select Plan',
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            My Subscription
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your authentication needs. Scale seamlessly as your application grows.
          </p>
        </div>

        {/* Token Counter and Billing Toggle */}
        <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
          <TokenCounter remainingTokens={mySubscription.remainingTokens} className="shadow-lg" />
          <BillingToggle 
            isAnnual={isAnnualBilling}
            onToggle={setIsAnnualBilling}
            className="shadow-lg bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
          />
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
      <DebugWindow subscription={mySubscription} />
    </div>
  );
};