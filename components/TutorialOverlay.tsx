
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ArrowRight, Sparkles, Cpu, Wand2, History } from 'lucide-react';
import { Button } from './Button';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selector: string;
}

const STEPS: Step[] = [
  {
    id: 'tools',
    title: 'Choose Your Engine',
    description: 'Select the AI tool you want to target. PromptGenieX optimizes your instructions specifically for the selected model\'s logic.',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    selector: '[data-tour="tools"]'
  },
  {
    id: 'intent',
    title: 'Describe Your Intent',
    description: 'Type your idea in plain language here. Don\'t worry about clarity yet—our system will handle the heavy lifting.',
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    selector: '[data-tour="input"]'
  },
  {
    id: 'generate',
    title: 'Engineer the Prompt',
    description: 'Use the Refine button to clarify your idea, then hit Generate to compile your master prompt through our multi-stage pipeline.',
    icon: <Wand2 className="w-6 h-6 text-emerald-400" />,
    selector: '[data-tour="generate"]'
  },
  {
    id: 'vault',
    title: 'The Vault & Discovery',
    description: 'Your engineered prompts are saved in the Vault. Switch to the Discovery tab to browse patterns created by expert engineers.',
    icon: <History className="w-6 h-6 text-orange-400" />,
    selector: '[data-tour="sidebar"]'
  }
];

export const TutorialOverlay: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const pollingRef = useRef<number | null>(null);

  const updateCoords = useCallback(() => {
    const element = document.querySelector(STEPS[currentStep].selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      
      // Check if coordinates are actually valid (not all zero)
      if (rect.width > 0 || rect.height > 0) {
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsVisible(true);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    // Initial update
    updateCoords();
    
    // Polling update for the first 500ms of a step to account for transitions
    let count = 0;
    const interval = setInterval(() => {
      updateCoords();
      count++;
      if (count > 10) clearInterval(interval);
    }, 50);

    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, { passive: true });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords);
    };
  }, [updateCoords]);

  const handleNext = () => {
    setIsVisible(false);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Auto-scroll target into view for next step
      setTimeout(() => {
        const nextEl = document.querySelector(STEPS[currentStep + 1].selector);
        nextEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      onComplete();
    }
  };

  const holePadding = 12;
  const cardWidth = 320;
  const cardHeightEstimate = 250;
  const screenPadding = 20;

  // Calculate card position with viewport safety
  const isAbove = coords.top > window.innerHeight / 2;
  let cardTop = isAbove ? coords.top - 24 : coords.top + coords.height + 24;
  let cardLeft = coords.left + (coords.width / 2) - (cardWidth / 2);

  // Viewport bounds safety
  cardLeft = Math.max(screenPadding, Math.min(window.innerWidth - cardWidth - screenPadding, cardLeft));
  cardTop = Math.max(screenPadding, Math.min(window.innerHeight - cardHeightEstimate - screenPadding, cardTop));

  return (
    <div className={`fixed inset-0 z-[1000] pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dark Overlay with Dynamic Hole */}
      <div 
        className="absolute inset-0 bg-black/85 transition-all duration-500"
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${coords.left - holePadding}px 100%, 
            ${coords.left - holePadding}px ${coords.top - holePadding}px, 
            ${coords.left + coords.width + holePadding}px ${coords.top - holePadding}px, 
            ${coords.left + coords.width + holePadding}px ${coords.top + coords.height + holePadding}px, 
            ${coords.left - holePadding}px ${coords.top + coords.height + holePadding}px, 
            ${coords.left - holePadding}px 100%, 
            100% 100%, 
            100% 0%
          )`
        }}
      />

      {/* Content Card */}
      <div 
        className="absolute pointer-events-auto transition-all duration-500 flex flex-col items-center z-[1001]"
        style={{
          top: cardTop,
          left: cardLeft,
          transform: isAbove ? 'translateY(-100%)' : 'none',
          width: `${cardWidth}px`
        }}
      >
        {/* Decorative Indicator Triangle (Top if card is below, Bottom if card is above) */}
        {!isAbove && (
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-purple-500/40 mb-[-1px] transition-all" />
        )}

        <div className="glass-dark p-8 rounded-[2.5rem] border-purple-500/30 shadow-4xl w-full animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
              {STEPS[currentStep].icon}
            </div>
            <button 
              onClick={onComplete}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-black font-satoshi mb-2 tracking-tight">
            {STEPS[currentStep].title}
          </h3>
          <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
            {STEPS[currentStep].description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-purple-500' : 'w-1.5 bg-white/10'}`} 
                />
              ))}
            </div>
            <Button size="sm" onClick={handleNext} className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">
              {currentStep === STEPS.length - 1 ? 'Start Lab' : 'Next Step'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {isAbove && (
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-purple-500/40 mt-[-1px] transition-all" />
        )}
      </div>
    </div>
  );
};