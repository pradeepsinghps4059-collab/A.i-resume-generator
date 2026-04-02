'use client';

import { OnboardingFlow } from './OnboardingFlow';
import { useOnboarding } from '@/hooks/useOnboarding';

export function OnboardingManager() {
  const { showOnboarding, completeOnboarding, closeOnboarding } = useOnboarding();

  return (
    <OnboardingFlow
      isOpen={showOnboarding}
      onComplete={completeOnboarding}
      onClose={closeOnboarding}
    />
  );
}
