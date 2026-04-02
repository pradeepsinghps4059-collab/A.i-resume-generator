'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  content: React.ReactNode;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface HighlightedRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ResumeAI!',
    description: 'Let\'s take a quick tour to get you started with building your professional resume.',
    target: '[data-onboarding="nav"]',
    position: 'bottom',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          ResumeAI helps you create ATS-optimized resumes with AI assistance. We&apos;ll guide you through the key features.
        </p>
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Pro tip:</strong> Our AI analyzes job descriptions to suggest the most relevant content for your resume.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Resume Dashboard',
    description: 'This is where you\'ll manage all your resumes and access key features.',
    target: '[data-onboarding="dashboard"]',
    position: 'right',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Create multiple resume versions, track your progress, and access all your tools from this central hub.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Create new resumes from scratch or templates</li>
          <li>Import existing resumes for enhancement</li>
          <li>Track application status and analytics</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'builder',
    title: 'Resume Builder',
    description: 'Build your resume with our intuitive drag-and-drop editor.',
    target: '[data-onboarding="builder"]',
    position: 'top',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Our builder makes it easy to create professional resumes with real-time preview and AI suggestions.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <div className="font-medium text-green-800 dark:text-green-200">AI-Powered</div>
            <div className="text-green-700 dark:text-green-300">Smart suggestions</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
            <div className="font-medium text-purple-800 dark:text-purple-200">Templates</div>
            <div className="text-purple-700 dark:text-purple-300">Professional designs</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'templates',
    title: 'Choose Your Template',
    description: 'Select from professionally designed templates optimized for ATS systems.',
    target: '[data-onboarding="templates"]',
    position: 'bottom',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Each template is carefully crafted to pass Applicant Tracking Systems while looking great to human recruiters.
        </p>
        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>ATS-Optimized:</strong> All templates are designed to work with modern hiring software.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'ai-assistant',
    title: 'AI Writing Assistant',
    description: 'Get help writing compelling content with our AI assistant.',
    target: '[data-onboarding="ai-assistant"]',
    position: 'left',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Our AI analyzes job descriptions and suggests personalized content to help you stand out from other candidates.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Tailored suggestions based on job postings</li>
          <li>Industry-specific language and keywords</li>
          <li>Impact-focused bullet points</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'export',
    title: 'Export & Share',
    description: 'Download your resume in multiple formats or share it directly.',
    target: '[data-onboarding="export"]',
    position: 'top',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Export your resume as PDF, Word, or plain text. Share directly with recruiters or upload to job boards.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">PDF</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">Word</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">Plain Text</span>
        </div>
      </div>
    ),
  },
];

function useHighlightedRect(isOpen: boolean, target: string): HighlightedRect | null {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!isOpen || !target || typeof window === 'undefined') {
        return () => {};
      }

      const element = document.querySelector(target);
      const resizeObserver =
        typeof ResizeObserver !== 'undefined' && element
          ? new ResizeObserver(() => onStoreChange())
          : null;

      window.addEventListener('resize', onStoreChange);
      window.addEventListener('scroll', onStoreChange, true);
      if (resizeObserver && element) {
        resizeObserver.observe(element);
      }

      return () => {
        window.removeEventListener('resize', onStoreChange);
        window.removeEventListener('scroll', onStoreChange, true);
        resizeObserver?.disconnect();
      };
    },
    () => {
      if (!isOpen || !target || typeof document === 'undefined') {
        return null;
      }

      const element = document.querySelector(target);
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    },
    () => null
  );
}

export function OnboardingFlow({ isOpen, onComplete, onClose }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const highlightedRect = useHighlightedRect(isOpen, step?.target ?? '');

  useEffect(() => {
    if (!isOpen || !step) {
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, step]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (!isOpen || !step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <AnimatePresence>
          {highlightedRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div
                className="absolute rounded-lg border-2 border-blue-500 bg-blue-500/20"
                style={{
                  top: highlightedRect.top - 8,
                  left: highlightedRect.left - 8,
                  width: highlightedRect.width + 16,
                  height: highlightedRect.height + 16,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute z-10 max-w-sm"
          style={{
            top: highlightedRect
              ? step.position === 'top'
                ? highlightedRect.top - 20
                : step.position === 'bottom'
                  ? highlightedRect.bottom + 20
                  : highlightedRect.top
              : '50%',
            left: highlightedRect
              ? step.position === 'left'
                ? highlightedRect.left - 20
                : step.position === 'right'
                  ? highlightedRect.right + 20
                  : highlightedRect.left
              : '50%',
            transform: highlightedRect ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)',
          }}
        >
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {step.content}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-500'
                        : index < currentStep
                          ? 'bg-blue-300 dark:bg-blue-600'
                          : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-2 text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {currentStep + 1} of {steps.length}
                </span>

                <button
                  onClick={nextStep}
                  className="rounded-lg bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                >
                  {currentStep === steps.length - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
