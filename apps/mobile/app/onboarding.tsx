import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OnboardingCarousel } from '../src/screens/Onboarding/OnboardingCarousel'
import { router } from 'expo-router'
import { ONBOARDING_KEY } from '../src/screens/Onboarding/constants'

export default function OnboardingPage() {
  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
    router.replace('/')
  }

  return <OnboardingCarousel onCancel={handleOnboardingFinish} />
}