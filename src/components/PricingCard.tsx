import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface TokenTier {
  tokens: number;
  price: number;
}

interface PricingCardProps {
  cardIndex: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tokenTiers?: TokenTier[];
  monthlyTokens?: number;
  monthlyPrice?: number;
  isPopular?: boolean;
  isFree?: boolean;
  buttonText?: string;
  selectedTier: {cardIndex: number, tierIndex: number} | null;
  onTierSelect: (selection: {cardIndex: number, tierIndex: number} | null) => void;
  onPurchase?: (cardIndex: number, tierIndex: number) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  cardIndex,
  title,
  description,
  icon,
  features,
  tokenTiers,
  monthlyTokens,
  monthlyPrice,
  isPopular = false,
  isFree = false,
  buttonText = 'Get Started',
  selectedTier,
  onTierSelect,
  onPurchase
}) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleTierClick = (tierIndex: number) => {
    const isCurrentlySelected = selectedTier?.cardIndex === cardIndex && selectedTier?.tierIndex === tierIndex;
    if (isCurrentlySelected) {
      onTierSelect(null); // Deselect if already selected
    } else {
      onTierSelect({ cardIndex, tierIndex }); // Select this tier
    }
  };

  const isTierSelected = (tierIndex: number) => {
    return selectedTier?.cardIndex === cardIndex && selectedTier?.tierIndex === tierIndex;
  };

  const handleButtonClick = () => {
    const isGrayButton = !hasSelectedTier && !isFree;
    if (isGrayButton && buttonText === 'Select Plan') {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // Hide warning after 3 seconds
      return;
    }
    
    // Handle purchase for paid plans
    if (hasSelectedTier && selectedTier && onPurchase && !isFree) {
      onPurchase(selectedTier.cardIndex, selectedTier.tierIndex);
    }
  };

  const hasSelectedTier = selectedTier?.cardIndex === cardIndex;
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-[#2DD4BF]/50 flex flex-col h-full">
      
      <div className="p-8 flex flex-col flex-grow">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl">
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          {isFree ? (
            <div className="space-y-3">
              <button 
                onClick={() => handleTierClick(0)}
                className={`w-full flex justify-between items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isTierSelected(0)
                    ? 'bg-[#2DD4BF] text-white' 
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`${
                  isTierSelected(0) ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {monthlyTokens} tokens
                </span>
                <span className={`font-semibold ${
                  isTierSelected(0) ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {monthlyPrice} €/mo
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tokenTiers?.map((tier, index) => (
                <button 
                  key={index}
                  onClick={() => handleTierClick(index)}
                  className={`w-full flex justify-between items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                    isTierSelected(index)
                      ? 'bg-[#2DD4BF] text-white' 
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`${
                    isTierSelected(index) ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {tier.tokens.toLocaleString()} tokens
                  </span>
                  <span className={`font-semibold ${
                    isTierSelected(index) ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {tier.price} €/mo
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8 flex-grow min-h-[200px] flex flex-col justify-start">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-[#2DD4BF] mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleButtonClick}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mt-auto ${
            !hasSelectedTier && !isFree
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-pointer'
              : 
          buttonText === 'Select Plan'
            ? 'bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 shadow-lg hover:shadow-xl'
            : isPopular
            ? 'bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 shadow-lg hover:shadow-xl'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}>
          {buttonText}
        </button>

        {/* Warning Message */}
        {showWarning && (
          <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
              Please select a token package first
            </p>
          </div>
        )}
      </div>
    </div>
  );
};