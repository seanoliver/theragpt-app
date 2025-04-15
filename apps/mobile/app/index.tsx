import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingCarousel } from '../src/screens/Welcome/OnboardingCarousel';
import { WelcomeScreen } from '../src/screens/Welcome/Welcome';

const ONBOARDING_KEY = 'onboarding_complete';

export default function Page() {
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then(value => {
      setOnboardingComplete(value === 'true');
    });
  }, []);

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingComplete(true);
  };

  if (onboardingComplete === null) {
    // Optionally, show a splash/loading screen here
    return null;
  }

  if (onboardingComplete) {
    return <WelcomeScreen />;
  }

  return <OnboardingCarousel onCancel={handleOnboardingFinish} />;
}
