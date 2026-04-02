'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface Step {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const onboardingSteps: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome to ResumeAI! 🎉',
    description: 'Let\'s take a quick tour to help you create amazing resumes with AI assistance.',
    position: 'center',
  },
  {
    id: 'theme-toggle',
    title: 'Theme Toggle',
    description: 'Switch between light and dark modes to match your preference.',
    target: '[data-onboarding="theme-toggle"]',
    position: 'bottom',
  },
  {
    id: 'create-resume',
    title: 'Create Your First Resume',
    description: 'Click here to start building your professional resume with AI assistance.',
    target: '[data-onboarding="create-resume"]',
    position: 'bottom',
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Features',
    description: 'Use our AI to generate summaries, optimize for ATS, and tailor content to job descriptions.',
    target: '[data-onboarding="ai-features"]',
    position: 'top',
  },
  {
    id: 'templates',
    title: 'Professional Templates',
    description: 'Choose from multiple professionally designed templates for different industries.',
    target: '[data-onboarding="templates"]',
    position: 'top',
  },
  {
    id: 'ats-analysis',
    title: 'ATS Analysis',
    description: 'Get real-time feedback on how well your resume will perform with applicant tracking systems.',
    target: '[data-onboarding="ats-analysis"]',
    position: 'left',
  },
];

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const step = onboardingSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Highlight overlay */}
        {step.target && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)`,
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`absolute z-10 max-w-sm p-6 rounded-2xl shadow-2xl border backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-slate-700 text-white'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
          style={getTooltipPosition(step)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {step.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className={`w-full h-2 rounded-full ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-medium hover:from-brand-500 hover:to-brand-400 transition-all duration-200"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <Check size={16} />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getTooltipPosition(step: Step) {
  const baseStyles = {
    transform: 'translate(-50%, -50%)',
  };

  switch (step.position) {
    case 'center':
      return {
        ...baseStyles,
        top: '50%',
        left: '50%',
      };
    case 'top':
      return {
        ...baseStyles,
        top: '20%',
        left: '50%',
      };
    case 'bottom':
      return {
        ...baseStyles,
        bottom: '20%',
        left: '50%',
        transform: 'translate(-50%, 50%)',
      };
    case 'left':
      return {
        ...baseStyles,
        top: '50%',
        left: '20%',
      };
    case 'right':
      return {
        ...baseStyles,
        top: '50%',
        right: '20%',
        transform: 'translate(50%, -50%)',
      };
    default:
      return baseStyles;
  }
}