
import React from 'react';
import { Check, Sparkles, Zap, Shield, Target } from 'lucide-react';
import { Button } from '../components/Button';

export const Pricing: React.FC = () => {
  return (
    <div className="py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black font-satoshi mb-6">Choose your craft level.</h1>
        <p className="text-gray-400 text-lg">Predictable pricing for creators of all sizes.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <PriceCard 
          tier="Starter"
          price="Free"
          description="Perfect for individuals just starting their AI journey."
          features={[
            "20 prompts per month",
            "Basic engineering patterns",
            "Image & Text categories",
            "Standard STT access"
          ]}
          buttonText="Current Plan"
          variant="secondary"
        />
        <PriceCard 
          tier="Professional"
          price="$29"
          description="The essential toolkit for serious creators and freelancers."
          features={[
            "Unlimited prompt generation",
            "Premium engineering patterns",
            "All categories included",
            "Priority Gemini 3 Pro access",
            "Prompt history storage",
            "Custom style presets"
          ]}
          buttonText="Upgrade to Pro"
          isPopular
          variant="primary"
        />
        <PriceCard 
          tier="Agency"
          price="$99"
          description="Scale your creative output with team-wide capabilities."
          features={[
            "Everything in Pro",
            "Up to 5 team members",
            "Custom role definitions",
            "API access for builders",
            "Dedicated support line",
            "White-label output options"
          ]}
          buttonText="Contact Sales"
          variant="secondary"
        />
      </div>

      <div className="max-w-2xl mx-auto mt-24 glass p-8 rounded-3xl text-center">
         <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
         <h3 className="text-xl font-bold font-satoshi mb-2">Enterprise Grade Security</h3>
         <p className="text-gray-400 text-sm">
           We never train our models on your proprietary prompt data. Your ideas remain yours.
         </p>
      </div>
    </div>
  );
};

const PriceCard: React.FC<{ 
  tier: string, 
  price: string, 
  description: string, 
  features: string[], 
  buttonText: string,
  isPopular?: boolean,
  variant: any
}> = ({ tier, price, description, features, buttonText, isPopular, variant }) => (
  <div className={`glass p-8 rounded-3xl flex flex-col relative ${isPopular ? 'border-purple-500 shadow-2xl shadow-purple-500/10' : ''}`}>
    {isPopular && (
      <div className="absolute top-0 right-8 -translate-y-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        MOST POPULAR
      </div>
    )}
    <h3 className="text-xl font-bold font-satoshi mb-2">{tier}</h3>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-4xl font-black font-satoshi">{price}</span>
      {price !== 'Free' && <span className="text-gray-500">/mo</span>}
    </div>
    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
      {description}
    </p>
    
    <div className="space-y-4 mb-8 flex-1">
      {features.map((feat, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm text-gray-300">{feat}</span>
        </div>
      ))}
    </div>

    <Button variant={variant} className="w-full py-4 text-base">
      {buttonText}
    </Button>
  </div>
);
