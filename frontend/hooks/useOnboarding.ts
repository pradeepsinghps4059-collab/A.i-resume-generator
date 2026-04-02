'use client';

import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('onboarding-completed') === 'true';
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      // Delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    closeOnboarding,
  };
}
