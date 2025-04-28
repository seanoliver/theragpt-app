import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { CardsScreen } from '../../src/screens/Cards/CardsScreen'
import { ONBOARDING_KEY } from '../../src/screens/Onboarding/constants'
import { useCardStore } from '../../src/store/useCardStore'

export default function Page() {
  const [_, setOnboardingComplete] = useState<boolean | null>(null)
  const { initialize } = useCardStore()

  useEffect(() => {
    // Initialize the card store
    initialize()

    // Check onboarding status
    AsyncStorage.getItem(ONBOARDING_KEY).then(value => {
      if (value === 'true') setOnboardingComplete(true)
      else router.replace('/onboarding')
    })
  }, [initialize])

  return <CardsScreen />
}
